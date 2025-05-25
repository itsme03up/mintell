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

// 投稿処理
async function createMacro(formData: FormData) {
  'use server';

  const supabase = await createClient();

  const newMacro = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    author_name: formData.get('author_name') as string,
  };

  const { error } = await supabase.from('macros').insert([newMacro]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/macros');
}

export const MacroPage = async () => {
  const supabase = await createClient();
  try {
    const {
      // data,
      error,
    } = await supabase
      .from('macros')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error.message); // ログ出力
      throw new Error(`マクロの取得に失敗しました: ${error.message}`); // 画面にも詳細表示
    }

    return (
      <>
        {/* マクロ投稿フォーム */}
        <section className="w-full max-w-2xl px-6 py-4 mx-auto bg-white dark:bg-gray-800 rounded-md shadow-md my-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">マクロ投稿</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            攻略マクロを投稿してください。
          </p>
          <form action={createMacro} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
                タイトル
              </label>
              <input
                name="title"
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                placeholder="例：スプレッドネイル基本"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
                マクロ内容（AAや/pを含める）
              </label>
              <textarea
                name="content"
                rows={8}
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 font-mono"
                placeholder={`/p 【スプレッドネイル】\n/p 　 　 　ボス\n/p 　T 　 　D　 　H`}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
                作成者名
              </label>
              <input
                name="author_name"
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                placeholder="Anna"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
              >
                登録する
              </button>
            </div>
          </form>
        </section>

        {/* 一覧表示 */}
        {/* <section className="flex flex-wrap justify-center px-4">
          {data?.map((macro: Macro) => (
            <MacroCard
              key={macro.id}
              title={macro.title}
              content={macro.content}
              author_name={macro.author_name}
              created_at={macro.created_at}
            />
          ))}
        </section> */}
      </>
    );
  } catch (error) {
    console.error('Failed to fetch macros:', error);
    throw new Error('マクロの取得に失敗しました');
  }
};

export default MemoPage;
