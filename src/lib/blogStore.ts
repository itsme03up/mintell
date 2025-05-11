export interface Author {
  name: string;
  role: string;
  imageUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: Author;
  imageUrl: string;
}

let posts: BlogPost[] = [];

export const getPostById = (id: string): BlogPost | undefined => {
  const post = posts.find(p => p.id === id);
  return post;
};

export const getAllPosts = (): BlogPost[] => {
  // Return a new array to prevent direct mutation of the store's array from outside,
  // and sort by date descending (newest first)
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addPost = (postData: Omit<BlogPost, 'id' | 'date'>): BlogPost => {
  const newPost: BlogPost = {
    ...postData,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    author: {
      ...postData.author,
      imageUrl: postData.author.imageUrl || '/default-author.png',
    },
    imageUrl: postData.imageUrl || '',
  };
  posts.push(newPost);
  return newPost;
};

// createPost alias to match API route usage
export const createPost = addPost;

export const deletePostById = (id: string): boolean => {
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== id);
  return posts.length < initialLength;
};
