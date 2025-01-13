import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

const ReportDialog = ({ isOpen, isPending, onClose, onSubmit }: Props) => {
  const [message, setMessage] = useState('');

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };

  return (
    <div onClick={onClose}>
      <AlertDialog open={isOpen}>
        <AlertDialogContent
          onClick={(e) => e.stopPropagation()}
          className="w-[90%] rounded-lg border border-primary"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              You're previous rated was low, so tell us what's a problem
            </AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center gap-6">
              <Textarea
                value={message}
                onChange={changeHandler}
                placeholder="Type you're message"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              disabled={isPending}
              onClick={onSubmit.bind(this, message)}
            >
              {isPending ? 'Loading...' : 'Report'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportDialog;
