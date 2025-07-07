import { connectToDatabase } from '@/lib/mongodb';
import Upload from '@/models/Upload';
import Navbar from '../components/Navbar';

export const dynamic = 'force-dynamic'; // Para que no use cache

export default async function ArchivosPage() {
  await connectToDatabase();
  const archivos = await Upload.find().sort({ uploadedAt: -1 }).lean();

  return (
        <>
      <Navbar /> 
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">📁 Archivos Subidos</h1>

      {archivos.length === 0 && <p>No hay archivos subidos aún.</p>}

      <ul className="space-y-4">
        {archivos.map((archivo: any) => (
          <li
            key={archivo._id}
            className="bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div>
              <p className="font-semibold">{archivo.filename}</p>
              <p className="text-sm text-gray-400">
                Tamaño: {(archivo.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-gray-500">
                Subido: {new Date(archivo.uploadedAt).toLocaleString()}
              </p>
            </div>
            <a
              href={archivo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 sm:mt-0 text-blue-400 hover:underline"
            >
              Ver archivo →
            </a>
          </li>
        ))}
      </ul>
    </main>
    </>
  );
}
