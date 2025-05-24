import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase';

import { BlogArticle } from '@/lib/types';

import BlogCard from '../components/BlogCard';

async function createBlogPost(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const post: BlogArticle = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author_name: formData.get('author_name') as string,
  };
  const { error } = await supabase.from('blog_posts').insert([post]).select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/blog');
}

const BlogPage = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch blog data');
  }

  return (
    <>
      <section className="flex flex-row flex-wrap mx-auto">
        {data?.map((post: BlogArticle) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </section>
      {/* New Blog Post Form */}
      <section className="w-full max-w-2xl px-6 py-4 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 my-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
          New Blog Post
        </h2>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          Fill in the details to create the blog post.
        </p>

        <form action={createBlogPost} className="mt-6">
          {/* <div className="items-center -mx-2 md:flex">
            <div className="w-full mx-2">
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                Blog Cover Image URL
              </label>
              <input
                name="imageUrl"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                type="text"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div> */}

          {/* <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
              Category
            </label>
            <input
              name="category"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              type="text"
              placeholder="Web Programming"
            />
          </div> */}

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
              Title
            </label>
            <input
              name="title"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              type="text"
              placeholder="How to Yawn in 7 Days"
            />
          </div>

          <div className="w-full mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
              Content
            </label>
            <textarea
              name="content"
              className="block w-full h-40 px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Lorem ipsum dolor sit amet..."
            ></textarea>
          </div>

          <div className="items-center -mx-2 md:flex mt-4">
            <div className="w-full mx-2 md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                Author Name
              </label>
              <input
                name="author_name"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                type="text"
                placeholder="John Doe"
              />
            </div>
            {/* <div className="w-full mx-2 mt-4 md:mt-0 md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                Author Avatar URL
              </label>
              <input
                name="authorAvatar"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                type="text"
                placeholder="https://example.com/avatar.jpg"
              />
            </div> */}
          </div>

          {/* <div className="items-center -mx-2 md:flex mt-4">
            <div className="w-full mx-2 md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                Date
              </label>
              <input
                name="date"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                type="text"
                placeholder="28 Sep 2020"
              />
            </div>
            <div className="w-full mx-2 mt-4 md:mt-0 md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                Read Time
              </label>
              <input
                name="readTime"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                type="text"
                placeholder="9 minutes read"
              />
            </div>
          </div> */}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            >
              Create Post
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default BlogPage;