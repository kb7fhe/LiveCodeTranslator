# LiveCodeTranslator

## Project Overview
A real-time code translation application that converts code from one programming language to four others simultaneously. Users type or paste code in their preferred language, and the application displays syntactically correct translations in real-time.

## Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Code Editor**: Monaco Editor (VS Code's editor component)
- **Backend**: Node.js + Express + TypeScript
- **Translation Engine**: Claude API (Anthropic) for intelligent code translation
- **Real-time Updates**: Debounced API calls with streaming responses

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Source    │  │  Target 1   │  │  Target 2   │             │
│  │   Editor    │  │  (Python)   │  │   (Rust)    │             │
│  │  (Monaco)   │  │  (Monaco)   │  │  (Monaco)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │  Target 3   │  │  Target 4   │                              │
│  │   (Java)    │  │   (C++)     │                              │
│  │  (Monaco)   │  │  (Monaco)   │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Debounced (500ms)
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Express)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌──────────────────┐    │
│  │   Router    │─▶│ Translation     │─▶│   Claude API     │    │
│  │  /api/      │  │ Service         │  │   Integration    │    │
│  └─────────────┘  └─────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features
1. **Multi-language Support**: C#, Python, Rust, Java, C++, JavaScript, TypeScript, Go
2. **Real-time Translation**: Debounced input with 500ms delay
3. **Syntax Highlighting**: Full Monaco Editor support for all languages
4. **Error Handling**: Graceful degradation when translation fails
5. **Responsive Design**: Flexible grid layout for editor panels

### Project Structure
```
LiveCodeTranslator/
├── CLAUDE.md                 # This file - architecture docs
├── package.json              # Root package with workspaces
├── tsconfig.json             # Base TypeScript config
├── .env.example              # Environment variables template
├── .gitignore
├── vite.config.ts            # Vite configuration
├── index.html                # Entry HTML
├── src/
│   ├── client/               # Frontend React application
│   │   ├── main.tsx          # React entry point
│   │   ├── App.tsx           # Main application component
│   │   ├── components/
│   │   │   ├── CodeEditor.tsx        # Monaco editor wrapper
│   │   │   ├── LanguageSelector.tsx  # Language dropdown
│   │   │   └── TranslationGrid.tsx   # Grid of translation panels
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts        # Debounce hook
│   │   │   └── useTranslation.ts     # Translation API hook
│   │   ├── services/
│   │   │   └── api.ts                # API client
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript types
│   │   └── styles/
│   │       └── main.css              # Global styles
│   └── server/               # Backend Express application
│       ├── index.ts          # Server entry point
│       ├── routes/
│       │   └── translate.ts  # Translation endpoints
│       └── services/
│           └── translator.ts # Claude API integration
├── tests/
│   ├── client/               # Frontend tests
│   │   └── App.test.tsx
│   └── server/               # Backend tests
│       └── translator.test.ts
└── dist/                     # Build output
```

## API Design

### POST /api/translate
Translates source code to multiple target languages.

**Request:**
```json
{
  "code": "public class Hello { ... }",
  "sourceLanguage": "csharp",
  "targetLanguages": ["python", "rust", "java", "cpp"]
}
```

**Response:**
```json
{
  "translations": {
    "python": "class Hello:\n    ...",
    "rust": "struct Hello { ... }",
    "java": "public class Hello { ... }",
    "cpp": "class Hello { ... };"
  },
  "errors": {}
}
```

## Development Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server (frontend + backend)
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linter
```

## Environment Variables
```
ANTHROPIC_API_KEY=   # Required for Claude API
PORT=3001            # Backend server port
VITE_API_URL=        # Frontend API URL (defaults to /api)
```

## Design Decisions

1. **Monaco Editor**: Chosen for excellent multi-language support and VS Code familiarity
2. **Debounced Updates**: 500ms debounce prevents API spam while typing
3. **Claude API**: Provides high-quality code translation with understanding of idioms
4. **Parallel Translation**: All target languages translated concurrently
5. **TypeScript Throughout**: Type safety for both frontend and backend
