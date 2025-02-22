"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Header from '@/components/Header';

interface NGOFormData {
  name: string;
  email: string;
  contactNo: string;
  city: string;
  state: string;
  darpanId: string;
  password: string;
  description: string;
  treePlantingExperience: string;
  plantingCapacity: number;
  preferredTrees: string[];
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const TREE_TYPES = [
  "Neem",
  "Peepal",
  "Banyan",
  "Mango",
  "Ashoka",
  "Bamboo",
  "Teak",
  "Gulmohar",
  "Other"
];

export default function NGORegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otherTreeType, setOtherTreeType] = useState('');
  const [formData, setFormData] = useState<NGOFormData>({
    name: '',
    email: '',
    contactNo: '',
    city: '',
    state: '',
    darpanId: '',
    password: '',
    description: '',
    treePlantingExperience: '',
    plantingCapacity: 0,
    preferredTrees: []
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleTreeTypeChange = (type: string) => {
    if (type === "Other") {
      if (!formData.preferredTrees.includes("Other")) {
        setFormData(prev => ({
          ...prev,
          preferredTrees: [...prev.preferredTrees, "Other"]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          preferredTrees: prev.preferredTrees.filter(t => t !== "Other")
        }));
        setOtherTreeType(''); // Clear other tree type when unchecked
      }
    } else {
      setFormData(prev => ({
        ...prev,
        preferredTrees: prev.preferredTrees.includes(type)
          ? prev.preferredTrees.filter(t => t !== type)
          : [...prev.preferredTrees, type]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    // Include other tree type in the submission if specified
    const finalTreeTypes = formData.preferredTrees.includes("Other") && otherTreeType
      ? [...formData.preferredTrees.filter(t => t !== "Other"), otherTreeType]
      : formData.preferredTrees;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "ngos"), {
        ...formData,
        preferredTrees: finalTreeTypes,
        status: 'pending',
        createdAt: new Date(),
        verificationStatus: 'pending',
        treesPlanted: 0,
        activeProjects: 0,
        rating: 0
      });

      router.push(`/ngo/success?id=${docRef.id}`);
    } catch (error) {
      console.error("Error registering NGO:", error);
      alert("Error registering NGO. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f5e9]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-green-800 mb-8">REGISTER AS NGO</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">NGO Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNo: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    required
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Verification Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700 border-b pb-2">Verification Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Darpan ID</label>
                <input
                  type="text"
                  required
                  value={formData.darpanId}
                  onChange={(e) => setFormData(prev => ({ ...prev, darpanId: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Tree Planting Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700 border-b pb-2">Tree Planting Experience</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience in Tree Planting</label>
                <textarea
                  required
                  rows={3}
                  value={formData.treePlantingExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, treePlantingExperience: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Tell us about your tree planting initiatives and experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Planting Capacity (number of trees)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.plantingCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, plantingCapacity: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tree Types You Can Plant</label>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {TREE_TYPES.map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.preferredTrees.includes(type)}
                          onChange={() => handleTreeTypeChange(type)}
                          className="rounded text-green-600"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>

                  {/* Other Tree Type Input */}
                  {formData.preferredTrees.includes("Other") && (
                    <div className="mt-2 pl-6">
                      <input
                        type="text"
                        value={otherTreeType}
                        onChange={(e) => setOtherTreeType(e.target.value)}
                        placeholder="Enter other tree types (comma separated)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Please specify the other tree types you can plant
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Consent */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded text-green-600"
                />
                <label className="ml-2 text-sm text-gray-600">
                  I accept the terms and conditions*
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            <div className="text-center text-sm text-gray-500">
              Already registered? <a href="/ngo/login" className="text-green-600 hover:text-green-700">Login here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 