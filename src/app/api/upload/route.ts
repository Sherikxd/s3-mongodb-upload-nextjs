import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import Busboy from 'busboy';
import { connectToDatabase } from '../../../lib/mongodb'; // Ajusta la ruta según tu estructura de carpetas
import Upload from '@/models/Upload';

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION!,
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function POST(req: NextRequest) {
  await connectToDatabase();

  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: Object.fromEntries(req.headers) });

    let fileBuffer: Buffer[] = [];
    let filename = '';
    let fileSize = 0;

    busboy.on('file', (_fieldname, file, info) => {
      filename = info.filename;

      file.on('data', (data) => {
        fileBuffer.push(data);
        fileSize += data.length;
      });

      file.on('end', async () => {
        const finalBuffer = Buffer.concat(fileBuffer);

        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: `uploads/${filename}`,
          Body: finalBuffer,
          ACL: 'public-read',
        });

        try {
          await s3.send(uploadCommand);

          const fileUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/uploads/${filename}`;

          // Guardar en MongoDB
          await Upload.create({
            filename,
            url: fileUrl,
            size: fileSize,
          });

          resolve(NextResponse.json({ url: fileUrl }));
        } catch (err) {
          console.error(err);
          reject(NextResponse.json({ error: 'Error al subir o guardar archivo' }, { status: 500 }));
        }
      });
    });

    const reqStream = req.body?.getReader();

    if (!reqStream) {
      reject(NextResponse.json({ error: 'No body stream' }, { status: 400 }));
      return;
    }

    const reader = async () => {
      while (true) {
        const { done, value } = await reqStream.read();
        if (done) {
          busboy.end();
          break;
        }
        busboy.write(value);
      }
    };

    reader().catch(reject);
  });
}
