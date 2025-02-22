import { NextResponse } from 'next/server';
import { addReviewer, removeReviewer, getAllReviewers } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await addReviewer({
      wallet: data.wallet,
      name: data.name,
      role: data.role
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add reviewer' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviewers = await getAllReviewers();
    return NextResponse.json(reviewers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviewers' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { wallet } = await request.json();
    await removeReviewer(wallet);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove reviewer' }, { status: 500 });
  }
} 