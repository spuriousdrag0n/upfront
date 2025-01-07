import { useEffect, useRef, useState } from 'react';

import { ethers } from 'ethers';
import { FaRegStar } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { BallTriangle } from 'react-loader-spinner';
import { useAppKitAccount } from '@reown/appkit/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { File } from '../types';
import { queryClient } from '../main';
import { ABI } from '../constants/ABI';
import { addPoints, addRating, buyFile } from '../utils/http';
import { decryptImage } from '../utils/decryptImage';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

const Item = ({ price, userAddress, createdAt, ipfsHash, fileId }: File) => {
  const { address } = useAppKitAccount();

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationKey: ['add-points'],
    mutationFn: addPoints,
  });

  const { mutate: addRatingMutation } = useMutation({
    mutationFn: addRating,
    onSuccess(data) {
      console.log(data);

      closeButtonRef.current?.click();
    },
  });

  const { mutate: BuyFile } = useMutation({
    mutationKey: ['buy-file'],
    mutationFn: buyFile,
    onSuccess: () => {
      console.log('Buy file successfully');

      queryClient.invalidateQueries({
        queryKey: ['get-all-files', { address }],
      });

      buttonRef.current?.click();
    },
    onError: () => {
      console.log('Buy file failed');
    },
  });

  useEffect(() => {
    if (ipfsHash) {
      decryptImage(ipfsHash).then((url) => {
        setImage(url!);
      });
    }
  }, [ipfsHash]);

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
        date: new Date().toLocaleString(),
      });
    }

    setIsLoading(false);

    console.log('Transaction successful:', receipt);
  };

  const ratingHandler = () => {
    console.log(rating * 2);

    addRatingMutation({ address: userAddress, rating: rating * 2 });
  };

  return (
    <li className="border border-gray-300 rounded-2xl p-5 shadow-md transition duration-300 hover:shadow-indigo-200 hover:shadow-lg">
      {!image && <div className="p-3 bg-gray-300 mb-5 animate-pulse" />}
      {image && <img src={image} className="w-full h-28 rounded-md mb-5" />}

      <>
        <p onClick={() => buttonRef.current?.click()}>
          Owner: {address === userAddress ? 'you are owner' : ''}
        </p>
        <p>Created At: {new Date(createdAt).toLocaleDateString('en-US')}</p>
        <p>File ID: {fileId}</p>
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

      <AlertDialog>
        <AlertDialogTrigger ref={buttonRef} className="hidden">
          Open
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rating</AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center gap-6">
              {Array.from({ length: 5 }, (_, n) => (
                <FaRegStar
                  className="size-8"
                  onClick={() => setRating(n + 1)}
                  style={{ color: rating >= n + 1 ? 'gold' : 'gray' }}
                />
              ))}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="hidden" ref={closeButtonRef}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={ratingHandler}
              className="bg-indigo-600"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
};

export default Item;
