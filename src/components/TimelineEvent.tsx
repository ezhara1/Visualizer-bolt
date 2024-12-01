import React, { useState } from 'react';
import { TimelineData } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineEventProps {
  event: TimelineData;
  position: 'left' | 'right';
}

export function TimelineEvent({ event, position }: TimelineEventProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`flex ${position === 'right' ? 'flex-row' : 'flex-row-reverse'} items-center`}>
      {/* Content */}
      <div className={`w-5/12 ${position === 'right' ? 'pr-8' : 'pl-8'}`}>
        <div 
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {isExpanded && (
            <p className="mt-2 text-gray-600">{event.description}</p>
          )}
        </div>
      </div>

      {/* Timeline marker */}
      <div className="w-2/12 flex justify-center">
        <div className="w-4 h-4 bg-blue-500 rounded-full relative">
          <div className="absolute top-1/2 w-8 h-0.5 bg-gray-300"
               style={{ 
                 left: position === 'right' ? '100%' : 'auto',
                 right: position === 'left' ? '100%' : 'auto'
               }} 
          />
        </div>
      </div>

      {/* Date/Time */}
      <div className={`w-5/12 ${position === 'right' ? 'pl-8' : 'pr-8'}`}>
        <span className="text-sm text-gray-500">{event.timestamp}</span>
      </div>
    </div>
  );
}