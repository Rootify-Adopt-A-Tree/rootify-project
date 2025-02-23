"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { User, LogIn } from "lucide-react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "@/lib/firebase";

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

export default function Header() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [occupation, setOccupation] = useState("");
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[rgba(18,159,92,0.15)] shadow-md z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setShowLoginDropdown(!showLoginDropdown);
                setShowProfileDropdown(false);
              }} 
              className="text-gray-600 hover:text-green-700"
            >
              <LogIn className="w-6 h-6" />
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowLoginDropdown(false);
                }} 
                className="text-gray-600 hover:text-green-700"
              >
                <User className="w-6 h-6" />
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute left-0 mt-2 bg-white shadow-md rounded-lg py-2 w-40">
                  <Link 
                    href="/user/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    User Profile
                  </Link>
                  <Link 
                    href="/organization/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Organization
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Login Dropdown */}
          {showLoginDropdown && (
            <div className="absolute mt-2 bg-white shadow-md rounded-lg py-2 w-40">
              <button 
                onClick={() => { 
                  setShowForm(true); 
                  setShowLoginDropdown(false); 
                }} 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                User
              </button>
              <Link 
                href="/organization-register" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Organisation
              </Link>
            </div>
          )}

          <div className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-green-700">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-green-700">About</Link>
            <Link href="/why" className="text-gray-600 hover:text-green-700">Why</Link>
            <Link href="/soultree" className="text-gray-600 hover:text-green-700">SoulTree</Link>
            <Link href="/transactions" className="text-gray-600 hover:text-green-700">My Adoptions</Link>
            <Link href="/organization/events" className="text-gray-600 hover:text-green-700">Events</Link>
            <Link href="/explore" className="text-gray-600 hover:text-green-700">Explore</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-bold text-green-700">Rootify</Link>
            <Image src="/images/logo/logof.png" alt="Tree Logo" width={50} height={50} />
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-700"
                >
                  <span className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden md:inline">{user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginOptions(!showLoginOptions)}
                  className="text-green-600 hover:text-green-700"
                >
                  Sign In
                </button>

                {showLoginOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      href="/user/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      User Login
                    </Link>
                    <Link
                      href="/user/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/organization/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Organization Login
                    </Link>
                    <Link
                      href="/ngo/register"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Register as NGO
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Registration Form Modal */}
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-2">
          <div className="flex flex-col space-y-2">
            <Link href="/soultree" className="block py-2 text-gray-600 hover:text-green-700">
              SoulTree
            </Link>
            <Link href="/transactions" className="block py-2 text-gray-600 hover:text-green-700">
              My Adoptions
            </Link>
            <Link href="/organization/events" className="block py-2 text-gray-600 hover:text-green-700">
              Events
            </Link>
            <Link href="/explore" className="block py-2 text-gray-600 hover:text-green-700">
              Explore
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}