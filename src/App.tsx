import React, { useState } from 'react';
import { TextInput } from './components/TextInput';
import { Timeline } from './components/Timeline';
import { MindMap } from './components/MindMap';
import { FinancialTable } from './components/FinancialTable';
import { PartyAnalysis } from './components/PartyAnalysis';
import { TimelineData } from './types';
import { analyzeWithOpenAI, extractBusinessInsights, extractFinancialInfo as extractFinancialInfoOpenAI, extractPartyAnalysis as extractPartyAnalysisOpenAI } from './lib/api/openai';
import { analyzeWithMistral, extractBusinessInsights as extractBusinessInsightsMistral, extractFinancialInfo as extractFinancialInfoMistral, extractPartyAnalysis as extractPartyAnalysisMistral } from './lib/api/mistral';
import { AlertCircle } from 'lucide-react';

type AnalysisType = 'timeline' | 'insights' | 'financial' | 'party';

interface AnalysisResults {
  timeline?: string;
  insights?: string;
  financial?: string;
  party?: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>('timeline');
  const [results, setResults] = useState<AnalysisResults>({});

  const analyzeText = async (text: string, model: string, type: AnalysisType) => {
    try {
      setLoading(true);
      setActiveAnalysis(type);

      // If we already have results for this type and the text hasn't changed, just switch to it
      if (results[type]) {
        return;
      }

      let result;
      if (model === 'openai') {
        switch (type) {
          case 'timeline':
            result = await analyzeWithOpenAI(text);
            break;
          case 'insights':
            result = await extractBusinessInsights(text);
            break;
          case 'financial':
            result = await extractFinancialInfoOpenAI(text);
            break;
          case 'party':
            result = await extractPartyAnalysisOpenAI(text);
            break;
        }
      } else {
        switch (type) {
          case 'timeline':
            result = await analyzeWithMistral(text);
            break;
          case 'insights':
            result = await extractBusinessInsightsMistral(text);
            break;
          case 'financial':
            result = await extractFinancialInfoMistral(text);
            break;
          case 'party':
            result = await extractPartyAnalysisMistral(text);
            break;
        }
      }

      setResults(prev => ({
        ...prev,
        [type]: result
      }));
    } catch (error) {
      console.error('Analysis error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Text Analysis Dashboard</h1>
        <TextInput onAnalyze={analyzeText} loading={loading} activeAnalysis={activeAnalysis} />
        
        <div className="mt-8">
          {activeAnalysis === 'timeline' && results.timeline && (
            <Timeline events={JSON.parse(results.timeline)} />
          )}
          
          {activeAnalysis === 'insights' && results.insights && (
            <MindMap data={results.insights} />
          )}
          
          {activeAnalysis === 'financial' && results.financial && (
            <FinancialTable data={results.financial} />
          )}

          {activeAnalysis === 'party' && results.party && (
            <PartyAnalysis data={results.party} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;