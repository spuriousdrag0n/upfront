import { toast } from '@/hooks/use-toast';

export const errorToast = () => {
  toast({
    title: 'Error',
    variant: 'default',
    description: 'something went wrong',
    className: 'bg-green-500 text-xl text-white',
  });
};
