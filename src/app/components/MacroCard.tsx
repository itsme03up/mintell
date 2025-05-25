'use client';

import React from 'react';

type MacroCardProps = {
  title: string;
  content: string;
  author_name: string;
  created_at?: string;
};

const MacroCard: React.FC<MacroCardProps> = ({ title, content, author_name, created_at }) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 rounded whitespace-pre-wrap font-mono text-sm overflow-x-auto">
            {content}
          </pre>
        </div>
        <div className="mt-4 text-right text-xs text-gray-500 dark:text-gray-400">
          <p>{author_name}</p>
          {created_at && (
            <p>{new Date(created_at).toLocaleString('ja-JP')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacroCard;
