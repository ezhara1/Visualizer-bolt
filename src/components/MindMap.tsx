import React from 'react';

interface SubCategory {
  title: string;
  insights: string[];
  opportunities: string[];
  challenges: string[];
}

interface Category {
  category: string;
  timestamp: string;
  subcategories: SubCategory[];
}

interface InsightsData {
  insights: Category[];
}

export function MindMap({ data }: { data: string }) {
  const parsedData: InsightsData = JSON.parse(data);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {parsedData.insights.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {category.category}
            {category.timestamp && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({category.timestamp})
              </span>
            )}
          </h2>
          <div className="grid gap-6">
            {category.subcategories.map((subcategory, subcategoryIndex) => (
              <div
                key={subcategoryIndex}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-700">
                  {subcategory.title}
                </h3>
                
                {/* Key Insights */}
                <div className="mb-4">
                  <h4 className="font-medium text-blue-600 mb-2">Key Insights</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {subcategory.insights.map((insight, index) => (
                      <li key={index} className="text-gray-700">{insight}</li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="mb-4">
                  <h4 className="font-medium text-green-600 mb-2">Opportunities</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {subcategory.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-gray-700">{opportunity}</li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Challenges</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {subcategory.challenges.map((challenge, index) => (
                      <li key={index} className="text-gray-700">{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
