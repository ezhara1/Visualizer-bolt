import React from 'react';
import { Users } from 'lucide-react';

interface Party {
  name: string;
  type: string;
  timestamp: string;
  objectives: string[];
  mishaps: string[];
  results: string[];
}

interface PartyAnalysisData {
  parties: Party[];
}

export function PartyAnalysis({ data }: { data: string }) {
  const parsedData: PartyAnalysisData = JSON.parse(data);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {parsedData.parties.map((party, index) => (
        <div key={index} className="mb-8 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {party.name}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({party.type})
                </span>
              </h2>
              {party.timestamp && (
                <div className="text-sm text-gray-500">
                  {party.timestamp}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            {/* Objectives */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-600">Objectives</h3>
              <ul className="list-disc pl-5 space-y-1">
                {party.objectives.map((objective, idx) => (
                  <li key={idx} className="text-gray-700">{objective}</li>
                ))}
              </ul>
            </div>

            {/* Mishaps */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-600">Mishaps & Setbacks</h3>
              <ul className="list-disc pl-5 space-y-1">
                {party.mishaps.map((mishap, idx) => (
                  <li key={idx} className="text-gray-700">{mishap}</li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-600">Results & Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1">
                {party.results.map((result, idx) => (
                  <li key={idx} className="text-gray-700">{result}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
