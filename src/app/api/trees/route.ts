import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';

// GET: Fetch available trees
export async function GET(request: NextRequest) {
  try {
    const treesRef = collection(db, 'trees');
    const q = query(treesRef, where('available', '==', true));
    const querySnapshot = await getDocs(q);
    
    const trees = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(trees);
  } catch (error) {
    console.error('Error fetching trees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Plant a new tree
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { treeId, userId, location, species } = body;

    if (!treeId || !userId || !location || !species) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create plantation record
    const plantationRef = collection(db, 'plantations');
    const plantation = await addDoc(plantationRef, {
      treeId,
      userId,
      location,
      species,
      status: 'pending',
      plantedAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      verificationStatus: 'pending',
      growthUpdates: [],
      healthStatus: 'good'
    });

    // Update tree availability
    const treesRef = collection(db, 'trees');
    const treeQuery = query(treesRef, where('id', '==', treeId));
    const treeDoc = await getDocs(treeQuery);
    
    if (!treeDoc.empty) {
      // TODO: Update tree availability
    }
    
    return NextResponse.json(
      { 
        message: 'Tree plantation initiated',
        plantationId: plantation.id,
        status: 'pending'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error planting tree:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
