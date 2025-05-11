"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BlogPost } from '@/lib/blogStore';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorImageUrl, setAuthorImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Fetch posts
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error('記事の読み込みに失敗しました');
      const data: BlogPost[] = await res.json();
      setPosts(data);
    } catch (e: unknown) {
      setPosts([]);
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Add new post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !content || !authorName || !authorRole) {
      alert('必須項目をすべて入力してください');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          content,
          imageUrl: imageUrl || undefined,
          author: {
            name: authorName,
            role: authorRole,
            imageUrl: authorImageUrl || undefined,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || err.error || '投稿に失敗しました');
      }
      // Clear form
      setTitle('');
      setCategory('');
      setContent('');
      setImageUrl('');
      setAuthorName('');
      setAuthorRole('');
      setAuthorImageUrl('');
      await fetchPosts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '投稿中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    setError(null);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || err.error || '削除に失敗しました');
      }
      await fetchPosts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '削除中にエラーが発生しました');
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) return <div className="text-center py-10">読み込み中...</div>;
  if (error) return <div className="text-center py-10 text-red-500">エラー: {error}</div>;

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Post List */}
      <section>
        <h2 className="text-4xl font-semibold mb-6">お知らせ一覧</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Card key={post.id} className="flex flex-col p-6">
              <time dateTime={post.date} className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('ja-JP')}
              </time>
              <div className="mt-2">
                <span className="inline-block bg-gray-200 px-2 py-1 text-xs rounded">
                  {post.category}
                </span>
              </div>
              {post.imageUrl && (
                <div className="relative mt-4 h-40 w-full">
                  <Image src={post.imageUrl} alt={post.title} layout="fill" objectFit="cover" className="rounded" />
                </div>
              )}
              <h3 className="mt-4 text-xl font-semibold">{post.title}</h3>
              <p className={`mt-2 text-sm text-gray-700 ${expanded[post.id] ? '' : 'line-clamp-3'}`}>
                {post.content}
              </p>
              <Button variant="link" onClick={() => toggleExpand(post.id)} className="mt-2 p-0">
                {expanded[post.id] ? '折りたたむ' : '続きを読む'}
              </Button>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex items-center">
                  {post.author.imageUrl && (
                    <Image src={post.author.imageUrl} alt={post.author.name} width={40} height={40} className="rounded-full" />
                  )}
                  <div className="ml-2">
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-gray-500">{post.author.role}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">
                  削除
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Admin Form */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">新規投稿作成</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="category">カテゴリ</Label>
            <Input id="category" value={category} onChange={e => setCategory(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="imageUrl">記事画像URL</Label>
            <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="任意" />
          </div>
          <div>
            <Label htmlFor="authorName">著者名</Label>
            <Input id="authorName" value={authorName} onChange={e => setAuthorName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="authorRole">著者役職</Label>
            <Input id="authorRole" value={authorRole} onChange={e => setAuthorRole(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="authorImageUrl">著者画像URL</Label>
            <Input id="authorImageUrl" value={authorImageUrl} onChange={e => setAuthorImageUrl(e.target.value)} placeholder="任意" />
          </div>
          <div>
            <Label htmlFor="content">内容</Label>
            <Textarea id="content" rows={6} value={content} onChange={e => setContent(e.target.value)} required />
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
