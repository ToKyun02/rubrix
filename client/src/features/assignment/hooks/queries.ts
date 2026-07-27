import { api } from '@/utils/networkHelper';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  AssignmentSchema,
  PaginatedAssignmentsSchema,
  type PageParams,
} from './types';

export const assignmentKeys = {
  all: ['assignments'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (params: { page: number; pageSize: number }) =>
    [...assignmentKeys.lists(), params] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
};

export function useAssignments({ page = 1, pageSize = 20 }: PageParams = {}) {
  const offset = (page - 1) * pageSize;
  return useQuery({
    queryKey: assignmentKeys.list({ page, pageSize }),
    queryFn: async () => {
      const data = await api
        .get(`assignments?offset=${offset}&limit=${pageSize}`)
        .json();
      return PaginatedAssignmentsSchema.parse(data);
    },
    placeholderData: keepPreviousData,
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
