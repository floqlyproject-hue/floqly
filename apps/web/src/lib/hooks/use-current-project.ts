'use client'

import { useProjectStore, type Project } from '@/lib/stores/project-store'

export function useCurrentProject(): {
  project: Project | null
  projectId: string | null
  setProjectId: (id: string | null) => void
  hasProjects: boolean
} {
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const projects = useProjectStore((state) => state.projects)
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId)

  const project = projects.find((p) => p.id === currentProjectId) ?? null

  return {
    project,
    projectId: currentProjectId,
    setProjectId: setCurrentProjectId,
    hasProjects: projects.length > 0,
  }
}
