import { api } from '@/utils/networkHelper';
import { showToast } from '@/utils/toast';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { UserSchema } from './types';

export const meQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: async () => {
    const res = await api.get('auth/me', { throwHttpErrors: false });
    if (res.status === 401) return null;
    const data = await res.json();
    return UserSchema.parse(data);
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
});

export function useMe() {
  return useQuery(meQueryOptions);
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.post('auth/logout'),
    onSuccess: () => {
      window.location.href = window.location.origin + '/login';
    },
    onError: () => {
      showToast('네트워크 오류로 인해 로그아웃에 실패했습니다.', {
        variant: 'error',
      });
    },
  });
}
