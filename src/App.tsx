import React, { useState } from 'react';
import { TextInput } from './components/TextInput';
import { Timeline } from './components/Timeline';
import { MindMap } from './components/MindMap';
import { FinancialTable } from './components/FinancialTable';
import { PartyAnalysis } from './components/PartyAnalysis';
import { analyzeAllData } from './lib/api/combinedApi'; // A new combined API call that returns all results

function App() {
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState('timeline');
  const [results, setResults] = useState(null);

  const analyzeText = async (text, model) => {
    try {
      setLoading(true);

      // Single query to get all results at once
      const allResults = await analyzeAllData(text, model);
      setResults(allResults);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Text Analysis Dashboard</h1>
        <TextInput onAnalyze={analyzeText} loading={loading} activeAnalysis={activeAnalysis} />

        {results && (
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
        )}
      </div>
    </div>
  );
}
