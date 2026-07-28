import { api } from '@/utils/networkHelper';
import { useQuery } from '@tanstack/react-query';
import { GithubAppStatusSchema, GithubRepoListSchema } from './types';

export const githubAppKeys = {
  status: ['github-app', 'status'] as const,
  repos: ['github-app', 'repos'] as const,
};

export function useGithubAppStatus() {
  return useQuery({
    queryKey: githubAppKeys.status,
    queryFn: async () => {
      const data = await api.get('github-app/status').json();
      return GithubAppStatusSchema.parse(data);
    },
  });
}

export function useGithubRepos(enabled: boolean) {
  return useQuery({
    queryKey: githubAppKeys.repos,
    queryFn: async () => {
      const data = await api.get('github-app/repos').json();
      return GithubRepoListSchema.parse(data);
    },
    enabled,
  });
}
