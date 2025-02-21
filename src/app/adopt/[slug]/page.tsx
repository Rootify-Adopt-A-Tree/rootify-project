"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PlantAdoption = () => {
  const [treeCount, setTreeCount] = useState(1);
  const [treeName, setTreeName] = useState("");
  const [story, setStory] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [selectedDate, setSelectedDate] = useState("");
  const router = useRouter();

  const project = {
    name: "Mission Taljai",
    price: "$12 per tree",
    description: "Help restore the green cover of Taljai forest by adopting a tree!",
    image: "/taljai-forest.jpg",
    treesPlanted: 800,
    volunteers: 200,
    species: 20,
    acres: 50,
    survivalRate: 90,
  };

  const handleAddToCart = () => {
    console.log("Added to cart", { treeCount, treeName, story, occasion, selectedDate });
  };

  const handleAdoptNow = () => {
    router.push("/payment");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-300 w-full h-64 relative">
            <Image src={project.image} alt={project.name} layout="fill" objectFit="cover" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-lg font-semibold">Price: {project.price}</p>
          <p className="text-gray-700 mt-2">{project.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div>{project.treesPlanted} trees planted</div>
            <div>{project.volunteers} volunteers joined</div>
            <div>{project.species} different species</div>
            <div>{project.acres} acres covered</div>
            <div>{project.survivalRate}% trees survived</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center">
          <span>Number of trees:</span>
          <button onClick={() => setTreeCount(Math.max(1, treeCount - 1))}>-</button>
          <span className="mx-2">{treeCount}</span>
          <button onClick={() => setTreeCount(treeCount + 1)}>+</button>
        </div>
        
        <input
          type="text"
          placeholder="Name your Tree"
          className="w-full border p-2 mt-2"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
        />
        
        <select className="w-full border p-2 mt-2" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
          <option>Birthday</option>
          <option>Anniversary</option>
          <option>Memorial</option>
        </select>
        
        <textarea
          maxLength={200}
          placeholder="Story behind tree"
          className="w-full border p-2 mt-2"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        
        <input
          type="date"
          className="w-full border p-2 mt-2"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4 mt-4">
        <button onClick={handleAddToCart} className="bg-green-500 text-white p-2 rounded">Add to Cart</button>
        <button onClick={handleAdoptNow} className="bg-blue-500 text-white p-2 rounded">Adopt Now</button>
      </div>
    </div>
  );
};

export default PlantAdoption;