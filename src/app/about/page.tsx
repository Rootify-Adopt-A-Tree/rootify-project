"use client"; 

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; //  Import required modules
import "swiper/css"; //  Import base Swiper styles
import "swiper/css/pagination"; //  Pagination styles
import "swiper/css/navigation"; //  Navigation styles
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    '/images/aboutim/1.png', '/images/aboutim/2.png', '/images/aboutim/3.png', 
    '/images/aboutim/4.png', '/images/aboutim/5.png', '/images/aboutim/6.png', 
    '/images/aboutim/7.png', '/images/aboutim/8.png', '/images/aboutim/9.png'
  ]; // Updated image paths

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16 md:pt-20"></div>
      
      {/* Carousel Section */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }} //  Added Pagination
          navigation={true} //  Added Navigation
          modules={[Autoplay, Pagination, Navigation]} //  Include all necessary modules
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
      
      {/* About Us Section */}
      <section id="about" className="p-8 text-center">
        <h2 className="text-green-600 text-2xl font-bold">ABOUT US</h2>
        <p className="mt-4 max-w-3xl mx-auto">
          Rootify is a platform dedicated to making the world greener, one tree at a time. Our mission is to connect people with nature by allowing them to raise or adopt trees and become part of a sustainable future. Whether you plant a tree to celebrate a special occasion or adopt one to support reforestation, each tree tells a unique story that lasts for generations. We collaborate with trusted NGOs and environmental organizations to ensure every tree planted thrives in its ecosystem. By joining Rootify, you contribute to a healthier planet, cleaner air, and a legacy of greenery for future generations. Together, we can nurture nature and make every tree count!
        </p>
      </section>
      
      {/* Image Grid */}
        <div className="grid grid-cols-3 gap-8 p-8">
        {images.map((image, index) => (
            <div 
            key={index} 
            className="bg-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center transform transition duration-300 hover:scale-105"
            >
            <Image 
                src={image} 
                alt={`Image ${index + 1}`} 
                width={200}  
                height={200} 
                // className="rounded-full object-cover mb-4" 
            />
            </div>
        ))}
        </div>


      
      {/* Contact Us Section */}
      <Footer />
    </div>
  );
}