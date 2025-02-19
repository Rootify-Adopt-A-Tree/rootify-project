import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// POST: Create a new donation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, treeId, amount } = body;

    if (!userId || !treeId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create donation record
    const donationsRef = collection(db, 'donations');
    const donation = await addDoc(donationsRef, {
      userId,
      treeId,
      amount,
      status: 'pending',
      createdAt: new Date()
    });

    return NextResponse.json(
      { 
        message: 'Donation created successfully',
        donationId: donation.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Fetch donations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const donationsRef = collection(db, 'donations');
    const q = query(donationsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const donations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
