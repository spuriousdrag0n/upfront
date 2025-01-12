import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { Button } from './ui/button';
import { addRating } from '@/utils/http';
import RatingDialog from './RatingDialog';
import ReportDialog from './ReportDialog';
import { decryptImage } from '../utils/decryptImage';
import { useAppKitAccount } from '@reown/appkit/react';

type Props = {
  fileId: string;
  date: string;
  price: string;
  ipfsHash: string;
  fileOwner: string;
};

const PurchasedItem = ({ date, price, ipfsHash, fileOwner }: Props) => {
  const { address } = useAppKitAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { mutate: addRatingMutation, isPending } = useMutation({
    mutationFn: addRating,
    onSuccess(data) {
      console.log(data);
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (ipfsHash) {
      decryptImage(ipfsHash).then((url) => {
        setImage(url!);
      });
    }
  }, [ipfsHash]);

  const ratingHandler = (rating: number) => {
    addRatingMutation({
      address: fileOwner,
      rating: rating * 2,
      ratedBy: address!,
    });
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <li className="border border-gray-300 rounded-2xl p-5 shadow-md transition duration-300 hover:shadow-indigo-200 hover:shadow-lg">
        {!image && <div className="p-3 bg-gray-300 mb-5 animate-pulse" />}
        {image && <img src={image} className="w-full h-28 rounded-md mb-5" />}

        {/* <p>File Id: {fileId}</p> */}
        <p>purchased at: {date}</p>
        <p>Price: {price}</p>

        <Button onClick={() => setIsOpen(true)} className="w-full mt-2">
          Rating
        </Button>
      </li>

      <RatingDialog
        isOpen={isOpen}
        isPending={isPending}
        onClose={closeHandler}
        onSubmit={ratingHandler}
      />

      <ReportDialog />
    </>
  );
};

export default PurchasedItem;
