import React from 'react';

interface FinancialItem {
  metric: string;
  value: string;
  period: string;
  parties?: string[];
  type: 'transaction' | 'metric' | 'asset' | 'liability';
  notes: string;
}

interface FinancialCategory {
  category: string;
  items: FinancialItem[];
}

interface FinancialTableProps {
  data: FinancialCategory[];
}

export function FinancialTable({ data }: FinancialTableProps) {
  return (
    <div className="w-full p-4 overflow-x-auto">
      {data.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">{category.category}</h2>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Item
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Value
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Period
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Parties
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {category.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {item.metric}
                    </td>
                    <td className={`px-3 py-4 text-sm ${item.type === 'transaction' ? 'font-semibold text-green-600' : 'text-gray-900'}`}>
                      {item.value}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {item.period}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        item.type === 'transaction' ? 'bg-green-100 text-green-800' :
                        item.type === 'metric' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'asset' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {item.parties ? item.parties.join(', ') : '-'}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {item.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
