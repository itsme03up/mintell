import { NextRequest, NextResponse } from 'next/server';
import { getPostById, deletePostById } from '@/lib/blogStore';

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const deleted = deletePostById(id);
    if (deleted) {
      return new NextResponse(null, { status: 204 }); // No content
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    console.error(`Error in DELETE /api/blog/${id}:`, error);
    let errorMessage = 'Failed to delete post';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json({ error: 'Failed to delete post', details: errorMessage }, { status: 500 });
  }
}
