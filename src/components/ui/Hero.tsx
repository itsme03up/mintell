import React from 'react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Mintell</h1>
        <p className="text-xl md:text-2xl mb-8">ゲームコミュニティ管理ツール</p>
        <div className="flex justify-center gap-4">
          <a 
            href="#features" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            機能を探索
          </a>
        </div>
      </div>
    </div>
  );
}
