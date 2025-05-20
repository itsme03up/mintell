export interface Author {
  name: string;
  role: string;
  imageUrl: string;
}

export type BlogArticle = {
  id?: string;
  title: string;
  content: string;
  author_name: string;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string; // ISO string
  author: Author;
  imageUrl: string;
}

let posts: BlogPost[] = [
  {
    id: '1',
    title: 'コンバージョン率を上げる',
    content: 'これはサンプルテキストです。実際のコンテンツに置き換えてください。ここに記事の概要が入ります。',
    category: 'マーケティング',
    date: new Date('2020-03-16').toISOString(),
    author: {
      name: "Minfilia Warde'",
      role: 'FCマスター',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
  },
  {
    id: '2',
    title: '次回のFCイベントについて',
    content: '次回のFCイベントは、クリスタルタワー攻略です！参加希望者はフォーラムに書き込みをお願いします。',
    category: 'イベント',
    date: new Date('2020-03-16').toISOString(),
    author: {
      name: "Minfilia Warde'",
      role: 'FCマスター',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
  },
  {
    id: '3',
    title: '最新レイドの攻略ポイント',
    content: '先日実装された最新レイドの攻略情報をまとめました。特に第2フェーズのギミックに注意が必要です。',
    category: '攻略情報',
    date: new Date('2020-03-10').toISOString(),
    author: {
      name: 'Alphinaud Leveilleur',
      role: '書記',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    imageUrl: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
  },
];

export const getPosts = (): BlogPost[] => posts;

export const getPostById = (id: string): BlogPost | undefined => posts.find(post => post.id === id);

export const addPost = (postData: { title: string; content: string; category: string; imageUrl?: string }): BlogPost => {
  const newPost: BlogPost = {
    id: String(posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id))) + 1 : 1), // More robust ID generation
    title: postData.title,
    content: postData.content,
    category: postData.category,
    date: new Date().toISOString(),
    author: { // Default author for new posts
      name: "Admin User",
      role: "Content Creator",
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    imageUrl: postData.imageUrl || 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80', // Use provided or default image
  };
  posts.push(newPost);
  return newPost;
};

export const deletePostById = (id: string): boolean => {
  const initialLength = posts.length;
  posts = posts.filter(post => post.id !== id);
  return posts.length < initialLength;
};
