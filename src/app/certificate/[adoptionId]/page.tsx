"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { IoMdRibbon } from "react-icons/io";
import { GiOakLeaf } from "react-icons/gi";

interface AdoptionDetails {
  id: string;
  userName: string;
  treeName: string;
  location: string;
  timestamp: Date;
  certificateId: string;
}

export default function Certificate() {
  const params = useParams();
  const adoptionId = params.adoptionId as string;
  const [adoptionDetails, setAdoptionDetails] = useState<AdoptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!adoptionId) return;

      try {
        const adoptionDoc = await getDoc(doc(db, "adoptions", adoptionId));
        
        if (!adoptionDoc.exists()) {
          throw new Error("Certificate not found");
        }

        const data = adoptionDoc.data();
        setAdoptionDetails({
          id: adoptionId,
          ...data,
          certificateId: data.certificateId || `ROOTIFY-${adoptionId.slice(0, 8).toUpperCase()}`,
          timestamp: data.timestamp.toDate(),
        } as AdoptionDetails);
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [adoptionId]);

  const handleDownload = () => {
    window.print();
  };

  const generateCertificateImage = async () => {
    if (!certificateRef.current) return null;
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating certificate image:', error);
      return null;
    }
  };

  const handleShareToLinkedIn = async () => {
    if (!adoptionDetails) return;

    const certificateImage = await generateCertificateImage();
    
    const postContent = {
      title: "I've Adopted a Tree with Rootify! 🌳",
      text: `I'm excited to share that I've taken a step towards a greener future by adopting a ${adoptionDetails.treeName} through Rootify! 🌱

This beautiful tree, located in ${adoptionDetails.location}, is now part of our collective effort to combat climate change and create a more sustainable world.

Key Impact Metrics:
• 1 Tree = Absorbs ~22kg of CO2 annually
• Provides habitat for wildlife
• Helps prevent soil erosion
• Improves air quality

Join me in making a difference! Visit Rootify to adopt your own tree and be part of the change.

Certificate ID: ${adoptionDetails.certificateId}
Date of Adoption: ${adoptionDetails.timestamp.toLocaleDateString()}

#Rootify #Sustainability #ClimateAction #TreePlanting #Environment #GreenFuture #ClimateChange #Reforestation`,
      url: window.location.href
    };

    // LinkedIn sharing URL with formatted content
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?` + 
      `url=${encodeURIComponent(postContent.url)}` +
      `&title=${encodeURIComponent(postContent.title)}` +
      `&summary=${encodeURIComponent(postContent.text)}`;

    // Open LinkedIn sharing dialog
    window.open(shareUrl, '_blank', 'width=600,height=600');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!adoptionDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Certificate Not Found</h1>
          <p className="mt-4 text-gray-600">This certificate does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Certificate Container */}
        <div 
          ref={certificateRef}
          className="aspect-[1.414/1] bg-[#f9f7e8] rounded-lg shadow-lg p-12 print:shadow-none relative overflow-hidden"
          style={{
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23238635' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
            `
          }}
        >
          {/* Ornamental Border */}
          <div className="absolute inset-0 border-[32px] border-double rounded-lg pointer-events-none"
            style={{
              borderImage: 'url("/images/certificate-border.png") 32 round'
            }}
          />

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
            <GiOakLeaf className="w-full h-full text-green-800 transform -rotate-45" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <GiOakLeaf className="w-full h-full text-green-800 transform rotate-45" />
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20">
            <GiOakLeaf className="w-full h-full text-green-800 transform -rotate-135" />
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
            <GiOakLeaf className="w-full h-full text-green-800 transform rotate-135" />
          </div>

          {/* Certificate Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Image 
                  src="/images/logo.png" 
                  alt="Rootify Logo" 
                  width={100} 
                  height={100}
                  className="rounded-full"
                />
              </div>
              <h1 className="font-serif text-6xl text-green-900 mb-2 font-bold" 
                style={{ fontFamily: 'Pinyon Script, cursive' }}>
                Certificate of Tree Adoption
              </h1>
              <div className="flex items-center justify-center gap-4 my-6">
                <div className="h-px w-32 bg-green-900/20" />
                <IoMdRibbon className="text-4xl text-green-800" />
                <div className="h-px w-32 bg-green-900/20" />
              </div>
            </div>

            {/* Main Text */}
            <div className="text-center my-12">
              <p className="text-xl text-gray-700 mb-6">This is to certify that <b>Ayush Srivastava</b></p>
              <p className="text-4xl font-bold text-green-900 mb-8 font-serif">
                {adoptionDetails.userName}
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                has made a commitment to environmental sustainability by adopting
              </p>
              <p className="text-3xl font-bold text-green-900 my-4 font-serif">
                {adoptionDetails.treeName}
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                located in
              </p>
              <p className="text-2xl font-semibold text-green-900 mt-4 font-serif">
                {adoptionDetails.location}
              </p>
            </div>

            {/* Footer Details */}
            <div className="mt-16">
              <div className="flex justify-between items-end px-12">
                <div className="text-center">
                  <div className="mb-2">
                    <Image 
                      src="/images/signature.png" 
                      alt="Authority Signature" 
                      width={150} 
                      height={60}
                      className="mx-auto"
                    />
                  </div>
                  <div className="w-48 border-t border-gray-400" />
                  <p className="mt-2 text-gray-600">Authorized Signature</p>
                </div>

                <div className="text-center flex flex-col items-center">
                  <div className="w-32 h-32 relative mb-2">
                    <Image 
                      src="/images/seal.png" 
                      alt="Official Seal" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-600">Official Seal</p>
                </div>

                <div className="text-center">
                  <p className="text-lg font-serif mb-2">
                    {adoptionDetails.timestamp.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="w-48 border-t border-gray-400" />
                  <p className="mt-2 text-gray-600">Date</p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="absolute bottom-0 left-0 right-0 text-center -mb-6">
              <p className="text-sm text-gray-500">Certificate ID: {adoptionDetails.certificateId}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center print:hidden flex justify-center gap-4">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold shadow-lg"
          >
            Download Certificate
          </button>
          <button
            onClick={handleShareToLinkedIn}
            className="bg-[#0077b5] text-white px-8 py-3 rounded-full hover:bg-[#006396] transition-colors font-semibold shadow-lg flex items-center gap-2"
          >
            <FaLinkedin className="text-xl" />
            Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
} 