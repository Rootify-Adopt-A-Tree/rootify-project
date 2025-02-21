"use client";

import { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Adjust the path as needed
import { collection, getDocs } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AdoptPage = () => {
  const [tree, setTree] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [treeName, setTreeName] = useState("");
  const [story, setStory] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const fetchTreeData = async () => {
      const querySnapshot = await getDocs(collection(db, "trees"));
      if (!querySnapshot.empty) {
        setTree(querySnapshot.docs[0].data()); // Assume fetching the first tree
      }
    };
    fetchTreeData();
  }, []);

  const addToCart = () => {
    console.log("Added to cart", { tree, quantity, treeName, story, occasion, selectedDate });
  };

  const adoptNow = () => {
    console.log("Proceed to payment", { tree, quantity, treeName, story, occasion, selectedDate });
  };

  if (!tree) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">{/* Include Navbar Component */}</nav>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={tree.imageUrl} alt={tree.name} className="w-full h-64 object-cover rounded-lg" />
          <h2 className="text-xl font-semibold mt-2">{tree.zodiac}</h2>
          <p className="mt-2">{tree.description}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h1 className="text-2xl font-bold">{tree.name} - ${tree.price}</h1>
          <p className="text-gray-600">{tree.projectDescription}</p>
          <div className="flex items-center mt-4">
            <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
            <span className="mx-2">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <input type="text" placeholder="Name your Tree" value={treeName} onChange={(e) => setTreeName(e.target.value)} className="w-full p-2 border rounded mt-4" />
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full p-2 border rounded mt-2">
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Memory</option>
          </select>
          <textarea maxLength={200} placeholder="Story behind tree" value={story} onChange={(e) => setStory(e.target.value)} className="w-full p-2 border rounded mt-2" />
          <Calendar onChange={setSelectedDate} value={selectedDate} className="mt-2" />
          <div className="flex gap-4 mt-4">
            <button onClick={addToCart} className="bg-gray-600 text-white p-2 rounded">Add to cart</button>
            <button onClick={adoptNow} className="bg-green-600 text-white p-2 rounded">Adopt Now</button>
          </div>
        </div>
      </div>
      <footer className="mt-8">{/* Include Footer Component */}</footer>
    </div>
  );
};

export default AdoptPage;