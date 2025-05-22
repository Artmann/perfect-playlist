# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
the Perfect Playlist codebase - an AI-powered playlist generator.

## Project Overview

Perfect Playlist is an AI-powered music playlist generator that creates custom
playlists based on user mood and preferences. The app integrates with YouTube
for music playback and uses Anthropic's Claude API for intelligent playlist
generation.

**Live Demo**: https://perfect-playlist.onrender.com/

## Development Commands

This project uses Yarn as the package manager:

- `yarn dev` - Start development server with HMR at http://localhost:5173
- `yarn build` - Create production build
- `yarn start` - Start production server from built files
- `yarn typecheck` - Run type checking (generates types first, then runs tsc)
- `yarn format` - Format code with Prettier
- `npx shadcn@latest add <component>` - Add shadcn/ui components

## Architecture Overview

This is a React Router v7 application with full-stack capabilities:

- **Framework**: React Router v7 with SSR enabled by default
- **AI Integration**: Anthropic's Claude API via AI SDK for playlist generation
- **Music Integration**: YouTube API for music search and playback
- **Database**: MongoDB for playlist storage
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **Build Tool**: Vite with React Router plugin
- **Package Manager**: Yarn (specified in packageManager field)
- **Deployment**: Docker containerized, deployed on Render

### Key Architectural Patterns

1. **File-based Routing**: Routes are defined in `app/routes.ts` and map to
   files in `app/routes/`
   - `/` - Home page for playlist generation
   - `/playlist/$id` - Individual playlist view with YouTube player
   - `/api/generate-playlist` - API endpoint for AI playlist generation

2. **Layout System**: Root layout in `app/root.tsx` with nested `<Outlet />`
   components

3. **Component Organization**:
   - Core components: `Playlist.tsx`, `PlaylistHeader.tsx`, `SongList.tsx`, `YouTubePlayer.tsx`
   - UI components in `app/components/ui/` (shadcn/ui pattern)
   - Custom hooks in `app/lib/hooks/` for playlist state and YouTube player management
   - Utilities in `app/lib/utils.ts` and `app/lib/utils/storage.ts`
   - Type definitions in `app/lib/types/` and `app/lib/models/`
   - Path aliases configured: `~/components`, `~/lib`, `~/hooks`, etc.

### Configuration Files

- `react-router.config.ts` - React Router configuration (SSR enabled)
- `vite.config.ts` - Vite build configuration with TailwindCSS and path
  resolution
- `components.json` - shadcn/ui configuration for component generation
- `tsconfig.json` - TypeScript configuration with path mapping

### Dependencies

Key libraries in use:

- **Frontend**: React 19 with React Router v7
- **AI**: @ai-sdk/anthropic and ai for Claude API integration
- **Database**: mongodb with mongo-mock for testing
- **Styling**: TailwindCSS v4 with Radix UI primitives, tw-animate-css
- **Form handling**: react-hook-form with @hookform/resolvers and zod validation
- **Icons**: lucide-react
- **Utilities**: clsx, tailwind-merge, class-variance-authority, striptags
- **Build**: esix for enhanced development experience

## Key Features

1. **AI Playlist Generation**: Uses Claude API to generate playlists based on user mood/preferences
2. **YouTube Integration**: Seamless music playback with YouTube embed player
3. **Playlist Management**: Save, load, and share playlists with persistent storage
4. **Responsive Design**: Mobile-first design that works across all devices
5. **Real-time Updates**: Live playlist state management with custom React hooks

## Docker & Deployment

The project uses Docker with multi-stage builds optimized for Yarn:
- Development dependencies stage
- Production dependencies stage  
- Build stage
- Final runtime stage

Deployed on Render with automatic builds from the main branch.

The codebase follows React Router v7 conventions with type-safe route
definitions and automatic code splitting.

## Code Style Guidelines

### React Component Props and Object Fields

#### Prop Ordering for React Components

Follow this specific order for React component props:

1. **Special React props first**: `key`, `ref`
2. **Regular props**: All other props in alphabetical order
3. **Event handlers/methods last**: All `on*` props in alphabetical order

```tsx
// ✅ Good - props sorted with correct priority
<YouTubePlayer
  ref={player.playerRef}
  isPlaying={player.isPlaying}
  playerReady={player.playerReady}
  playerState={player.playerState}
  onTogglePlay={player.togglePlayPause}
/>

// ❌ Bad - methods mixed with regular props
<YouTubePlayer
  ref={player.playerRef}
  onTogglePlay={player.togglePlayPause}
  isPlaying={player.isPlaying}
  playerReady={player.playerReady}
  playerState={player.playerState}
/>
```

#### General Alphabetical Sorting

For other contexts, sort fields alphabetically:

```tsx
// ✅ Good - interface fields sorted alphabetically
interface Song {
  artist: string
  title: string
  youtubeId?: string
}

// ✅ Good - object literals sorted alphabetically
const playlist = {
  description: "My playlist",
  id: "123",
  songs: [],
  title: "Cool Songs"
}
```

This applies to:
- JSX element props (with special ordering above)
- Object literals
- Interface/type definitions
- Function parameters (when using object destructuring)
