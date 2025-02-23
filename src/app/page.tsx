'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Header';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  const events = [
    { name: 'Samiksha (Pune)', description: 'I planted my tree when my son was born. Watching them grow together makes me feel like I have two children, whom I will cherish forever...', image: '/images/landing/14.png' },
    { name: 'Purvi (Jodhpur)', description: 'Planting a tree togther with my husband on our 25th Anniversary was very special to us. Planting a cherry blossom tree symbolizes the eternal love between us... ', image: '/images/landing/15.png' },
    { name: 'Ayush (Mumbai)', description: 'I planted a neem tree in the memory of my cute little dog Chiku. I had a neem tree in my backyard where my dog used to play around and it will always remind me of him...', image: '/images/landing/13.png' }
  ];

  const handleAdoptClick = () => {
    router.push('/adopt');
  };

  const handleRaiseClick = () => {
    router.push('/raise');
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      {/* <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button className="text-xl">☰</button>
          <button className="text-xl">🛒</button>
        </div>
        <nav className="flex-grow text-center font-bold text-lg">
          <ul className="flex justify-center space-x-8">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/ngos">NGOs</Link></li>
            <li><Link href="/soultree">SoulTree</Link></li>
          </ul>
        </nav>
      </header> */}
      <Navbar />
      <div className='pt-16 md:pt-20'></div>

      {/* Hero Section */}
      <div className="bg-gray-200 h-92 mt-4">
        <img src="/images/tree.png" alt="banner" 
          width={1500} 
          height={100} 
          className=" "
 />
      </div>

      {/* Registration Options Section */}
      <section className="max-w-4xl mx-auto my-12 px-4">
        {/* <h2 className="text-2xl font-bold text-center text-green-700 mb-8">Join Our Community</h2> */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Farmer Registration Card */}
          {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <Image
                src="/images/farmer.png"
                alt="Farmer"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Register as Farmer</h3>
              <p className="text-gray-600 mb-4">
                Join our network of farmers and help grow a greener future. Plant trees and earn rewards.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Accept tree planting requests
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Earn from each tree planted
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Get support and resources
                </li>
              </ul>
              <Link
                href="/farmer/register"
                className="block w-full bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Register as Farmer
              </Link>
            </div>
          </div> */}

          {/* NGO Registration Card */}
          {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Image
                src="/images/ngo.png"
                alt="NGO"
                width={120}
                height={120}
                className="rounded-full border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Register as NGO</h3>
              <p className="text-gray-600 mb-4">
                Partner with us to amplify your environmental impact. Connect with donors and volunteers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">✓</span>
                  Receive donations and support
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">✓</span>
                  Organize planting events
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">✓</span>
                  Access our volunteer network
                </li>
              </ul>
              <Link
                href="/ngo/register"
                className="block w-full bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Register as NGO
              </Link>
            </div>
          </div> */}
        </div>
      </section>

      {/* Adopt a Tree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6">ADOPT A TREE</h2>
          <Image 
            src="/images/adopt_a_tree.jpg" 
            alt="Adopt a Tree Process" 
            width={600} 
            height={200} 
            className="mx-auto"
          />
          <button 
            onClick={handleAdoptClick}
            className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
          >
            Adopt Now
          </button>
        </div>
      </section>

      {/* Raise a Tree Section */}
      <section className="max-w-4xl mx-auto mb-12 px-4">
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6">RAISE A TREE</h2>
          <Image 
            src="/images/volunteer.jpg" 
            alt="Raise a Tree Process" 
            width={600} 
            height={200} 
            className="mx-auto"
          />
          <button 
            onClick={handleRaiseClick}
            className="mt-6 w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
          >
            Raise Now
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}

      <section className="max-w-4xl mx-auto mb-12 px-4">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">A Tree for Every Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg text-center">
              {/* Event Image */}
              <Image 
                src={event.image} 
                alt={event.name} 
                width={200} 
                height={50} 
                className="mx-auto rounded-lg"
              />
              {/* Event Name & Date */}
              <h3 className="font-bold mt-4">{event.name}</h3>
              <p className="text-sm text-gray-600"> {event.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}


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
//   img_url?: string;
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
//             img_url: data.img_url || "",
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
//         <section className="mb-6">
//           <h2 className="text-lg font-semibold text-green-800 mb-3">Adopt with...</h2>
//           {loading ? (
//             <div className="text-center py-6">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-800 mx-auto"></div>
//               <p className="mt-2 text-sm">Loading missions...</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               {missions.map((mission) => (
//                 <button
//                   key={mission.id}
//                   className="bg-green-50 rounded-md p-3 text-center cursor-pointer hover:shadow-md transition-shadow duration-300 w-full"
//                   onClick={() => router.push(`/adopt/mission/${mission.projectName.toLowerCase().replace(/\s+/g, '-')}`)}
//                 >
//                   <div className="h-60 bg-gray-600 rounded-md mb-2 transform transition duration-300 hover:scale-105">
//                     <img
//                       src={mission.img_url}
//                       alt={mission.projectName}
//                       className="w-full h-full object-cover rounded-md "
//                     />
//                   </div>
//                   <p className="text-green-800 font-medium text-sm">{mission.projectName}</p>
//                   <p className="text-xs text-gray-600">{mission.ngoName}</p>
//                   <p className="text-xs text-gray-600">{mission.location}, {mission.state}</p>
//                   <p className="text-sm font-medium text-green-700 mt-1">₹{mission.price}</p>
//                 </button>
//               ))}
//             </div>
//           )}
//           <div className="text-center mt-3">
//             <button className="text-gray-500 text-sm">▼</button>
//           </div>
//         </section>


//         {/* Modified Seasonal Trees section */}
//         <section className="mb-12 relative">
//           <h2 className="text-xl font-semibold text-green-800 mb-4">Adopt these Seasonal ones...</h2>
//           <div className="relative ">
//             {/* Left scroll button */}
//             <button 
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-green-800 "
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