import { NextResponse } from 'next/server';
import { getPostById, deletePostById } from '@/lib/blogStore';

// Dynamic route handler for GET and DELETE operations on a single blog post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }
  const deleted = deletePostById(id);
  if (deleted) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json({ error: 'Post not found' }, { status: 404 });
}
