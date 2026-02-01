# LiveCodeTranslator

Real-time code translation between programming languages. Type or paste code in one language and instantly see translations to Python, Rust, Java, C++, and more.

## Features

- **Multi-language Support**: C#, Python, Rust, Java, C++, JavaScript, TypeScript, Go
- **Real-time Translation**: Automatic translation as you type (500ms debounce)
- **Syntax Highlighting**: Full Monaco Editor (VS Code) integration
- **Parallel Translation**: All target languages translated concurrently
- **Clean UI**: Dark theme optimized for code editing

## Requirements

- Node.js 18 or higher
- Anthropic API key (for Claude-powered translations)

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/kb7fhe/LiveCodeTranslator.git
   cd LiveCodeTranslator
   npm install
   ```

2. **Configure API key:**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to http://localhost:3000

## Project Structure

```
LiveCodeTranslator/
├── src/
│   ├── client/           # React frontend
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client
│   │   └── types/        # TypeScript types
│   └── server/           # Express backend
│       ├── routes/       # API routes
│       └── services/     # Translation service
├── tests/                # Test files
└── CLAUDE.md             # Architecture documentation
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |
| `PORT` | Backend server port (default: 3001) | No |
| `VITE_API_URL` | Frontend API URL (default: /api) | No |

## How It Works

1. User types code in the source editor
2. After 500ms of no typing, code is sent to the backend
3. Backend calls Claude API to translate to each target language in parallel
4. Translations are returned and displayed in the grid

## License

MIT
