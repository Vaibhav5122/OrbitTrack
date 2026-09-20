"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProjects,
  getProjectById,
  createProject,
  getClients,
  type Project,
  type CreateProjectPayload,
  type Client,
} from "../api/projects";

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects", "list"],
    queryFn: () => getProjects(),
    staleTime: 15 * 1000,
  });
}

export function useProject(id: string) {
  return useQuery<Project, Error>({
    queryKey: ["projects", "detail", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectPayload>({
    mutationFn: (payload) => createProject(payload),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Project created successfully", {
        description: `"${newProject.name}" has been established.`,
      });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Project creation failed", {
        description: error.response?.data?.message || error.message || "Unable to create project",
      });
    },
  });
}

export function useClients() {
  return useQuery<Client[], Error>({
    queryKey: ["clients", "list"],
    queryFn: () => getClients(),
    staleTime: 60 * 1000,
  });
}
