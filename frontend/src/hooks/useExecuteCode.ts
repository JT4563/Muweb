import { useMutation, useQuery } from "@tanstack/react-query";
import {
  api,
  type ExecuteCodePayload,
  type ExecutionResult,
} from "../services/api";
import type { AxiosError } from "axios";

export const useExecuteCode = () => {
  return useMutation<ExecutionResult, AxiosError, ExecuteCodePayload>({
    mutationFn: async (payload) => {
      const response = await api.execute.run(payload);
      return response.data.data;
    },
    onError: (error) => {
      console.error(
        "Code execution error:",
        error.response?.data || error.message
      );
    },
  });
};

export const useExecutionHistory = () => {
  return useQuery({
    queryKey: ["executionHistory"],
    queryFn: async () => {
      const response = await api.execute.history();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
};
