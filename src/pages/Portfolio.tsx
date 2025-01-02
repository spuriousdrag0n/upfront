import { FaUser } from 'react-icons/fa6';
import { LoginButton } from '@telegram-auth/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addPoints,
  getBuiedFiles,
  verifiedWithTelegram,
  getVerifiedWithTelegram,
} from '../utils/http';
import PurchasedItem from '../components/PurchasedItem';

const Portfolio = () => {
  let content;
  const { address } = useAppKitAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['get-buied-files', { address }],
    queryFn: () => getBuiedFiles({ address }),
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
      content = 'Thanks you will get 500 points';
    },
  });

  return (
    <>
      <section className="bg-[#6B39F4] h-[284px] flex justify-center items-center *:text-white">
        <div className="text-center">
          <div className="size-14 border border-gray-300 mx-auto rounded-full mb-4 flex justify-center items-center">
            <FaUser size={35} />
          </div>

          <h1>USER NAME</h1>
          <p>email@gmail.com</p>

          {isVerfiedWithTele && <p>Loading...</p>}

          {verfiedWithTele && !verfiedWithTele.isverified && (
            <div className="flex flex-col justify-center items-center gap-5">
              <p>Verified Your account with telegram to get 1000 point</p>

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

        {isLoading && <p>Loading ...</p>}

        {data && (
          <ul className="space-y-8">
            {data.files.map((file) => (
              <PurchasedItem key={file.ipfsHash} {...file} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default Portfolio;
