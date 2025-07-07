'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.url);
  };

  return (
    <>
    <Navbar />
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Subir Archivo a DigitalOcean</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file:bg-blue-600 file:text-white file:rounded px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Subir
        </button>
      </form>

      {uploadedUrl && (
        <p className="mt-4">
          Archivo subido:{" "}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
            Ver archivo
          </a>
        </p>
      )}
    </main>
    </>
  );
}