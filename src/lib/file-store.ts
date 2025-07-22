import { supabase } from './supabase-client';

export type StoredFile = {
  id?: string;
  user_id?: string;
  name: string;
  description: string;
  encryptedData: string; // base64 or similar
};

export async function getFiles(): Promise<StoredFile[]> {
  const { data, error } = await supabase
    .from('files')
    .select('*');
  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }
  return data || [];
}

export async function addFile(file: StoredFile): Promise<boolean> {
  const { error } = await supabase
    .from('files')
    .insert([
      {
        user_id: file.user_id,
        name: file.name,
        description: file.description,
        encrypted_data: file.encryptedData,
      },
    ]);
  if (error) {
    console.error('Error adding file:', error);
    return false;
  }
  return true;
}
