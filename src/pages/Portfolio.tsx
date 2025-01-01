import { FaUser } from 'react-icons/fa6';

import { CiUser } from 'react-icons/ci';
import { TbNotes } from 'react-icons/tb';
import { PiUserListDuotone } from 'react-icons/pi';
import { IoIosArrowForward } from 'react-icons/io';
import { useQuery } from '@tanstack/react-query';
import { getBuiedFiles } from '../utils/http';
import { useAppKitAccount } from '@reown/appkit/react';

const DATA = [
  {
    title: 'Personal Details',
    subTitle: 'Your account information',
    Icon: CiUser,
  },
  {
    title: 'Identify Verification',
    subTitle: 'Your verification status',
    Icon: PiUserListDuotone,
  },
  {
    title: 'Transaction History',
    subTitle: 'Your transaction details',
    Icon: TbNotes,
  },
];

const Portfolio = () => {
  const { address } = useAppKitAccount();

  const { data } = useQuery({
    queryKey: ['get-buied-files'],
    queryFn: () => getBuiedFiles({ address }),
    enabled: !!address,
  });

  if (data) {
    console.log(data);
  }

  return (
    <div>
      <section className="bg-[#6B39F4] h-[284px] flex justify-center items-center *:text-white">
        <div className="text-center">
          <div className="size-14 border border-gray-300 mx-auto rounded-full mb-4 flex justify-center items-center">
            <FaUser size={35} />
          </div>

          <h1>USER NAME</h1>
          <p>email@gmail.com</p>
        </div>
      </section>

      <section className="w-[90%] mx-auto border border-gray-300 p-4 mt-10 rounded-xl">
        <p>Invite your friends and win free asset up to $100</p>
      </section>

      <section className="w-[90%] mx-auto mt-10 mb-10">
        <h3 className="text-lg font-bold mb-2">Account Details</h3>

        <ul className="space-y-8">
          {DATA.map(({ subTitle, title, Icon }) => {
            return (
              <li
                key={title}
                className="border border-gray-300 rounded-xl flex justify-between items-center p-4"
              >
                <div className="flex gap-4 items-center">
                  <Icon size={30} color="#64748B" />

                  <div className="flex flex-col">
                    <p className="font-bold">{title}</p>
                    <p className="text-[#64748B]">{subTitle}</p>
                  </div>
                </div>
                <IoIosArrowForward color="#64748B" size={25} />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Portfolio;
