import { api } from '@/utils/networkHelper';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { UserSchema } from './types';

export const meQueryOptions = queryOptions({
  queryKey: ['auth', 'me'],
  queryFn: async () => {
    const data = await api.get('auth/me').json();
    return UserSchema.parse(data);
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
});

export function useMe() {
  return useQuery(meQueryOptions);
}
