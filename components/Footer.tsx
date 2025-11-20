import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center space-y-2">
        <div className="flex items-center gap-1 text-blue-900 font-semibold">
          พัฒนาโดย ครูกิ๊กจ้า <Heart className="w-4 h-4 text-pink-500 fill-current" />
        </div>
        <div className="text-sm text-gray-500">
          กฤติยา พลหาญ | <a href="https://www.kkclassvip.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">www.kkclassvip.com</a>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          © {new Date().getFullYear()} KK Leave System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};