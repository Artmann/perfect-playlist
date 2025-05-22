# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

This project uses Yarn as the package manager:

- `yarn dev` - Start development server with HMR at http://localhost:5173
- `yarn build` - Create production build
- `yarn start` - Start production server from built files
- `yarn typecheck` - Run type checking (generates types first, then runs tsc)
- `npx shadcn@latest add button` - Add shadcn/ui components (replace "button"
  with component name)

## Architecture Overview

This is a React Router v7 application with full-stack capabilities:

- **Framework**: React Router v7 with SSR enabled by default
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **Build Tool**: Vite with React Router plugin
- **Package Manager**: Yarn (specified in packageManager field)

### Key Architectural Patterns

1. **File-based Routing**: Routes are defined in `app/routes.ts` and map to
   files in `app/routes/`
2. **Layout System**: Root layout in `app/root.tsx` with nested `<Outlet />`
   components
3. **Component Organization**:
   - UI components in `app/components/ui/` (shadcn/ui pattern)
   - Utilities in `app/lib/utils.ts`
   - Path aliases configured: `~/components`, `~/lib`, `~/hooks`, etc.

### Configuration Files

- `react-router.config.ts` - React Router configuration (SSR enabled)
- `vite.config.ts` - Vite build configuration with TailwindCSS and path
  resolution
- `components.json` - shadcn/ui configuration for component generation
- `tsconfig.json` - TypeScript configuration with path mapping

### Dependencies

Key libraries in use:

- React 19 with React Router v7
- TailwindCSS v4 with Radix UI primitives
- Form handling: react-hook-form with zod validation
- Icons: lucide-react
- Utility: clsx, tailwind-merge, class-variance-authority

The codebase follows React Router v7 conventions with type-safe route
definitions and automatic code splitting.
