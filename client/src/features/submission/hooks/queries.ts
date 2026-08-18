import { repoKeys } from '@/features/repo/hooks/queries';
import { api } from '@/utils/networkHelper';
import { showToast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { HTTPError } from 'ky';
import { z } from 'zod';
import {
  SubmissionDetailSchema,
  SubmissionStatsSchema,
  SubmissionSummaryRowSchema,
  SubmissionSummarySchema,
} from './types';

export const submissionKeys = {
  detail: (id: string) => ['submissions', id] as const,
  list: (assignmentId: string) =>
    ['submissions', 'list', assignmentId] as const,
};

export function useCreateSubmission(assignmentId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (pullRequestId: string) => {
      const data = await api
        .post('submissions', { json: { pullRequestId } })
        .json();
      return SubmissionSummarySchema.pick({ id: true }).parse(data);
    },
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 409) {
        showToast('이미 제출한 PR이에요', { variant: 'error' });
        return;
      }
      showToast('제출에 실패했습니다', { variant: 'error' });
    },
    onSuccess: (submission) => {
      showToast('제출됐어요');
      queryClient.invalidateQueries({
        queryKey: repoKeys.pullRequests(assignmentId),
      });
      navigate({ to: '/submissions/$id', params: { id: submission.id } });
    },
  });
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: async () => {
      const data = await api.get(`submissions/${id}`).json();
      return SubmissionDetailSchema.parse(data);
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'GRADING' ? 2000 : false;
    },
  });
}

export function useSubmissionList(assignmentId: string, enabled: boolean) {
  return useQuery({
    queryKey: submissionKeys.list(assignmentId),
    queryFn: async () => {
      const data = await api
        .get('submissions', { searchParams: { assignmentId } })
        .json();
      return z.array(SubmissionSummarySchema).parse(data);
    },
    enabled,
    throwOnError: false,
  });
}

export function useSubmissionStats() {
  return useQuery({
    queryKey: ['submissions', 'stats'],
    queryFn: async () => {
      const data = await api.get('submissions/stats').json();
      return SubmissionStatsSchema.parse(data);
    },
  });
}

export function useSubmissionSummary() {
  return useQuery({
    queryKey: ['submissions', 'summary'],
    queryFn: async () => {
      const data = await api.get('submissions/summary').json();
      return z.array(SubmissionSummaryRowSchema).parse(data);
    },
  });
}
