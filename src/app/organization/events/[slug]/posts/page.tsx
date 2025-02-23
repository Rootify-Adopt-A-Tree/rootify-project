"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from "@/components/Header";
import OrganizationLogin from '@/components/OrganizationLogin';

interface EventDetails {
  id: string;
  name: string;
  ngo: string;
}

export default function EventPostsPage() {
  const params = useParams();
  const [user, authLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) return;
      
      try {
        // Check if user is an NGO
        const usersRef = collection(db, "users");
        const q = query(usersRef, 
          where("uid", "==", user.uid),
          where("role", "==", "ngo")
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const ngoDoc = await getDoc(doc(db, "ngos", userData.ngoId));
          
          if (ngoDoc.exists()) {
            setIsAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();
  }, [user]);

  useEffect(() => {
    fetchEventDetails();
  }, [params.slug]);

  const fetchEventDetails = async () => {
    if (!params.slug) return;

    try {
      const eventsRef = collection(db, "events");
      const eventName = params.slug.toString().split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      const eventQuery = query(eventsRef, where("name", "==", eventName));
      const eventSnapshot = await getDocs(eventQuery);
      
      if (!eventSnapshot.empty) {
        const eventDoc = eventSnapshot.docs[0];
        const eventData = eventDoc.data();
        setEventDetails({ 
          id: eventDoc.id,
          name: eventData.name, 
          ngo: eventData.ngo 
        });
      } else {
        setPostError("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setPostError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !eventDetails || !user) return;

    setUploadingPost(true);
    setPostError(null);

    try {
      // 1. Create a unique file name
      const fileExtension = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      
      // 2. Create storage reference
      const storageRef = ref(storage, `event-posts/${fileName}`);
      
      // 3. Upload with metadata
      const metadata = {
        contentType: selectedImage.type,
        customMetadata: {
          uploadedBy: user.uid,
          eventId: eventDetails.id
        }
      };

      // 4. Upload file
      const uploadTask = uploadBytes(storageRef, selectedImage, metadata);
      
      // 5. Handle upload
      const snapshot = await uploadTask;
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 6. Create post document
      const postData = {
        eventId: eventDetails.id,
        eventName: eventDetails.name,
        ngoId: eventDetails.ngo,
        imageUrl: imageUrl,
        caption: caption,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        fileName: fileName // Store reference to file
      };

      await addDoc(collection(db, "eventPosts"), postData);

      // 7. Reset form
      setSelectedImage(null);
      setCaption("");
      setUploadingPost(false);

      // 8. Show success message
      alert("Post created successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating post:", error);
      setPostError(error.message || "Failed to create post. Please try again.");
      setUploadingPost(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          {eventDetails && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-800">{eventDetails.name}</h1>
              <p className="text-gray-600">by {eventDetails.ngo}</p>
            </div>
          )}

          {postError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              <p className="font-medium">Error uploading image:</p>
              <p>{postError}</p>
            </div>
          )}

          {/* Post Creation Form - Only show for authorized users */}
          {isAuthorized ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (e.g., max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        setPostError("File size must be less than 5MB");
                        return;
                      }
                      // Validate file type
                      if (!file.type.startsWith('image/')) {
                        setPostError("Please select an image file");
                        return;
                      }
                      setSelectedImage(file);
                      setPostError(null);
                    }
                  }}
                  className="w-full"
                  required
                />
                {selectedImage && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Write something about this moment..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!selectedImage || uploadingPost}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {uploadingPost ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Posting...
                  </div>
                ) : (
                  'Share Post'
                )}
              </button>
            </form>
          ) : user ? (
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-yellow-800">
                Only NGO members can create posts for this event.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-blue-800">
                  Please sign in as an organization to create posts for this event.
                </p>
              </div>
              <OrganizationLogin onSuccess={() => fetchEventDetails()} />
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/organization-register" className="text-green-600 hover:text-green-700">
                  Register your organization
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 