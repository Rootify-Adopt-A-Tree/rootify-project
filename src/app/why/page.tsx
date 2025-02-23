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
  const images1 = [
    '/images/why/20.png', '/images/why/21.png', '/images/why/22.png'
  ]; // Updated image paths
  const images2 = [
    '/images/why/30.png', '/images/why/31.png', '/images/why/32.png'
  ]; // Updated image paths

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16 md:pt-20"></div>
      
      {/* About Us Section */}
      <section id="about" className="p-8 text-center">
        <h2 className="text-green-600 text-2xl font-bold">WHY ADOPT/ RAISE TREES</h2>
        <p className="mt-4 max-w-3xl mx-auto text-justify">
        Deforestation and pollution have reached alarming levels, posing a severe threat to the environment and biodiversity. According to the World Bank, the planet has lost 1.3 million square kilometers of forest since 1990, equivalent to the size of South Africa. The Amazon rainforest, often called the "lungs of the Earth," is being destroyed at an unprecedented rate, with over 10,000 square kilometers lost in 2023 alone. This rapid deforestation not only contributes to climate change but also leads to habitat loss for 80% of terrestrial species, pushing many toward extinction. Urbanization and industrial waste are also causing severe soil and water pollution, making natural ecosystems less capable of sustaining life. With an estimated 15 billion trees cut down every year, reforestation and conservation efforts have never been more critical.
        </p>
      </section>
      
      {/* Image Grid */}
        <div className="grid grid-cols-3 gap-8 p-8">
        {images1.map((image1, index) => (
            <div 
            key={index} 
            className="bg-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center transform transition duration-300 hover:scale-105"
            >
            <Image 
                src={image1} 
                alt={`Image ${index + 1}`} 
                width={200}  
                height={200} 
                // className="rounded-full object-cover mb-4" 
            />
            </div>
        ))}
        </div>

        <section id="about" className="p-8 text-center">
        <p className="mt-4 max-w-3xl mx-auto text-justify">
        Afforestation is a crucial step toward reversing environmental degradation caused by deforestation and urbanization. By planting trees in barren or degraded lands, we can restore lost green cover and enhance biodiversity. Trees play a vital role in preventing soil erosion, maintaining groundwater levels, and improving air quality by absorbing pollutants. They also contribute to climate regulation by acting as carbon sinks, reducing the impact of greenhouse gases. Additionally, afforestation helps in combating desertification and increasing rainfall by influencing local weather patterns. It supports sustainable agriculture by improving soil fertility and reducing temperature extremes. Investing in afforestation today ensures a healthier and more balanced ecosystem for future generations.
        </p>
      </section>
      
      {/* Image Grid */}
        <div className="grid grid-cols-3 gap-8 p-8">
        {images2.map((image2, index) => (
            <div 
            key={index} 
            className="bg-gray-100 rounded-2xl shadow-md p-6 flex flex-col items-center transform transition duration-300 hover:scale-105"
            >
            <Image 
                src={image2} 
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