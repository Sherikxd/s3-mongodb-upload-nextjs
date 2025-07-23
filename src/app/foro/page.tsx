'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function ForoPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/foro/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/foro', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const { post } = await res.json();
      setPosts([post, ...posts]);
      setTitle('');
      setContent('');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">📣 Foro</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
          <textarea
            placeholder="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 h-32 rounded bg-gray-800 text-white"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Publicar
          </button>
        </form>

        <section className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p className="mt-2">{post.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
