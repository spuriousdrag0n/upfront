import { useState } from 'react';

import { ethers } from 'ethers';
import { useMutation } from '@tanstack/react-query';
import { BallTriangle } from 'react-loader-spinner';
import { useAppKitAccount } from '@reown/appkit/react';

import { File } from '../types';
import img from '@/assets/img.webp';
import { queryClient } from '../main';
import { ABI } from '../constants/ABI';
import { addPoints, buyFile } from '../utils/http';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

const Item = ({ price, userAddress, createdAt, ipfsHash, fileId }: File) => {
  const { address } = useAppKitAccount();

  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ['add-points'],
    mutationFn: addPoints,
  });

  const { mutate: BuyFile } = useMutation({
    mutationKey: ['buy-file'],
    mutationFn: buyFile,
    onSuccess: () => {
      console.log('Buy file successfully');

      queryClient.invalidateQueries({
        queryKey: ['get-all-files', { address }],
      });
    },
    onError: () => {
      console.log('Buy file failed');
    },
  });

  const buyHandler = async () => {
    if (!window.ethereum) return;

    setIsLoading(true);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const convertedPrice = ethers.parseEther(price);

    console.log('File ID : ', fileId);
    console.log('Converted Price : ', convertedPrice);

    const tx = await contract.buyFile(fileId, { value: convertedPrice });
    const receipt = await tx.wait();

    if (receipt) {
      mutate({ address: address!, points: '100' });
      BuyFile({
        price,
        fileId,
        ipfsHash,
        address: address!,
        fileOwner: userAddress,
        date: new Date().toLocaleString(),
      });
    }

    setIsLoading(false);

    console.log('Transaction successful:', receipt);
  };

  return (
    <li className="border border-gray-300 rounded-2xl p-5 shadow-md transition duration-300 hover:shadow-indigo-200 hover:shadow-lg">
      <img src={img} className="w-full h-28 rounded-md mb-5 blur-sm" />

      <>
        {/* <p onClick={() => setIsOpen(true)}>
          Owner: {address === userAddress ? 'you are owner' : ''}
        </p> */}
        <p>Created At: {new Date(createdAt).toLocaleDateString('en-US')}</p>
        {/* <p>File ID: {fileId}</p> */}
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
            {isLoading ? (
              <BallTriangle height={25} width={25} color="#fff" />
            ) : (
              'Buy'
            )}
          </button>
        )}
      </div>
    </li>
  );
};

export default Item;
