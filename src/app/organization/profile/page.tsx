"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const Home = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");

  // Function to handle event submission
  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting event:", { name, location, time, date, hours });

    try {
      const docRef = await addDoc(collection(db, "events"), {
        name,
        location,
        time,
        date,
        hours,
      });
      console.log("Event added successfully with ID:", docRef.id);
      alert("Event added successfully!");

      // Reset form fields
      setName("");
      setLocation("");
      setTime("");
      setDate("");
      setHours("");
    } catch (error) {
      console.error("Firestore error:", error);
      alert("Failed to add event. Check console for errors.");
    }
  };

  return (
    <div className="bg-gray-100">
      
      <Navbar />
      <div className='pt-16 md:pt-20'></div>

      {/* Statistics Section */}
      <section className="flex justify-center gap-8 bg-white py-6">
        {[
          "5,125 trees planted",
          "452 volunteers joined",
          "1,324 acres covered",
          "95% survived",
          "216 different species",
        ].map((stat, index) => (
          <div key={index} className="text-center flex items-center justify-center gap-2px">
            <Image
              src={`/images/treelogo.png`}
              width={40}
              height={40}
              alt={stat}
            />
            <p className="text-lg font-bold text-green-800">
              {stat.split(" ")[0]}
            </p>
            <p className="text-gray-600 text-sm">
              {stat.split(" ").slice(1).join(" ")}
            </p>
          </div>
        ))}
      </section>

      {/* Event Creation Form */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Create Event
        </h2>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleEventSubmit}>
            <input
              type="text"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Hours of Volunteering"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Create Event
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;