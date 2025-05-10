import { NextRequest, NextResponse } from 'next/server';
import { getPostById, deletePostById } from '@/lib/blogData';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  const post = getPostById(id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  
  try {
    const deleted = deletePostById(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Post not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete post ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
