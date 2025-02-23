"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Project {
  id: string;
  projectName: string;
  location: string;
  state: string;
  img_url: string;
  ngoName: string;
  aim: string;
}

export default function RaisePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectsRef = collection(db, "projects");
        const snapshot = await getDocs(projectsRef);
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleProjectClick = (ngoName: string) => {
    // Convert project name to URL-friendly slug
    const slug = ngoName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/raise/missions/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

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
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="w-full h-full"
                  >
                    {["Children", "Earth", "Father", "Mother"].map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                          <Image src={`/images/car/${img}.png`} layout="fill" objectFit="contain" alt={`Slide ${index + 1}`} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
      
      {/* 🌱 Plant Adoption Section */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Raise plants with...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-green-100 p-4 rounded-lg shadow-md text-center cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleProjectClick(project.ngoName)}
            >
              <div className="relative w-full h-40 bg-gray-300 rounded-md overflow-hidden">
                <Image 
                  src={project.img_url || '/images/default-project.jpg'} 
                  layout="fill" 
                  objectFit="cover" 
                  alt={project.projectName}
                  onError={(e) => {
                    // Fallback to default image if the main image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-project.jpg';
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mt-3">{project.ngoName}</h3>
              <p className="text-gray-700">{project.location}, {project.state}</p>
              {/* <p className="text-sm text-gray-600 mt-2">{project.ngoName}</p> */}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}