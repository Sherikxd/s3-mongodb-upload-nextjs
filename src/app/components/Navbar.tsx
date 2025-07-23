'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? 'bg-blue-700' : 'bg-blue-600';

  return (
    <nav className="bg-gray-800 p-4 flex gap-4 justify-center">
      <Link href="/">
        <button className={`text-white px-4 py-2 rounded ${isActive('/')}`}>
          Subir Archivos
        </button>
      </Link>

      <Link href="/archivos">
        <button
          className={`text-white px-4 py-2 rounded ${isActive('/archivos')}`}
        >
          Ver Archivos
        </button>
      </Link>
      <Link href="/foro">
        <button
          className={`text-white px-4 py-2 rounded ${isActive('/foro')}`}
        >
          Foro
        </button>
      </Link>

    </nav>
  );
}
