import { MemoArticle } from "@/lib/types";

export default function MemoCard({ post }: { post: MemoArticle }) {
  return (
    <div className="transition-all duration-150 flex w-full px-4 py-6 md:w-1/2 lg:w-1/3">
      <div className="flex flex-col items-stretch min-h-full pb-4 mb-6 transition-all duration-150 bg-white rounded-lg shadow-lg hover:shadow-2xl">
        <hr className="border-gray-300" />
        <div className="flex flex-wrap items-center flex-1 px-4 py-1 text-center mx-auto">
          <a href={`/memo/${post.id}`} className="hover:underline">
            <h2 className="text-2xl font-bold tracking-normal text-gray-800">
              {post.title}
            </h2>
          </a>
        </div>
        <hr className="border-gray-300" />
        <p className="flex flex-row flex-wrap w-full px-4 py-2 overflow-hidden text-sm text-justify text-gray-700">
          {post.content}
        </p>
        <hr className="border-gray-300" />
        <section className="px-4 py-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="flex flex-col mx-2">
                <span className="font-semibold text-gray-700">
                  {post.author_name}
                </span>
                <span className="mx-1 text-xs text-gray-600">{post.created_at ? new Date(post.created_at).toLocaleString('ja-JP') : ""}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}