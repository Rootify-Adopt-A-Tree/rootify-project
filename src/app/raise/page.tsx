"use client"; 

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // ✅ Import required modules
import "swiper/css"; // ✅ Import base Swiper styles
import "swiper/css/pagination"; // ✅ Pagination styles
import "swiper/css/navigation"; // ✅ Navigation styles
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";

const projectData = [
  { id: 1, name: "Mission Taljai", location: "Pune, Maharashtra", image: "/images/taljai.jpg" },
  { id: 2, name: "Mission Pune", location: "Pune, Maharashtra", image: "/images/mission-pune.jpg" },
  { id: 3, name: "Mission Bharat", location: "Surat, Gujarat", image: "/images/mission-bharat.jpg" },
];

export default function PlantAdoption() {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-16 md:pt-20"></div>

      {/* 🌱 Carousel Section */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }} // ✅ Added Pagination
          navigation={true} // ✅ Added Navigation
          modules={[Autoplay, Pagination, Navigation]} // ✅ Include all necessary modules
          className="w-full h-full"
        >
          {["Children", "Earth", "Father", "Mother"].map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image src={`/images/car/${img}.png`} layout="fill" objectFit="cover" alt={`Slide ${index + 1}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* 🌱 Plant Adoption Section */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Raise plants with...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projectData.map((project) => (
            <div key={project.id} className="bg-green-100 p-4 rounded-lg shadow-md text-center">
              <div className="relative w-full h-40 bg-gray-300 rounded-md overflow-hidden">
                <Image src={project.image} layout="fill" objectFit="cover" alt={project.name} />
              </div>
              <h3 className="text-lg font-semibold mt-3">{project.name}</h3>
              <p className="text-gray-700">{project.location}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}