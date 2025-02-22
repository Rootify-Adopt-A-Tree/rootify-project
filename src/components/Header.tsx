// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ShoppingCart, Menu } from 'lucide-react';

// export default function Header() {
//   return (
//     <nav className="bg-white shadow-sm p-4 fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           <button className="text-gray-600 hover:text-green-700">
//             <Menu className="w-6 h-6" />
//           </button>
//           <button className="text-gray-600 hover:text-green-700">
//             <ShoppingCart className="w-6 h-6" />
//           </button>
//         </div>
//         <div className="space-x-6">
//           <Link href="#about" className="text-gray-600 hover:text-green-700">About</Link>
//           <Link href="#ngos" className="text-gray-600 hover:text-green-700">NGOs</Link>
//           <Link href="#soultree" className="text-gray-600 hover:text-green-700">SoulTree</Link>
//           <Link href="/transactions" className="text-gray-600 hover:text-gray-900">
//             My Adoptions
//           </Link>
//           <Link href="/explore" className="text-gray-600 hover:text-green-700">
//             Explore Map
//           </Link>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Link href="/" className="text-2xl font-bold text-green-700">Rootify</Link>
//           <Image src="/tree-logo.png" alt="Tree Logo" width={24} height={24} />
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { User, LogIn } from "lucide-react";

async function addDataToFirestore(name: string, email: string, password: string, phone: string, dob: string, city: string, occupation: string) {
  try {
    const docRef = await addDoc(collection(db, "person"), {
      name,
      email,
      password,
      phone,
      dob,
      city,
      occupation,
    });
    console.log("Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document", error);
    return false;
  }
}

export default function RegisterUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [occupation, setOccupation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const added = await addDataToFirestore(name, email, password, phone, dob, city, occupation);
    if (added) {
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setDob("");
      setCity("");
      setOccupation("");
      setShowForm(false);
      alert("Data added to Firebase successfully!");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm p-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowForm(true)} className="text-gray-600 hover:text-green-700">
              <LogIn className="w-6 h-6" />
            </button>
            <Link href="/profile" className="text-gray-600 hover:text-green-700">
              <User className="w-6 h-6" />
            </Link>
          </div>
          <div className="space-x-6">
            <Link href="#about" className="text-gray-600 hover:text-green-700">About</Link>
            <Link href="#ngos" className="text-gray-600 hover:text-green-700">NGOs</Link>
            <Link href="#soultree" className="text-gray-600 hover:text-green-700">SoulTree</Link>
            <Link href="/transactions" className="text-gray-600 hover:text-gray-900">My Adoptions</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-bold text-green-700">Rootify</Link>
            <Image src="/tree-logo.png" alt="Tree Logo" width={24} height={24} />
          </div>
        </div>
      </nav>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">✖</button>
            <h1 className="text-2xl font-bold mb-5 text-center">Register</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded-lg" />
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Register</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
