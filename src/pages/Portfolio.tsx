import { FaBitcoin } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { useAppKitAccount } from '@reown/appkit/react';

import { useToast } from '@/hooks/use-toast';
import SkeletonList from '@/components/SkeletonList';
import PurchasedList from '@/components/PurchasedList';
import TelegramLogin from '@/components/TelegramLogin';
import { getRating, getBuiedFiles } from '../utils/http';

const Portfolio = () => {
  const { toast } = useToast();
  const { address } = useAppKitAccount();

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-buied-files', { address }],
    queryFn: () => getBuiedFiles({ address }),
    enabled: !!address,
  });

  if (error) {
    toast({
      title: 'Error',
      variant: 'destructive',
      description: 'Connot fetch data',
    });
  }

  console.log(data);

  const { data: ratingData } = useQuery({
    queryKey: ['get-rating'],
    queryFn: () => getRating({ address }),
    enabled: !!address,
  });

  return (
    <>
      <section className="bg-primary h-[284px] flex justify-center items-center *:text-white">
        <TelegramLogin />
      </section>

      <section className="w-[90%] mx-auto mt-10 mb-5">
        <h3 className="text-lg font-bold mb-2">Files you purchased</h3>

        {isLoading && <SkeletonList />}

        {data && <PurchasedList files={data.files} />}
      </section>
    </>
  );
};

export default Portfolio;
