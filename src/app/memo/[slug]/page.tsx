"use client"; // Add this line

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button"; // Add this import

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Define the macro text
const macroText = `/p ■P1散開　　 　　■メテオ(塔)処理
/p D3　MT　D4　　　北(西)：T1　南(東)：T2
/p H1　 ★ 　 H2　　■捕獲されるヒラ
/p D1　 ST 　D2　　　北西or南東捨て
/p ――――――――――――――――――――――――
/p ■頭割 ←T1/D1/D3/H1 　T2/D2/D4/H2→
/p ■線取 北側：タンク　南側：ヒラ
/p ■法則改変　　　　　■殉教者の記憶
/p 　D4/T1　　　　　　 　 D1　D2
/p D1H1★ H2D2　　 T1/H１ 　 　 H2/T2
/p 　 D3/T2　　　　　　　　D３　D4
/p (※Tank・Healerはﾀｰｹﾞｯﾄｻｰｸﾙを踏む)
/p ――――――――――――――――――――――――
/p ■深淵　←T1/D1/H1（頭割）T2/D2/H2→
/p 　　　　　　←D3　（円範囲誘導）　D4→`;

const BlogPostPage = ({ params }: BlogPostPageProps) => { // Remove async
  // Adjust slug extraction for client component
  const { slug } = params;

  // In a real application, you would fetch blog post data based on the slug
  const post = {
    title: decodeURIComponent(slug).replace(/-/g, ' '),
    category: "Web Programming",
    coverImage: "https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder-1024x512.png",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, magni fugiat, odit incidunt necessitatibus aut nesciunt exercitationem aliquam id voluptatibus quisquam maiores officia sit amet accusantium aliquid quo obcaecati quasi. This is the full content of the blog post. More details would be fetched and displayed here.",
    authorName: "Fajrian Aidil Pratama",
    authorAvatar: "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg",
    date: "28 Sep 2020",
    readTime: "9 minutes read",
  };

  // Dummy comments data
  const comments = [
    {
      id: 1,
      author: "Jane Doe",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      date: "30 Sep 2020",
      text: "Great article! Really enjoyed reading this.",
    },
    {
      id: 2,
      author: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      date: "01 Oct 2020",
      text: "Very informative, thank you for sharing.",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(macroText);
    alert('マクロをクリップボードにコピーしました');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Macro Display Area replacing the image */}
        <div className="p-4 sm:p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">マクロコピー</h2>
          <textarea
            readOnly
            value={macroText}
            className="w-full h-48 p-2 border rounded-md font-mono bg-white text-sm"
            aria-label="Macro text"
          />
          <div className="mt-2">
            <Button onClick={handleCopy}>マクロをコピー</Button>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-blue-600 uppercase">
              {post.category}
            </span>
            <Link href="/blog" className="text-blue-600 hover:underline">
              &larr; Back to Blog
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 capitalize">
            {post.title}
          </h1>
          <div className="flex items-center mb-6">
            <Image
              className="object-cover h-12 w-12 rounded-full mr-4"
              src={post.authorAvatar}
              alt="Author Avatar"
              width={48}
              height={48}
            />
            <div>
              <p className="font-semibold text-gray-700">{post.authorName}</p>
              <p className="text-sm text-gray-600">
                {post.date} &bull; {post.readTime}
              </p>
            </div>
          </div>
          <hr className="border-gray-300 mb-6" />
          <article className="prose prose-lg max-w-none text-gray-700">
            <p>{post.content}</p>
            {/* Add more content rendering here as needed */}
          </article>
        </div>
        {/* Comments Section */}
        <div className="p-6 md:p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h2>

          {/* Comment Form */}
          <form className="mb-6">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Add a comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Write your comment here..."
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your name"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post Comment
            </button>
          </form>

          {/* Existing Comments */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <Image
                  className="object-cover h-10 w-10 rounded-full"
                  src={comment.avatar}
                  alt={`${comment.author}'s avatar`}
                  width={40}
                  height={40}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">{comment.author}</p>
                    <p className="text-xs text-gray-500">{comment.date}</p>
                  </div>
                  <p className="text-gray-600 mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
