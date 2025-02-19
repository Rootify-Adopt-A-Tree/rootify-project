'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu } from 'lucide-react';

export default function Header() {
  return (
    <nav className="bg-white shadow-sm p-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-green-700">
            <Menu className="w-6 h-6" />
          </button>
          <button className="text-gray-600 hover:text-green-700">
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
        <div className="space-x-6">
          <Link href="#about" className="text-gray-600 hover:text-green-700">About</Link>
          <Link href="#ngos" className="text-gray-600 hover:text-green-700">NGOs</Link>
          <Link href="#soultree" className="text-gray-600 hover:text-green-700">SoulTree</Link>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-bold text-green-700">Rootify</Link>
          <Image src="/tree-logo.png" alt="Tree Logo" width={24} height={24} />
        </div>
      </div>
    </nav>
  );
}
