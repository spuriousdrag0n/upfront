import { useEffect, useState } from 'react';

import CryptoJS from 'crypto-js';
import { useAppKitAccount } from '@reown/appkit/react';

import { File } from '../types';
import { ethers } from 'ethers';
import { ABI } from '../constants/ABI';
import { pinata } from '../utils/config';

const CONTRACT_ADDRESS = '0x9e76aab5e4d17Ee17426954f8aFF11Bb569a64C2';

const Item = ({ price, userAddress, createdAt, ipfsHash, fileId }: File) => {
  const { address } = useAppKitAccount();

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const getImage = async (ipfsHash: string) => {
      const ipfsUrl = await pinata.gateways.convert(ipfsHash);

      try {
        const response = await fetch(ipfsUrl);
        const encryptedData = await response.text();
        const decrypted = CryptoJS.AES.decrypt(encryptedData, 'secret-key');
        const decryptedUrl = decrypted.toString(CryptoJS.enc.Utf8);

        setImage(decryptedUrl);
      } catch (error) {
        console.log(error);
      }
    };

    getImage(ipfsHash);
  }, [ipfsHash]);

  const buyHandler = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const convertedPrice = ethers.parseEther(price);

    const tx = await contract.buyFile(fileId, { value: convertedPrice });
    const receipt = await tx.wait();

    console.log('Transaction successful:', receipt);
  };

  return (
    <li className="border border-gray-300 rounded-2xl p-5 shadow-md transition duration-300 hover:shadow-indigo-200 hover:shadow-lg">
      {!image && <div className="p-3 bg-gray-300 mb-5 animate-pulse" />}
      {image && <img src={image} className="w-full h-28 rounded-md mb-5" />}

      <>
        <p>Owner: {address === userAddress ? 'you are owner' : ''}</p>
        <p>Created At: {new Date(createdAt).toLocaleDateString('en-US')}</p>
      </>

      <hr className="border border-gray-100 my-5" />

      <div className="flex justify-between">
        <div>
          <p className="text-[#64748B]">Price</p>
          <p className="font-bold text-xl">{price} ETH</p>
        </div>

        {userAddress !== address && (
          <button
            onClick={buyHandler}
            className="bg-indigo-700 text-white rounded-xl px-7"
          >
            Buy
          </button>
        )}
      </div>
    </li>
  );
};

export default Item;
