// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import type { MulterFile } from '../types/multer';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: MulterFile,
    folder: string = 'suma',
    resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto',
  ): Promise<UploadApiResponse> {
    // 👇 Extraer nombre limpio sin extensión
    const ext = file.originalname.split('.').pop(); // "pdf", "doc", etc.

    const originalName = file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    // 👇 public_id CON extensión
    const publicIdWithExt = `${originalName}.${ext}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: publicIdWithExt, 
          use_filename: true,
          unique_filename: true,
          type: 'upload',
        },
        (error: any, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  async destroyFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }
}