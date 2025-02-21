"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDocs, collection } from "firebase/firestore";





interface Project {
  id: string;
  aim: string;
  contact: string;
  darpanId: string;
  email: string;
  location: string;
  ngoName: string;
  price: string;
  projectName: string;
  state: string;
  image?: string;
  treesPlanted?: number;
  volunteers?: number;
  species?: number;
  acres?: number;
  survivalRate?: number;
}

const PlantAdoption = () => {
  const [treeCount, setTreeCount] = useState(1);
  const [treeName, setTreeName] = useState("");
  const [story, setStory] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [selectedDate, setSelectedDate] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        console.log("Fetching project details for:", params.slug);
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        
        // Find the project where projectName matches the slug
        const projectDoc = projectsSnapshot.docs.find(doc => {
          const data = doc.data();
          return data.projectName.toLowerCase().replace(/\s+/g, '-') === params.slug;
        });

        if (!projectDoc) {
          setError("Project not found");
          return;
        }

        const projectData = {
          id: projectDoc.id,
          ...projectDoc.data()
        } as Project;

        console.log("Project data:", projectData);
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProjectDetails();
    }
  }, [params.slug]);

  const handleAddToCart = () => {
    console.log("Added to cart", { treeCount, treeName, story, occasion, selectedDate });
  };

  const handleAdoptNow = () => {
    router.push("/payment");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-300 w-full h-64 relative rounded-lg overflow-hidden">
            <img 
              src={project.image || "/default-project-image.jpg"} 
              alt={project.projectName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{project.projectName}</h2>
          <p className="text-lg font-semibold">Price: ₹{project.price}</p>
          <p className="text-gray-700 mt-2">{project.aim}</p>
          <div className="mt-4">
            <p className="text-sm text-gray-600">NGO: {project.ngoName}</p>
            <p className="text-sm text-gray-600">Location: {project.location}, {project.state}</p>
            <p className="text-sm text-gray-600">Contact: {project.contact}</p>
            <p className="text-sm text-gray-600">Darpan ID: {project.darpanId}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-4">
          <span>Number of trees:</span>
          <button 
            onClick={() => setTreeCount(Math.max(1, treeCount - 1))}
            className="bg-green-500 text-white w-8 h-8 rounded-full"
          >
            -
          </button>
          <span className="mx-2">{treeCount}</span>
          <button 
            onClick={() => setTreeCount(treeCount + 1)}
            className="bg-green-500 text-white w-8 h-8 rounded-full"
          >
            +
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Name your Tree"
          className="w-full border p-2 mt-2 rounded"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
        />
        
        <select 
          className="w-full border p-2 mt-2 rounded" 
          value={occasion} 
          onChange={(e) => setOccasion(e.target.value)}
        >
          <option>Birthday</option>
          <option>Anniversary</option>
          <option>Memorial</option>
        </select>
        
        <textarea
          maxLength={200}
          placeholder="Story behind tree"
          className="w-full border p-2 mt-2 rounded"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        
        <input
          type="date"
          className="w-full border p-2 mt-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4 mt-4">
        <button 
          onClick={handleAddToCart} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleAdoptNow} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Adopt Now
        </button>
      </div>
    </div>
  );
};

export default PlantAdoption;