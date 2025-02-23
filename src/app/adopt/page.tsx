// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';  // Correct import for Next.js 13+
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import { db } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import Link from 'next/link';
// import Image from 'next/image';

// interface Mission {
//   id: string;
//   aim: string;
//   contact: string;
//   darpanId: string;
//   email: string;
//   location: string;
//   ngoName: string;
//   password: string;
//   price: string;
//   projectName: string;
//   state: string;
//   image?: string;
// }

// interface Tree {
//   name: string;
//   price: string;
//   sci_name: string;
//   details: string;
//   n_des: string;
//   imageUrl: string;
// }

// // Mapping of zodiac signs to their corresponding trees
// const zodiacTreeMapping = {
//   'Aries': 'Neem',
//   'Taurus': 'Apple',
//   'Gemini': 'Papaya',
//   'Cancer': 'Jasmine',
//   'Leo': 'Sunflower',
//   'Virgo': 'Chamomile',
//   'Libra': 'Almond',
//   'Scorpio': 'Cactus',
//   'Sagittarius': 'Lemon',
//   'Capricorn': 'Cedar',
//   'Aquarius': 'Ashoka',
//   'Pisces': 'Peepal'
// } as const;

// const allZodiacSigns = Object.keys(zodiacTreeMapping);

// export default function AdoptPage() {
//   const router = useRouter();
//   const [isZodiacExpanded, setIsZodiacExpanded] = React.useState(false);
//   const [missions, setMissions] = useState<Mission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [trees, setTrees] = useState<Tree[]>([]);

//   useEffect(() => {
//     const fetchMissions = async () => {
//       try {
//         console.log("Fetching missions...");
//         const missionsCollection = collection(db, "projects");
//         const querySnapshot = await getDocs(missionsCollection);
        
//         if (querySnapshot.empty) {
//           console.log("No missions found");
//           setError("No missions available");
//           return;
//         }

//         const missionData: Mission[] = querySnapshot.docs.map((doc) => {
//           const data = doc.data();
//           console.log("Mission data:", data);  // This will help us see what fields we're getting
//           return {
//             id: doc.id,
//             aim: data.aim || "",
//             contact: data.contact || "",
//             darpanId: data.darpanId || "",
//             email: data.email || "",
//             location: data.location || "",
//             ngoName: data.ngoName || "",
//             password: data.password || "",
//             price: data.price || "",
//             projectName: data.projectName || "",
//             state: data.state || "",
//             image: data.image || null,
//           } as Mission;
//         });

//         console.log("Fetched missions:", missionData);
//         setMissions(missionData);
//       } catch (error) {
//         console.error("Error fetching missions:", error);
//         setError("Failed to load missions");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMissions();
//   }, []);

//   useEffect(() => {
//     const fetchTrees = async () => {
//       try {
//         const treesRef = collection(db, "trees");
//         const snapshot = await getDocs(treesRef);
//         const treesData = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         })) as Tree[];
//         setTrees(treesData);
//       } catch (error) {
//         console.error("Error fetching trees:", error);
//         setError("Failed to load trees");
//       }
//     };

//     fetchTrees();
//   }, []);

//   const handleZodiacClick = (zodiac: string) => {
//     const tree = zodiacTreeMapping[zodiac as keyof typeof zodiacTreeMapping];
//     // Convert tree name to URL-friendly slug
//     const slug = tree.toLowerCase().replace(/\s+/g, '-');
//     router.push(`/adopt/zodiac/${slug}`);
//   };

//   if (error) {
//     return (
//       <main className="min-h-screen bg-white">
//         <Header />
//         <div className='pt-16 md:pt-20'></div>
//         <div className="container mx-auto px-4 pt-20 pb-8">
//           <div className="text-center text-red-600">{error}</div>
//         </div>
//         <Footer />
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-white">
//       <Header />
      
//       <div className="container mx-auto px-4 pt-20 pb-8">
//         {/* Mission-based Adoption */}
//         <section className="mb-12">
//           <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt with...</h2>
//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800 mx-auto"></div>
//               <p className="mt-2">Loading missions...</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {missions.map((mission) => (
//                 <button
//                   key={mission.id}
//                   className="bg-green-50 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 w-full"
//                   onClick={() => router.push(`/adopt/mission/${mission.projectName.toLowerCase().replace(/\s+/g, '-')}`)}
//                 >
//                   <div className="aspect-square bg-gray-600 rounded-lg mb-3">
//                     <img 
//                       src={mission.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNNtYDIdmvtpKrNnW0CcmzGXMdPxFgFuxisA&s"} 
//                       alt={mission.projectName}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </div>
//                   <p className="text-green-800 font-medium">{mission.projectName}</p>
//                   <p className="text-sm text-gray-600">{mission.ngoName}</p>
//                   <p className="text-sm text-gray-600">{mission.location}, {mission.state}</p>
//                   <p className="text-sm font-medium text-green-700 mt-2">₹{mission.price}</p>
//                 </button>
//               ))}
//             </div>
//           )}
//           <div className="text-center mt-4">
//             <button className="text-gray-500">▼</button>
//           </div>
//         </section>

