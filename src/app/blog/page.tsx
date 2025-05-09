'use client';
import React from 'react';

const BlogPage = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">お知らせ</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">FCメンバー向けのお知らせ</p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 border-b pb-16">
                    <article className="flex max-w-xl flex-col items-start justify-between bg-white p-6 shadow-lg rounded-lg overflow-hidden">
                        <div className="flex items-center gap-x-4 text-xs">
                            <time dateTime="2020-03-16" className="text-gray-500">2020年3月16日</time>
                            <a href="#" className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">マーケティング</a>
                        </div>
                        <div className="group relative">
                            <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                                <a href="#">
                                    <img src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80" alt="記事の画像1" className="mt-4 w-full h-40 object-cover rounded-md" />
                                    <span className="absolute inset-0"></span>
                                    コンバージョン率を上げる
                                </a>
                            </h3>
                            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">これはサンプルテキストです。実際のコンテンツに置き換えてください。ここに記事の概要が入ります。</p>
                        </div>
                        <div className="relative mt-8 flex items-center gap-x-4">
                            <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="size-10 rounded-full bg-gray-50" />
                            <div className="text-sm/6">
                                <p className="font-semibold text-gray-900">
                                    <a href="#">
                                        <span className="absolute inset-0"></span>
                                        Minfilia Warde'
                                    </a>
                                </p>
                                <p className="text-gray-600">FCマスター</p>
                            </div>
                        </div>
                    </article>

                    <article className="flex max-w-xl flex-col items-start justify-between bg-white p-6 shadow-lg rounded-lg overflow-hidden">
                        <div className="flex items-center gap-x-4 text-xs">
                            <time dateTime="2020-03-16" className="text-gray-500">2020年3月16日</time>
                            <a href="#" className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">イベント</a >
                        </div>
                        <div className="group relative">
                            <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                                <a href="#">
                                    <img src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80" alt="記事の画像1" className="mt-4 w-full h-40 object-cover rounded-md" />
                                    <span className="absolute inset-0"></span>
                                    次回のFCイベントについて
                                </a>
                            </h3>
                            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">次回のFCイベントは、クリスタルタワー攻略です！参加希望者はフォーラムに書き込みをお願いします。</p>
                        </div>
                        <div className="relative mt-8 flex items-center gap-x-4">
                            <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="size-10 rounded-full bg-gray-50" />
                            <div className="text-sm/6">
                                <p className="font-semibold text-gray-900">
                                    <a href="#">
                                        <span className="absolute inset-0"></span>
                                        Minfilia Warde'
                                    </a>
                                </p>
                                <p className="text-gray-600">FCマスター</p>
                            </div>
                        </div>
                    </article>

                    <article className="flex max-w-xl flex-col items-start justify-between bg-white p-6 shadow-lg rounded-lg overflow-hidden">
                        <div className="flex items-center gap-x-4 text-xs">
                            <time dateTime="2020-03-10" className="text-gray-500">2020年3月10日</time>
                            <a href="#" className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">攻略情報</a>
                        </div>
                        <div className="group relative">
                            <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                                <a href="#">
                                    <img src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80" alt="記事の画像1" className="mt-4 w-full h-40 object-cover rounded-md" />
                                    <span className="absolute inset-0"></span>
                                    最新レイドの攻略ポイント
                                </a>
                            </h3>
                            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">先日実装された最新レイドの攻略情報をまとめました。特に第2フェーズのギミックに注意が必要です。</p>
                        </div>
                        <div className="relative mt-8 flex items-center gap-x-4">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="size-10 rounded-full bg-gray-50" />
                            <div className="text-sm/6">
                                <p className="font-semibold text-gray-900">
                                    <a href="#">
                                        <span className="absolute inset-0"></span>
                                        Alphinaud Leveilleur
                                    </a>
                                </p>
                                <p className="text-gray-600">書記</p>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Admin Section Placeholder */}
                <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none border-t border-gray-200 pt-10">
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">管理者セクション</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">このセクションはブログ記事を管理するためのものです。（機能は後日実装予定）</p>
                    {/* Placeholder for admin controls */}
                    <div className="mt-6">
                        <div>
                            <label htmlFor="postTitle" className="block text-sm font-medium leading-6 text-gray-900">記事タイトル</label>
                            <input type="text" name="postTitle" id="postTitle" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" placeholder="素晴らしい記事のタイトル" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="postContent" className="block text-sm font-medium leading-6 text-gray-900">記事内容</label>
                            <textarea id="postContent" name="postContent" rows={6} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" placeholder="記事の内容をここに記述..."></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="postImage" className="block text-sm font-medium leading-6 text-gray-900">画像添付</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    {/* Placeholder for an icon, e.g., PhotoIcon */}
                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                    </svg>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label htmlFor="file-upload-admin" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>ファイルをアップロード</span>
                                            <input id="file-upload-admin" name="file-upload-admin" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">またはドラッグ＆ドロップ</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF 最大10MB</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            新しい投稿を追加
                        </button>
                    </div>
                </div>

                {/* Comments Section Placeholder */}
                <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none border-t border-gray-200 pt-10">
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">コメント</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">このセクションはコメントを残すためのものです。（機能は後日実装予定）</p>
                    {/* Placeholder for comments form and display */}
                    <div className="mt-6">
                        <div>
                            <label htmlFor="commenterName" className="block text-sm font-medium leading-6 text-gray-900">お名前</label>
                            <input type="text" name="commenterName" id="commenterName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" placeholder="お名前を入力" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="commentText" className="block text-sm font-medium leading-6 text-gray-900">コメント</label>
                            <textarea id="commentText" name="commentText" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" placeholder="ここにコメントを記入してください..."></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="commentImage" className="block text-sm font-medium leading-6 text-gray-900">画像添付 (任意)</label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    {/* Placeholder for an icon, e.g., PhotoIcon */}
                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                    </svg>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label htmlFor="file-upload-comment" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>ファイルをアップロード</span>
                                            <input id="file-upload-comment" name="file-upload-comment" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">またはドラッグ＆ドロップ</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF 最大5MB</p>
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            コメントを送信
                        </button>
                    </div>
                    <div className="mt-8 space-y-8">
                        {/* Comments will be displayed here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
