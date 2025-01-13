import { useState } from 'react';

import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

import DragAndDrop from './DragAndDrop';

const NormalApp = () => {
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      console.log('MetaMask not installed; using read-only defaults');
      provider = ethers.getDefaultProvider();
    } else {
      // @ts-ignore
      provider = new ethers.BrowserProvider(window.ethereum);

      signer = await provider.getSigner();

      setAccount(signer.address);
    }
  };

  const encryptImage = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const encrypted = CryptoJS.AES.encrypt(
          reader.result as string,
          'secret-key'
        ).toString();

        resolve(encrypted);
      };

      reader.readAsDataURL(file);
    });
  };

  const submitHandler = () => {
    if (!account || !price || !file) {
      return;
    }

    encryptImage(file);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Unlocket App</h1>

      {!account && (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}

      {account && <p className="text-lg mb-6">Connected Account: {account}</p>}

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <DragAndDrop file={file} onChange={setFile} />

        <div className="mt-4">
          <input
            type="text"
            value={price ?? ''}
            placeholder="Enter price in ETH"
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          onClick={submitHandler}
          className="w-full bg-green-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Generate Link
        </button>
      </div>
    </>
  );
};

export default NormalApp;
