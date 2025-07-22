export type StoredFile = {
  name: string;
  description: string;
  encryptedData: string; // base64 or similar
};

export async function fetchFiles(): Promise<StoredFile[]> {
  const response = await fetch('/api/files');
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return response.json();
}
