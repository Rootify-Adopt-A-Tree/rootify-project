import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// Upload file to IPFS using Pinata
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(PINATA_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
      },
    });

    return `${PINATA_GATEWAY}${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

// Retrieve file from IPFS
export async function getFromIPFS(url: string) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
} 