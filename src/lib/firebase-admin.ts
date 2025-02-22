import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Example reviewer document structure in Firebase
interface Reviewer {
  wallet: string;
  name: string;
  role: 'reviewer' | 'admin';
  createdAt: Date;
}

// Initialize Firebase Admin if not already initialized
const apps = getApps();
if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const adminDb = getFirestore();

// Helper functions for managing reviewers
export async function addReviewer(reviewerData: Omit<Reviewer, 'createdAt'>) {
  const reviewerRef = adminDb.collection('reviewers').doc(reviewerData.wallet);
  await reviewerRef.set({
    ...reviewerData,
    createdAt: new Date()
  });
}

export async function removeReviewer(wallet: string) {
  await adminDb.collection('reviewers').doc(wallet).delete();
}

export async function isReviewer(wallet: string): Promise<boolean> {
  const reviewerDoc = await adminDb.collection('reviewers').doc(wallet).get();
  return reviewerDoc.exists;
}

export async function getAllReviewers(): Promise<Reviewer[]> {
  const snapshot = await adminDb.collection('reviewers').get();
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    wallet: doc.id
  })) as Reviewer[];
}

export async function updateReviewerRole(wallet: string, role: 'reviewer' | 'admin') {
  await adminDb.collection('reviewers').doc(wallet).update({ role });
}

// Example usage:
// Add a reviewer
// await addReviewer({
//   wallet: "7jY5t7hbpZvmcZSPrFwaHAb8DhYDupt3CwMJ2aMQXDG1",
//   name: "John Doe",
//   role: "reviewer"
// }); 