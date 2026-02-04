import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  name: string
  domain: string
  domains: string[]
  created_at: string
  updated_at: string
  user_id: string
  settings?: {
    widget_installed?: boolean
    primary_color?: string
  }
}

interface ProjectStore {
  currentProjectId: string | null
  projects: Project[]
  setCurrentProjectId: (id: string | null) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  getCurrentProject: () => Project | null
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      currentProjectId: null,
      projects: [],

      setCurrentProjectId: (id) => set({ currentProjectId: id }),

      setProjects: (projects) => {
        set({ projects })
        // Auto-select first project if none selected
        const state = get()
        if (!state.currentProjectId && projects.length > 0) {
          set({ currentProjectId: projects[0].id })
        }
      },

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
          currentProjectId: state.currentProjectId ?? project.id,
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      removeProject: (id) =>
        set((state) => {
          const newProjects = state.projects.filter((p) => p.id !== id)
          return {
            projects: newProjects,
            currentProjectId:
              state.currentProjectId === id
                ? newProjects[0]?.id ?? null
                : state.currentProjectId,
          }
        }),

      getCurrentProject: () => {
        const state = get()
        return state.projects.find((p) => p.id === state.currentProjectId) ?? null
      },
    }),
    {
      name: 'floqly-project-store',
      partialize: (state) => ({ currentProjectId: state.currentProjectId }),
    }
  )
)
