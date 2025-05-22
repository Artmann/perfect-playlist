import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('/api/generate-playlist', 'routes/api.generate-playlist.ts'),
  route('/playlist/:id', 'routes/playlist.$id.tsx')
] satisfies RouteConfig
