import { assignmentKeys } from '@/features/assignment/hooks/queries';
import {
  PaginatedAssignmentsSchema,
  type PageParams,
} from '@/features/assignment/hooks/types';
import { api } from '@/utils/networkHelper';
import { showToast } from '@/utils/toast';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { CreateAssignmentInput, UpdateAssignmentInput } from './types';

export const adminAssignmentKeys = {
  all: ['admin', 'assignments'] as const,
  lists: () => [...adminAssignmentKeys.all, 'list'] as const,
  list: (params: { page: number; pageSize: number }) =>
    [...adminAssignmentKeys.lists(), params] as const,
};

const onMutationError = () => showToast('요청에 실패했습니다', 'error');

export function useAdminAssignments({
  page = 1,
  pageSize = 20,
}: PageParams = {}) {
  const offset = (page - 1) * pageSize;
  return useQuery({
    queryKey: adminAssignmentKeys.list({ page, pageSize }),
    queryFn: async () => {
      const data = await api
        .get(`admin/assignments?offset=${offset}&limit=${pageSize}`)
        .json();
      return PaginatedAssignmentsSchema.parse(data);
    },
    placeholderData: keepPreviousData,
  });
}

export function usePublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`admin/assignments/${id}/publish`).json(),
    onError: onMutationError,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminAssignmentKeys.lists() });
    },
  });
}

export function useUnpublishAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`admin/assignments/${id}/unpublish`).json(),
    onError: onMutationError,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminAssignmentKeys.lists() });
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssignmentInput) =>
      api.post('admin/assignments', { json: data }).json(),
    onError: onMutationError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAssignmentKeys.lists() });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateAssignmentInput) =>
      api.patch(`admin/assignments/${id}`, { json: data }).json(),
    onError: onMutationError,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminAssignmentKeys.lists() });
    },
  });
}
