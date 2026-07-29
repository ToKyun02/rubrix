import type { SubmissionStatus } from './hooks/types';

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: '대기 중',
  GRADING: '채점 중',
  GRADED: '완료',
  FAILED: '실패',
};

export const SUBMISSION_STATUS_COLOR: Record<SubmissionStatus, string> = {
  PENDING: 'bg-subtle text-muted',
  GRADING: 'bg-blue/15 text-blue',
  GRADED: 'bg-green/15 text-green',
  FAILED: 'bg-red/15 text-red',
};
