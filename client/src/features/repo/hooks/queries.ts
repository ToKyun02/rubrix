import { api } from '@/utils/networkHelper';
import { showToast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import z from 'zod';
import { PullRequestSchema, RepoSchema } from './types';

export const repoKeys = {
  detail: (assignmentId: string) => ['repos', assignmentId] as const,
  pullRequests: (assignmentId: string) =>
    ['repos', assignmentId, 'pull-requests'] as const,
};

export function useAssignmentRepo(assignmentId: string) {
  return useQuery({
    queryKey: repoKeys.detail(assignmentId),
    queryFn: async () => {
      const data = await api.get(`repos/${assignmentId}`).json();
      return RepoSchema.nullable().parse(data);
    },
    throwOnError: false,
  });
}

export function useConnectRepo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      githubFullName,
    }: {
      assignmentId: string;
      githubFullName: string;
    }) => api.post('repos', { json: { assignmentId, githubFullName } }).json(),
    onError: () => showToast('레포 연결에 실패했습니다', { variant: 'error' }),
    onSuccess: (_data, { assignmentId }) => {
      queryClient.invalidateQueries({
        queryKey: repoKeys.detail(assignmentId),
      });
    },
  });
}

export function usePullRequests(assignmentId: string, enabled: boolean) {
  return useQuery({
    queryKey: repoKeys.pullRequests(assignmentId),
    queryFn: async () => {
      const data = await api.get(`repos/${assignmentId}/pull-requests`).json();
      return z.array(PullRequestSchema).parse(data);
    },
    enabled,
    throwOnError: false,
  });
}