//         {/* Modified Seasonal Trees section */}
//         <section className="mb-12 relative">
//           <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt these Seasonal ones...</h2>
//           <div className="relative">
//             {/* Left scroll button */}
//             <button 
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800"
//               onClick={() => {
//                 const container = document.getElementById('seasonal-scroll');
//                 if (container) container.scrollLeft -= 300;
//               }}
//             >
//               ◄
//             </button>

//             {/* Scrollable container */}
//             <div 
//               id="seasonal-scroll"
//               className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//               {loading ? (
//                 <div className="flex-1 text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800 mx-auto"></div>
//                   <p className="mt-2">Loading trees...</p>
//                 </div>
//               ) : (
//                 trees.map((tree) => (
//                   <div 
//                     key={tree.name}
//                     className="flex-none w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                   >
//                     <Link href={`/adopt/${tree.name.toLowerCase().replace(/\s+/g, '-')}`}>
//                       <div className="h-48">
//                         <img
//                           src={tree.imageUrl}
//                           alt={tree.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="p-4">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h3 className="font-semibold text-lg">{tree.name}</h3>
//                             <p className="text-sm text-gray-600 italic">{tree.sci_name}</p>
//                           </div>
//                           <span className="text-green-600 font-semibold">₹{tree.price}</span>
//                         </div>
//                         <p className="text-sm text-gray-600 mt-2 line-clamp-2">{tree.details}</p>
//                       </div>
//                     </Link>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Right scroll button */}
//             <button 
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800"
//               onClick={() => {
//                 const container = document.getElementById('seasonal-scroll');
//                 if (container) container.scrollLeft += 300;
//               }}
//             >
//               ►
//             </button>
//           </div>
//         </section>

//         {/* Zodiac-based Adoption */}
//         <section>
//           <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt according to your Zodiac...</h2>
//           <div className="grid grid-cols-4 gap-6">
//             {(isZodiacExpanded ? allZodiacSigns : allZodiacSigns.slice(0, 4)).map((zodiac) => (
//               <div 
//                 key={zodiac} 
//                 className="text-center cursor-pointer transform transition-transform hover:scale-105"
//                 onClick={() => handleZodiacClick(zodiac)}
//               >
//                 <div className="w-24 h-24 mx-auto">
//                   <Image
//                     src={`/images/zodiac/${zodiac}.jpeg`}
//                     width={96} 
//                     height={96} 
//                     alt={zodiac} 
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//                 <p className="text-green-800 font-medium mt-2">{zodiac}</p>
//                 <p className="text-sm text-gray-600">{zodiacTreeMapping[zodiac as keyof typeof zodiacTreeMapping]}</p>
//               </div>
//             ))}
//           </div>
//           <div className="text-center mt-4">
//             <button 
//               className="text-gray-500 hover:text-gray-700 transition-colors duration-200" 
//               onClick={() => setIsZodiacExpanded(!isZodiacExpanded)}
//             >
//               {isZodiacExpanded ? '▲ Show Less' : '▼ Show More'}
//             </button>
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }











"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Correct import for Next.js 13+
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from 'next/link';
import Image from 'next/image';

interface Mission {
  id: string;
  aim: string;
  contact: string;
  darpanId: string;
  email: string;
  location: string;
  ngoName: string;
  password: string;
  price: string;
  projectName: string;
  state: string;
  image?: string;
  img_url?: string;
}

interface Tree {
  name: string;
  price: string;
  sci_name: string;
  details: string;
  n_des: string;
  imageUrl: string;
}

// Mapping of zodiac signs to their corresponding trees
const zodiacTreeMapping = {
  'Aries': 'Neem',
  'Taurus': 'Apple',
  'Gemini': 'Papaya',
  'Cancer': 'Jasmine',
  'Leo': 'Sunflower',
  'Virgo': 'Chamomile',
  'Libra': 'Almond',
  'Scorpio': 'Cactus',
  'Sagittarius': 'Lemon',
  'Capricorn': 'Cedar',
  'Aquarius': 'Ashoka',
  'Pisces': 'Peepal'
} as const;

const allZodiacSigns = Object.keys(zodiacTreeMapping);

