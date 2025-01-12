import { LoginButton } from '@telegram-auth/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addPoints,
  getRating,
  getBuiedFiles,
  verifiedWithTelegram,
  getVerifiedWithTelegram,
} from '../utils/http';
import { useToast } from '@/hooks/use-toast';
import SkeletonCard from '@/components/SkeletonCard';
import PurchasedItem from '../components/PurchasedItem';

const Portfolio = () => {
  let list;
  let content;

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

  if (isLoading) {
    list = (
      <ul className="flex flex-col justify-center items-center gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i}>
            <SkeletonCard />
          </li>
        ))}
      </ul>
    );
  }

  if (data) {
    list = (
      <ul className="space-y-8">
        {data.files.map((file) => (
          <PurchasedItem key={file.ipfsHash} {...file} />
        ))}
      </ul>
    );
  }

  console.log(data);

  const { data: ratingData } = useQuery({
    queryKey: ['get-rating'],
    queryFn: () => getRating({ address }),
    enabled: !!address,
  });

  const { data: verfiedWithTele, isLoading: isVerfiedWithTele } = useQuery({
    queryKey: ['isVerfiedWithTele', { address }],
    queryFn: () => getVerifiedWithTelegram({ address: address! }),
    enabled: !!address,
  });

  const { mutate } = useMutation({
    mutationFn: verifiedWithTelegram,
    onSuccess: ({ success, message }) => {
      if (success) {
        addPointsMutation({ address: address!, points: '500' });
      } else content = message;
    },
  });

  const { mutate: addPointsMutation } = useMutation({
    mutationFn: addPoints,
    onSuccess: () => {
      content = 'Thanks, you will get 500 points';
    },
  });

  return (
    <>
      <section className="bg-[#6B39F4] h-[284px] flex justify-center items-center *:text-white">
        <div className="text-center">
          {isVerfiedWithTele && <p>Loading...</p>}

          {verfiedWithTele && !verfiedWithTele.isverified && (
            <div className="flex flex-col justify-center items-center gap-5">
              <p>Verified Your account with telegram to get 500 point</p>

              <LoginButton
                lang="en"
                cornerRadius={5}
                showAvatar={true}
                buttonSize="large"
                botUsername={import.meta.env.VITE_BOT_USER_NAME}
                onAuthCallback={({ id }) => {
                  if (id) mutate({ address: address!, userId: id });
                }}
              />

              {content}
            </div>
          )}
        </div>
      </section>

      <section className="w-[90%] mx-auto mt-10 mb-5">
        <h3 className="text-lg font-bold mb-2">Files you purchased</h3>

        {list}
      </section>
    </>
  );
};

export default Portfolio;
