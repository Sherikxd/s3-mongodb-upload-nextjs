import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
  }

  const post = await Post.create({ title, content });
  return NextResponse.json({ success: true, post });
}
