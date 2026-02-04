'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useProjectStore } from '@/lib/stores/project-store'

export function ProjectSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const projects = useProjectStore((state) => state.projects)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId)

  const currentProject = projects.find((p) => p.id === currentProjectId)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  if (projects.length === 0) {
    return (
      <Link
        href="/dashboard/projects/new"
        className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Создать проект</span>
      </Link>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <span className="text-xs font-semibold">
            {currentProject?.name.charAt(0).toUpperCase() ?? 'P'}
          </span>
        </div>
        <span className="max-w-[120px] truncate">{currentProject?.name ?? 'Проект'}</span>
        <svg
          className={`size-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-slide-in">
          <div className="max-h-64 overflow-y-auto p-1.5">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setCurrentProjectId(project.id)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  project.id === currentProjectId
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
                role="option"
                aria-selected={project.id === currentProjectId}
              >
                <div className={`flex size-8 items-center justify-center rounded-lg ${
                  project.id === currentProjectId ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <span className={`text-xs font-semibold ${
                    project.id === currentProjectId ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">{project.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{project.domain}</div>
                </div>
                {project.id === currentProjectId && (
                  <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-border p-1.5">
            <Link
              href="/dashboard/projects/new"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Новый проект</span>
            </Link>
            <Link
              href="/dashboard/projects"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span>Все проекты</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
