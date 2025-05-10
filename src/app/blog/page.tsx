'use client';
import React, { useState, useEffect } from 'react';

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

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for new post form
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/blog');
            if (!response.ok) {
                throw new Error('ブログ記事の読み込みに失敗しました');
            }
            const data = await response.json();
            setPosts(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleAddNewPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle || !newPostContent || !newPostCategory) {
            alert('タイトル、内容、カテゴリをすべて入力してください。');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newPostTitle,
                    content: newPostContent,
                    category: newPostCategory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '新しい投稿の追加に失敗しました');
            }
            
            // Clear form and refetch posts
            setNewPostTitle('');
            setNewPostContent('');
            setNewPostCategory('');
            await fetchPosts(); // Refresh the posts list
            alert('新しい投稿が追加されました！');

        } catch (err: any) {
            console.error("Failed to add new post:", err);
            alert(`エラー: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm('本当にこの記事を削除しますか？')) {
            return;
        }
        try {
            const response = await fetch(`/api/blog/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '記事の削除に失敗しました');
            }
            alert('記事が削除されました。');
            await fetchPosts(); // Refresh the posts list
        } catch (err: any) {
            console.error(`Failed to delete post ${postId}:`, err);
            alert(`削除エラー: ${err.message}`);
        }
    };

    if (isLoading) {
        return <div className="container mx-auto py-10 text-center">読み込み中...</div>;
    }

    if (error) {
        return <div className="container mx-auto py-10 text-center text-red-500">エラー: {error}</div>;
    }

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">お知らせ</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">FCメンバー向けのお知らせ</p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 border-b pb-16">
                    {posts.map((post) => (
                        <article key={post.id} className="flex max-w-xl flex-col items-start justify-between bg-white p-6 shadow-lg rounded-lg overflow-hidden">
                            <div className="flex items-center gap-x-4 text-xs">
                                <time dateTime={post.date} className="text-gray-500">
                                    {new Date(post.date).toLocaleDateString('ja-JP')}
                                </time>
                                <a href="#" className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                                    {post.category}
                                </a>
                            </div>
                            <div className="group relative">
                                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                                    <a href="#"> {/* Consider linking to a detail page: /blog/${post.id} */}
                                        <img src={post.imageUrl} alt={`記事「${post.title}」の画像`} className="mt-4 w-full h-40 object-cover rounded-md" />
                                        <span className="absolute inset-0"></span>
                                        {post.title}
                                    </a>
                                </h3>
                                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.content}</p>
                            </div>
                            <div className="relative mt-8 flex items-center gap-x-4">
                                <img src={post.author.imageUrl} alt={`${post.author.name}のアバター`} className="size-10 rounded-full bg-gray-50" />
                                <div className="text-sm/6">
                                    <p className="font-semibold text-gray-900">
                                        <a href="#">
                                            <span className="absolute inset-0"></span>
                                            {post.author.name}
                                        </a>
                                    </p>
                                    <p className="text-gray-600">{post.author.role}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-sm font-semibold leading-6 text-red-600 hover:text-red-800"
                                >
                                    削除
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Admin Section Placeholder */}
                <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none border-t border-gray-200 pt-10">
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">管理者セクション</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">このセクションはブログ記事を管理するためのものです。</p>
                    <form onSubmit={handleAddNewPost} className="mt-6">
                        <div>
                            <label htmlFor="postTitle" className="block text-sm font-medium leading-6 text-gray-900">記事タイトル</label>
                            <input 
                                type="text" 
                                name="postTitle" 
                                id="postTitle" 
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" 
                                placeholder="素晴らしい記事のタイトル" 
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="postCategory" className="block text-sm font-medium leading-6 text-gray-900">カテゴリ</label>
                            <input 
                                type="text" 
                                name="postCategory" 
                                id="postCategory" 
                                value={newPostCategory}
                                onChange={(e) => setNewPostCategory(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" 
                                placeholder="例: イベント, 攻略情報" 
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="postContent" className="block text-sm font-medium leading-6 text-gray-900">記事内容</label>
                            <textarea 
                                id="postContent" 
                                name="postContent" 
                                rows={6} 
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" 
                                placeholder="記事の内容をここに記述..."
                                required
                            ></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="postImage" className="block text-sm font-medium leading-6 text-gray-900">画像添付 (現在はダミー)</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF 最大10MB (この機能は現在実装されていません)</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '投稿中...' : '新しい投稿を追加'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
