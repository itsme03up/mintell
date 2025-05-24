import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase';

import { MemoArticle } from '@/lib/types';

import MemoCard from '../components/MemoCard';

async function createMemoPost(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const post: MemoArticle = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author_name: formData.get('author_name') as string,
  };
  const { error } = await supabase.from('memo_posts').insert([post]).select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/memo');
}

const MemoPage = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('memo_posts').select('*').order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch memo data');
  }

  return (
    <>
      <section className="flex flex-row flex-wrap mx-auto">
        {data?.map((post: MemoArticle) => (
          <MemoCard key={post.id} post={post} />
        ))}
      </section>
      {/* New Memo Post Form */}
      <section className="w-full max-w-2xl px-6 py-4 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 my-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
          New Memo Post
        </h2>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          Fill in the details to create the memo post.
        </p>

        <form action={createMemoPost} className="mt-6">

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
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            >
              Create Memo
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default MemoPage;