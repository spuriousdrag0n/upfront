import {
  AlertDialog,
  AlertDialogAction,
  // AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

import { FaRegStar } from 'react-icons/fa';

type Props = {
  isOpen: boolean;
  onSubmit: (value: number) => void;
};

const RatingDialog = ({ isOpen, onSubmit }: Props) => {
  const [rating, setRating] = useState(0);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
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

          <AlertDialogAction
            onClick={onSubmit.bind(this, rating)}
            className="bg-indigo-600"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RatingDialog;
