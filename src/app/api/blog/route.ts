import { NextRequest, NextResponse } from 'next/server';
import { getPosts, addPost, BlogPost } from '@/lib/blogData'; // Import from the new module

export async function GET(request: NextRequest) {
  const posts = getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, imageUrl } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    const newPost = addPost({ title, content, category, imageUrl });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
