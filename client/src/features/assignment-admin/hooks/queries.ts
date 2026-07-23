import { api } from '@/utils/networkHelper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AssignmentSchema, type UpdateRubricItemsInput } from './types';

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

export function useUpdateRubricItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rubricItems }: UpdateRubricItemsInput) =>
      api.patch(`assignments/${id}`, { json: { rubricItems } }).json(),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}

export function usePublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`assignments/${id}/publish`).json(),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}

export function useUnpublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`assignments/${id}/unpublish`).json(),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}
