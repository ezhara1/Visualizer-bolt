import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

interface TextInputProps {
  onAnalyze: (text: string, model: string) => void;
  loading?: boolean;
}

export function TextInput({ onAnalyze, loading = false }: TextInputProps) {
  const [text, setText] = useState('');
  const [model, setModel] = useState('openai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text, model);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
            disabled={loading}
          >
            <option value="openai">OpenAI</option>
            <option value="mistral">Mistral</option>
          </select>
        </div>
        <div className="flex gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="flex-1 p-4 border rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          />
          <Button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            Analyze
          </Button>
        </div>
      </form>
    </div>
  );
}