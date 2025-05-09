import React from 'react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-[#14001A] to-[#6F51A1] text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Mintell</h1>
        <p className="text-xl md:text-2xl mb-8">ゲームコミュニティ管理ツール</p>
        <div className="flex justify-center gap-4">
          <a 
            href="#features" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            FC管理
          </a>
        </div>
      </div>
    </div>
  );
}
