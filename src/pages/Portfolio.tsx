import { FaUser } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { LoginButton } from '@telegram-auth/react';
import { useAppKitAccount } from '@reown/appkit/react';

import { getBuiedFiles } from '../utils/http';
import PurchasedItem from '../components/purchasedItem';

const Portfolio = () => {
  const { address } = useAppKitAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['get-buied-files', { address }],
    queryFn: () => getBuiedFiles({ address }),
    enabled: !!address,
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

          <LoginButton
            lang="en"
            cornerRadius={5}
            showAvatar={true}
            buttonSize="large"
            botUsername={import.meta.env.VITE_BOT_USER_NAME}
            onAuthCallback={(data) => {
              console.log(data);
            }}
          />
        </div>
      </section>

      <section className="w-[90%] mx-auto mt-10 mb-5">
        <h3 className="text-lg font-bold mb-2">Files you purchased</h3>

        {isLoading && <p>Loading ...</p>}

        {data && (
          <ul className="space-y-8">
            {data.files.map((file) => (
              <PurchasedItem {...file} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default Portfolio;
