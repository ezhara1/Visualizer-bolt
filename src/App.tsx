import React, { useState } from 'react';
import { TextInput } from './components/TextInput';
import { Timeline } from './components/Timeline';
import { TimelineData } from './types';
import { analyzeWithOpenAI } from './lib/api/openai';
import { analyzeWithMistral } from './lib/api/mistral';
import { AlertCircle } from 'lucide-react';

function App() {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string, model: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await (model === 'openai' ? analyzeWithOpenAI(text) : analyzeWithMistral(text));
      const parsedData = JSON.parse(response) as TimelineData[];
      setTimelineData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the text');
      setTimelineData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Timeline Analyzer</h1>
        <TextInput onAnalyze={handleAnalyze} loading={loading} />
        
        {error && (
          <div className="w-full max-w-4xl mx-auto p-4 mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}
        
        {timelineData.length > 0 && <Timeline events={timelineData} />}
      </div>
    </div>
  );
}

export default App;