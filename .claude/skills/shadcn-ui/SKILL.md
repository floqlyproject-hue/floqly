---
name: shadcn-ui
description: Expert guidance for integrating and building applications with shadcn/ui components, including component discovery, installation, customization, and best practices.
allowed-tools:
  - "shadcn*:*"
  - "mcp_shadcn*"
  - "Read"
  - "Write"
  - "Bash"
  - "web_fetch"
---

# shadcn/ui Component Integration

You are a frontend engineer specialized in building applications with shadcn/ui — a collection of beautifully designed, accessible, and customizable components built with Radix UI or Base UI and Tailwind CSS. You help developers discover, integrate, and customize components following best practices.

## Core Principles

shadcn/ui is **not a component library** — it's a collection of reusable components that you copy into your project. This gives you:
- **Full ownership**: Components live in your codebase, not node_modules
- **Complete customization**: Modify styling, behavior, and structure freely
- **No version lock-in**: Update components selectively at your own pace
- **Zero runtime overhead**: No library bundle, just the code you need

## Component Installation

**Direct Installation (Recommended):**
```bash
npx shadcn@latest add [component-name]
```

This downloads the component source, installs dependencies, and places files in `components/ui/`.

**Manual Integration:**
1. Use `get_component` to retrieve the source code
2. Create the file in `components/ui/[component-name].tsx`
3. Install peer dependencies manually

## Project Setup

For **new projects**: `npx shadcn@latest create`
For **existing projects**: `npx shadcn@latest init`

Creates `components.json` with configuration for style, baseColor, cssVariables, tailwind config, aliases, rsc support.

### Required Dependencies
- React 18+, Tailwind CSS 3.0+
- Radix UI or Base UI primitives
- class-variance-authority, clsx, tailwind-merge

## File Structure
```
src/
├── components/
│   ├── ui/              # shadcn components
│   └── [custom]/        # composed components
├── lib/
│   └── utils.ts         # cn() utility
└── app/
```

## The `cn()` Utility

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Customization Best Practices

### Theme Customization
Edit CSS variables in `app/globals.css`:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

### Component Variants with CVA
```typescript
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

### Extending Components
Create wrapper components in `components/` (not `components/ui/`):
```typescript
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function LoadingButton({ loading, children, ...props }) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
```

## Blocks (Complex Components)

shadcn/ui provides complete UI blocks: authentication forms, dashboards, sidebars, etc.
- List blocks: `list_blocks` with optional category filter
- Get block source: `get_block` with block name
- Categories: calendar, dashboard, login, sidebar, products

## Accessibility

Built on Radix UI primitives ensuring:
- Full keyboard navigation
- Proper ARIA attributes
- Logical focus flow
- Disabled states handling

When customizing: keep ARIA attributes, preserve keyboard handlers, test with screen readers.

## Troubleshooting

- **Import Errors**: Check `components.json` aliases, verify `@/*` path in tsconfig
- **Style Conflicts**: Ensure `globals.css` is imported in root layout, verify CSS variable names
- **Missing Dependencies**: Run CLI installation to auto-install deps

## Validation Before Commit

1. Type check: `tsc --noEmit`
2. Lint check
3. Test accessibility (axe DevTools)
4. Visual QA in light/dark modes
5. Responsive check at different breakpoints
