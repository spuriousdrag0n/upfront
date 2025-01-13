import { toast } from '@/hooks/use-toast';

export const successToast = (message: string) => {
  toast({
    title: 'Success',
    variant: 'default',
    description: message,
    className: 'bg-green-500 text-xl text-white',
  });
};
