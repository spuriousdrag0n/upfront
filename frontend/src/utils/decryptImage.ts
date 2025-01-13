import CryptoJS from 'crypto-js';

import { pinata } from './config';

export const decryptImage = async (ipfsHash: string) => {
  const ipfsUrl = await pinata.gateways.convert(ipfsHash);

  try {
    const response = await fetch(ipfsUrl);
    const encryptedData = await response.text();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, 'secret-key');
    const decryptedUrl = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedUrl;
  } catch (error) {
    console.log(error);
  }
};
