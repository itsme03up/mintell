"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Author {
  name: string;
  role: string;
  imageUrl: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: Author;
  imageUrl: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 新規投稿用 state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 記事取得
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error('ブログ記事の読み込みに失敗しました');
      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 新規投稿追加
  const handleAddNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent || !newPostCategory) {
      alert('タイトル・内容・カテゴリを入力してください');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '投稿に失敗しました');
      }
      // 成功したらフォームクリア＆再取得
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');
      await fetchPosts();
      alert('投稿を追加しました');
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 投稿削除
  const handleDeletePost = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '削除に失敗しました');
      }
      await fetchPosts();
      alert('記事を削除しました');
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">読み込み中...</div>;
  }
  if (error) {
    return <div className="container mx-auto py-10 text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* お知らせ一覧 */}
      <section>
        <h2 className="text-4xl font-semibold mb-4">お知らせ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Card key={post.id} className="p-6">
              <time dateTime={post.date} className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('ja-JP')}</time>
              <div className="mt-2">
                <span className="inline-block bg-gray-200 px-2 py-1 text-xs rounded">{post.category}</span>
              </div>
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="mt-4 w-full h-40 object-cover rounded" />
              )}
              <h3 className="mt-4 text-xl font-semibold">{post.title}</h3>
              <p className="mt-2 text-sm text-gray-700 line-clamp-3">{post.content}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img src={post.author.imageUrl} alt={post.author.name} className="w-8 h-8 rounded-full" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-gray-500">{post.author.role}</p>
                  </div>
                </div>
                <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:underline">削除</button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 管理者セクション */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">新規投稿作成</h2>
        <form onSubmit={handleAddNewPost} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="postTitle">タイトル</Label>
            <Input
              id="postTitle"
              value={newPostTitle}
              onChange={e => setNewPostTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="postCategory">カテゴリ</Label>
            <Input
              id="postCategory"
              value={newPostCategory}
              onChange={e => setNewPostCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="postContent">内容</Label>
            <Textarea
              id="postContent"
              rows={6}
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              required
            />
          </div>
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '投稿中...' : '投稿を追加'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
let posts: BlogPost[] = []; // 簡易的にメモリ上管理

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Add default author and imageUrl if not provided
  const newPost: BlogPost = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    title: body.title,
    content: body.content,
    category: body.category,
    author: body.author || { name: 'Admin', role: 'Site Administrator', imageUrl: '/default-author.png' }, // Default author
    imageUrl: body.imageUrl || '', // Default empty image URL
    ...body
  };
  posts.push(newPost);
  return NextResponse.json(newPost, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.url.split('/').pop();
  posts = posts.filter(p => p.id !== id);
  return NextResponse.json({}, { status: 204 });
}
