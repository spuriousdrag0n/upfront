import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

import { FaRegStar } from 'react-icons/fa';

type Props = {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (value: number) => void;
};

const RatingDialog = ({ isOpen, onSubmit, onClose, isPending }: Props) => {
  const [rating, setRating] = useState(0);

  return (
    <div onClick={onClose}>
      <AlertDialog open={isOpen}>
        <AlertDialogContent
          onClick={(e) => e.stopPropagation()}
          className="w-[90%] rounded-lg border border-primary"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Rating</AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center gap-6">
              {Array.from({ length: 5 }, (_, n) => (
                <FaRegStar
                  key={n}
                  className="size-8"
                  onClick={() => setRating(n + 1)}
                  style={{ color: rating >= n + 1 ? 'gold' : 'gray' }}
                />
              ))}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            {/* <AlertDialogCancel className="hidden">Cancel</AlertDialogCancel> */}

            <AlertDialogAction onClick={onSubmit.bind(this, rating)}>
              {isPending ? 'Loading...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RatingDialog;
