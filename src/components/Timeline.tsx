import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { TimelineData } from '../types';

interface TimelineProps {
  events: TimelineData[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300" />
        
        {/* Timeline events */}
        <div className="space-y-12">
          {events.map((event, index) => (
            <TimelineEvent
              key={index}
              event={event}
              position={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}