import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  await connectToDatabase();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ posts });
}
