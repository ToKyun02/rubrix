import { repoKeys } from '@/features/repo/hooks/queries';
import { api } from '@/utils/networkHelper';
import { showToast } from '@/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';

export function useCreateSubmission(assignmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pullRequestId: string) =>
      api.post('submissions', { json: { pullRequestId } }).json(),
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 409) {
        showToast('이미 제출한 PR이에요', 'error');
        return;
      }
      showToast('제출에 실패했습니다', 'error');
    },
    onSuccess: () => {
      showToast('제출됐어요', 'success');
      queryClient.invalidateQueries({
        queryKey: repoKeys.pullRequests(assignmentId),
      });
    },
  });
}
