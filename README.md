# Perfect Playlist 🎵

An AI-powered playlist generator that creates the perfect soundtrack for any vibe or occasion. Built with React Router v7 and powered by AI to understand your mood and generate custom playlists.

**[🚀 Try it live](https://perfect-playlist.onrender.com/)**

## Features

- 🤖 AI-powered playlist generation based on your mood and preferences
- 🎵 YouTube integration for seamless music playback
- 📱 Responsive design that works on all devices
- ⚡️ Fast, server-side rendered React application
- 🎨 Beautiful UI built with TailwindCSS and shadcn/ui
- 🔒 TypeScript for type safety
- 💾 Playlist saving and sharing capabilities

## Getting Started

### Installation

Install the dependencies:

```bash
yarn install
```

### Development

Start the development server with HMR:

```bash
yarn dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
yarn build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports
Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is
production-ready.

Make sure to deploy the output of `yarn build`

```
├── package.json
├── yarn.lock
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Tech Stack

- **Frontend**: React 19 + React Router v7
- **Styling**: TailwindCSS v4 + shadcn/ui components
- **AI**: Anthropic's Claude API via AI SDK
- **Database**: MongoDB
- **Build Tool**: Vite
- **Package Manager**: Yarn
- **Deployment**: Docker + Render

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ using React Router and AI.
