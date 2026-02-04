'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useCurrentProject } from '@/lib/hooks/use-current-project'
import type { Project } from '@/lib/stores/project-store'

interface ProjectContextValue {
  project: Project | null
  projectId: string | null
  setProjectId: (id: string | null) => void
  hasProjects: boolean
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const value = useCurrentProject()

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext(): ProjectContextValue {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider')
  }
  return context
}
