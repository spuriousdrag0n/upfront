import { FaUser } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { LoginButton } from '@telegram-auth/react';
import { useAppKitAccount } from '@reown/appkit/react';

import { getBuiedFiles } from '../utils/http';

const Portfolio = () => {
  const { address } = useAppKitAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['get-buied-files'],
    queryFn: () => getBuiedFiles({ address }),
    enabled: !!address,
  });

  return (
    <div className="h-screen">
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

      <section className="w-[90%] mx-auto mt-10 mb-10">
        <h3 className="text-lg font-bold mb-2">Files you purchased</h3>

        {isLoading && <p>Loading ...</p>}

        {data && (
          <ul className="space-y-8">
            {data.files.map(({ fileId, price, date }) => (
              <>
                <li className="border border-gray-300 rounded-2xl p-5 shadow-md transition duration-300 hover:shadow-indigo-200 hover:shadow-lg">
                  <p>File Id: {fileId}</p>
                  <p>purchased at: {date}</p>
                  <p>Price: {price}</p>
                </li>
              </>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
