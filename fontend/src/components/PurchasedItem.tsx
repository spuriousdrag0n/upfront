import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useAppKitAccount } from '@reown/appkit/react';

import { Button } from './ui/button';
import { FurchasedFile } from '@/types';
import RatingDialog from './RatingDialog';
import ReportDialog from './ReportDialog';
import { errorToast } from '@/utils/errorToast';
import { addRating, addReport } from '@/utils/http';
import { successToast } from '@/utils/successToast';
import { decryptImage } from '../utils/decryptImage';

type Props = FurchasedFile;

const PurchasedItem = ({ date, price, ipfsHash, fileOwner }: Props) => {
  const { address } = useAppKitAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { mutate: addRatingMutation, isPending } = useMutation({
    mutationFn: addRating,
    onSuccess({ rating }) {
      successToast('Rarting successfully');

      if (rating <= 4) setIsReportOpen(true);
      setIsOpen(false);
    },
    onError: () => {
      errorToast();
    },
  });

  const { mutate: report, isPending: isReportMutation } = useMutation({
    mutationKey: ['add-report'],
    mutationFn: addReport,
    onSuccess: () => {
      setIsReportOpen(false);
      successToast('Report successfully');
    },
    onError: () => {
      errorToast();
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

  const reportHandler = (message: string) => {
    report({ message, address: fileOwner, repoter: address! });
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const closeReportHandler = () => {
    setIsReportOpen(false);
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

      <ReportDialog
        isOpen={isReportOpen}
        onSubmit={reportHandler}
        isPending={isReportMutation}
        onClose={closeReportHandler}
      />
    </>
  );
};

export default PurchasedItem;
