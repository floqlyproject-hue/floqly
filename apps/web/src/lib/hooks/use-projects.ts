'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useProjectStore, type Project } from '@/lib/stores/project-store'
import { useEffect } from 'react'

const PROJECTS_QUERY_KEY = ['projects']

export function useProjects() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { setProjects, addProject, updateProject, removeProject } = useProjectStore()

  const query = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Project[]
    },
  })

  // Sync with store when data changes
  useEffect(() => {
    if (query.data) {
      setProjects(query.data)
    }
  }, [query.data, setProjects])

  const createMutation = useMutation({
    mutationFn: async (newProject: { name: string; domain: string; domains?: string[] }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('projects')
        .insert({
          name: newProject.name,
          domain: newProject.domain,
          domains: newProject.domains ?? [newProject.domain],
        })
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      addProject(data)
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      updateProject(data.id, data)
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('projects').delete().eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: (id) => {
      removeProject(id)
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
