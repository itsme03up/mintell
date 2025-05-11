import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, addPost, Author } from '@/lib/blogStore';

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/blog:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.content || !body.category || !body.author || !body.author.name || !body.author.role) {
      return NextResponse.json({ error: 'Missing required fields: title, content, category, author name, and author role are required.' }, { status: 400 });
    }

    const newPostData = {
      title: body.title,
      content: body.content,
      category: body.category,
      author: body.author as Author,
      imageUrl: body.imageUrl || '', // Default to empty string if not provided
    };
    
    const newPost = addPost(newPostData);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/blog:', error);
    return NextResponse.json({ error: 'Failed to create post', details: error.message }, { status: 500 });
  }
}