export default function AdoptPage() {
  const router = useRouter();
  const [isZodiacExpanded, setIsZodiacExpanded] = React.useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);


  useEffect(() => {
    const fetchMissions = async () => {
      try {
        console.log("Fetching missions...");
        const missionsCollection = collection(db, "projects");
        const querySnapshot = await getDocs(missionsCollection);
        
        if (querySnapshot.empty) {
          console.log("No missions found");
          setError("No missions available");
          return;
        }

        const missionData: Mission[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Mission data:", data);  // This will help us see what fields we're getting
          return {
            id: doc.id,
            aim: data.aim || "",
            contact: data.contact || "",
            darpanId: data.darpanId || "",
            email: data.email || "",
            location: data.location || "",
            ngoName: data.ngoName || "",
            password: data.password || "",
            price: data.price || "",
            projectName: data.projectName || "",
            state: data.state || "",
            image: data.image || null,
            img_url: data.img_url || "",
          } as Mission;
        });

        console.log("Fetched missions:", missionData);
        setMissions(missionData);
      } catch (error) {
        console.error("Error fetching missions:", error);
        setError("Failed to load missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const treesRef = collection(db, "trees");
        const snapshot = await getDocs(treesRef);
        const treesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tree[];
        setTrees(treesData);
      } catch (error) {
        console.error("Error fetching trees:", error);
        setError("Failed to load trees");
      }
    };

    fetchTrees();
  }, []);

  const handleZodiacClick = (zodiac: string) => {
    const tree = zodiacTreeMapping[zodiac as keyof typeof zodiacTreeMapping];
    // Convert tree name to URL-friendly slug
    const slug = tree.toLowerCase().replace(/\s+/g, '-');
    router.push(`/adopt/zodiac/${slug}`);
  };

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className='pt-16 md:pt-20'></div>
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

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
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Mission-based Adoption */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-3">Adopt with...</h2>
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-800 mx-auto"></div>
              <p className="mt-2 text-sm">Loading missions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {missions.map((mission) => (
              <button
                  key={mission.id}
                  className="bg-green-50 rounded-md p-3 text-center cursor-pointer hover:shadow-md transition-shadow duration-300 w-full"
                  onClick={() => router.push(`/adopt/mission/${mission.projectName.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="h-60 bg-gray-600 rounded-md mb-2 transform transition duration-300 hover:scale-105">
                    <img
                      src={mission.img_url}
                      alt={mission.projectName}
                      className="w-full h-full object-cover rounded-md "
                    />
                </div>
                  <p className="text-green-800 font-medium text-sm">{mission.projectName}</p>
                  <p className="text-xs text-gray-600">{mission.ngoName}</p>
                  <p className="text-xs text-gray-600">{mission.location}, {mission.state}</p>
                  <p className="text-sm font-medium text-green-700 mt-1">₹{mission.price}</p>
              </button>
            ))}
          </div>
          )}
          <div className="text-center mt-3">
            <button className="text-gray-500 text-sm">▼</button>
          </div>
        </section>


        {/* Modified Seasonal Trees section */}
        <section className="mb-12 relative">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt these Seasonal ones...</h2>
          <div className="relative ">
            {/* Left scroll button */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800 "
              onClick={() => {
                const container = document.getElementById('seasonal-scroll');
                if (container) container.scrollLeft -= 300;
              }}
            >
              ◄
            </button>

            {/* Scrollable container */}
            <div 
              id="seasonal-scroll"
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {loading ? (
                <div className="flex-1 text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800 mx-auto"></div>
                  <p className="mt-2">Loading trees...</p>
                </div>
              ) : (
                trees.map((tree) => (
                <div 
                  key={tree.name} 
                    className="flex-none w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/adopt/${tree.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="h-48">
                        <img
                          src={tree.imageUrl}
                          alt={tree.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{tree.name}</h3>
                            <p className="text-sm text-gray-600 italic">{tree.sci_name}</p>
                          </div>
                          <span className="text-green-600 font-semibold">₹{tree.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{tree.details}</p>
                      </div>
                    </Link>
                </div>
                ))
              )}
            </div>

            {/* Right scroll button */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800"
              onClick={() => {
                const container = document.getElementById('seasonal-scroll');
                if (container) container.scrollLeft += 300;
              }}
            >
              ►
            </button>
          </div>
        </section>

        {/* Zodiac-based Adoption */}
        <section>
          <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt according to your Zodiac...</h2>
          <div className="grid grid-cols-4 gap-6">
            {(isZodiacExpanded ? allZodiacSigns : allZodiacSigns.slice(0, 4)).map((zodiac) => (
              <div 
                key={zodiac} 
                className="text-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleZodiacClick(zodiac)}
              >
                <div className="w-24 h-24 mx-auto">
                  <Image
                    src={`/images/zodiac/${zodiac}.jpeg`}
                    width={96} 
                    height={96} 
                    alt={zodiac} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-green-800 font-medium mt-2">{zodiac}</p>
                <p className="text-sm text-gray-600">{zodiacTreeMapping[zodiac as keyof typeof zodiacTreeMapping]}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200" 
              onClick={() => setIsZodiacExpanded(!isZodiacExpanded)}
            >
              {isZodiacExpanded ? '▲ Show Less' : '▼ Show More'}
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
