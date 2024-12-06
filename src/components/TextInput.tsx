import React, { useState } from 'react';
import { Send, Loader2, LineChart, BrainCircuit, Users } from 'lucide-react';
import { Button } from './ui/Button';

type AnalysisType = 'timeline' | 'insights' | 'financial' | 'party';

interface TextInputProps {
  onAnalyze: (text: string, model: string, analysisType: AnalysisType) => void;
  loading?: boolean;
  activeAnalysis: AnalysisType;
}

export function TextInput({ onAnalyze, loading = false, activeAnalysis }: TextInputProps) {
  const [text, setText] = useState('');
  const [model, setModel] = useState('openai');

  const handleSubmit = (e: React.FormEvent, analysisType: AnalysisType) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text, model, analysisType);
    }
  };

  const getButtonClasses = (type: AnalysisType) => {
    const baseClasses = "px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[160px]";
    const activeClasses = {
      timeline: "bg-blue-600 text-white hover:bg-blue-700",
      insights: "bg-green-600 text-white hover:bg-green-700",
      financial: "bg-purple-600 text-white hover:bg-purple-700",
      party: "bg-indigo-600 text-white hover:bg-indigo-700"
    };
    const inactiveClasses = {
      timeline: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      insights: "bg-green-100 text-green-800 hover:bg-green-200",
      financial: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      party: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
    };

    return `${baseClasses} ${type === activeAnalysis ? activeClasses[type] : inactiveClasses[type]}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form className="space-y-4">
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
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            onClick={(e) => handleSubmit(e, 'timeline')}
            className={getButtonClasses('timeline')}
            disabled={loading}
          >
            {loading && activeAnalysis === 'timeline' ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            Timeline
          </Button>
          
          <Button 
            onClick={(e) => handleSubmit(e, 'insights')}
            className={getButtonClasses('insights')}
            disabled={loading}
          >
            {loading && activeAnalysis === 'insights' ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <BrainCircuit className="w-5 h-5 mr-2" />
            )}
            Key Insights
          </Button>
          
          <Button 
            onClick={(e) => handleSubmit(e, 'financial')}
            className={getButtonClasses('financial')}
            disabled={loading}
          >
            {loading && activeAnalysis === 'financial' ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <LineChart className="w-5 h-5 mr-2" />
            )}
            Financial Analysis
          </Button>

          <Button 
            onClick={(e) => handleSubmit(e, 'party')}
            className={getButtonClasses('party')}
            disabled={loading}
          >
            {loading && activeAnalysis === 'party' ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Users className="w-5 h-5 mr-2" />
            )}
            Party Analysis
          </Button>
        </div>
      </form>
    </div>
  );
}