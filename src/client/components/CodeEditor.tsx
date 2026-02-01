import Editor from '@monaco-editor/react';
import type { Language } from '../types';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: Language;
  readOnly?: boolean;
  height?: string;
}

const languageToMonaco: Record<Language, string> = {
  csharp: 'csharp',
  python: 'python',
  rust: 'rust',
  java: 'java',
  cpp: 'cpp',
  javascript: 'javascript',
  typescript: 'typescript',
  go: 'go',
};

export function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  height = '100%',
}: CodeEditorProps) {
  const handleChange = (newValue: string | undefined) => {
    if (onChange && newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <Editor
      height={height}
      language={languageToMonaco[language]}
      value={value}
      onChange={handleChange}
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: readOnly ? 'none' : 'line',
        cursorStyle: readOnly ? 'underline-thin' : 'line',
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
      }}
    />
  );
}
