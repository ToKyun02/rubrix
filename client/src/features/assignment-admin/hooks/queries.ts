import { api } from '@/utils/networkHelper';
import { showToast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AssignmentSchema,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from './types';

export const assignmentKeys = {
  all: ['assignments'] as const,
  list: () => [...assignmentKeys.all, 'list'] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
};

const onMutationError = () => showToast('요청에 실패했습니다', 'error');

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

export function usePublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`assignments/${id}/publish`).json(),
    onError: onMutationError,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}

export function useUnpublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`assignments/${id}/unpublish`).json(),
    onError: onMutationError,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssignmentInput) =>
      api.post('assignments', { json: data }).json(),
    onError: onMutationError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateAssignmentInput) =>
      api.patch(`assignments/${id}`, { json: data }).json(),
    onError: onMutationError,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.list() });
    },
  });
}
