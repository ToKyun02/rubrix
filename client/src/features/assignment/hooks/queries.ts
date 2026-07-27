import { api } from '@/utils/networkHelper';
import { useQuery } from '@tanstack/react-query';
import { AssignmentSchema } from './types';

export const assignmentKeys = {
  all: ['assignments'] as const,
  list: () => [...assignmentKeys.all, 'list'] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
};

export function useAssignments() {
  return useQuery({
    queryKey: assignmentKeys.list(),
    queryFn: async () => {
      const data = await api.get('assignments').json();
      return AssignmentSchema.array().parse(data);
    },
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: async () => {
      const data = await api.get(`assignments/${id}`).json();
      return AssignmentSchema.parse(data);
    },
  });
}
