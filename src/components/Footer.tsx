'use client';

import React from 'react';

export default function Footer() {
  return (
    <section className="bg-green-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">ADDRESS</h3>
              <p className="text-sm">
                VIT Pune, 666 Upper<br />
                Indira Nagar,<br />
                Bibwewadi,<br />
                Pune-411041<br />
                Phn No:- xxxxxxxx
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Email Address</h3>
              <a href="mailto:abc@xyz.com" className="text-sm text-blue-600 hover:text-blue-800">
                abc@xyz.com
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-2">Partners</h3>
              <p className="text-sm hover:text-green-700 cursor-pointer">
                Become a Corporate Partner
              </p>
              <p className="text-sm hover:text-green-700 cursor-pointer mt-1">
                Become an NGO Partner
              </p>
            </div>
          </div>
        </div>
      </section>
  );
}
