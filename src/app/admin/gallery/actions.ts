'use server'

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function uploadGalleryImage(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    const cat = formData.get('cat') as string;
    const label = formData.get('label') as string;
    const size = formData.get('size') as string;

    if (!file || !cat || !label || !size) {
      return { error: 'All fields are required.' };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to public/images/ directory
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const publicPath = path.join(process.cwd(), 'public', 'images', fileName);
    fs.writeFileSync(publicPath, buffer);

    // Update gallery.json
    const jsonPath = path.join(process.cwd(), 'data', 'gallery.json');
    let galleryData = [];
    try {
      const data = fs.readFileSync(jsonPath, 'utf8');
      galleryData = JSON.parse(data);
    } catch (e) {
      console.log('No existing gallery data found, starting fresh.');
    }

    const newItem = {
      src: `/images/${fileName}`,
      cat,
      label,
      size
    };

    galleryData.unshift(newItem); // add to beginning
    fs.writeFileSync(jsonPath, JSON.stringify(galleryData, null, 2));

    revalidatePath('/gallery');
    return { success: true };
  } catch (error: any) {
    console.error('Upload failed:', error);
    return { error: error.message };
  }
}
