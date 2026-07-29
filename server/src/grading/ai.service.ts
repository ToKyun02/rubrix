import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RubricItem } from '../generated/prisma/client';

interface GradingResult {
  scores: { rubricItemId: string; score: number; summary: string }[];
  comments: {
    filePath: string;
    lineNumber: number;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    tag: string;
    body: string;
  }[];
}

const GRADE_TOOL: Anthropic.Tool = {
  name: 'submit_grades',
  description: '루브릭 항목별 점수와 코드 리뷰 코멘트를 제출합니다.',
  input_schema: {
    type: 'object',
    properties: {
      scores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            rubricItemId: { type: 'string' },
            score: { type: 'integer' },
            summary: { type: 'string' },
          },
          required: ['rubricItemId', 'score', 'summary'],
        },
      },
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePath: { type: 'string' },
            lineNumber: { type: 'integer' },
            severity: { type: 'string', enum: ['INFO', 'WARNING', 'CRITICAL'] },
            tag: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['filePath', 'lineNumber', 'severity', 'tag', 'body'],
        },
      },
    },
    required: ['scores', 'comments'],
  },
};

@Injectable()
export class AiService {
  private readonly client: Anthropic;

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.getOrThrow<string>('ANTHROPIC_API_KEY'),
    });
  }

  async grade(
    requirementsMd: string,
    rubricItems: Pick<RubricItem, 'id' | 'name' | 'points' | 'aiGuide'>[],
    diff: string,
  ): Promise<GradingResult> {
    const rubricText = rubricItems
      .map(
        (r) =>
          `- id: ${r.id} / ${r.name} (${r.points}점)\n  채점 기준: ${r.aiGuide}`,
      )
      .join('\n');

    const message = await this.client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 4096,
      tools: [GRADE_TOOL],
      tool_choice: { type: 'tool', name: 'submit_grades' },
      messages: [
        {
          role: 'user',
          content: `너는 코딩 과제를 채점하는 채점관이야. 아래 과제 요구사항과 루브릭을 기준으로, 제출된 PR의 코드 변경 내용을 채점해.

## 과제 요구사항
${requirementsMd}

## 루브릭
${rubricText}

## PR 변경 내용
${diff}

각 루브릭 항목마다 0~만점 사이 점수와 이유를 채점하고, 코드에서 눈에 띄는 문제가 있으면 파일·라인 단위 리뷰 코멘트도 남겨.`,
        },
      ],
    });

    const toolUse = message.content.find((c) => c.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('채점 결과를 받지 못했습니다.');
    }

    return toolUse.input as GradingResult;
  }
}
