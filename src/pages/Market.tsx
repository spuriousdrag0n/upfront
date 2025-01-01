const DUMMY_DATA = ['Crypto Assets', 'US stocks', 'Gold', 'NFTs'];
const DUMMY_CARD_DATA = [
  {
    title: 'Bitcoin',
    subTitle: 'BTC',
  },
  {
    title: 'Cardano',
    subTitle: 'ADA',
  },
  {
    title: 'Polygon',
    subTitle: 'Matic',
  },
];

// import 'swiper/css';

import { FiCpu } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { LuBlocks } from 'react-icons/lu';
import { IoCubeOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
// import { Swiper, SwiperSlide } from 'swiper/react';
import { FaBitcoin, FaSackDollar } from 'react-icons/fa6';

import Item from '../components/Item';
import { getAllFiles } from '../utils/http';

const SECTORS_DATA = [
  {
    name: 'Finance',
    Icon: FaSackDollar,
  },
  {
    Icon: FiCpu,
    name: 'Technology',
  },
  {
    Icon: LuBlocks,
    name: 'Industry',
  },
  {
    Icon: IoCubeOutline,
    name: 'Utilities',
  },
];

const Market = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-all-files'],
    queryFn: getAllFiles,
  });

  return (
    <div className="pt-10">
      <div className="bg-[#F8F9FD] mx-7 p-3 rounded-lg flex gap-4 items-center">
        <FaSearch />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent flex-1 border-none outline-none"
        />
      </div>

      <ul className="flex justify-between gap-6 mt-4 mx-4">
        {DUMMY_DATA.map((i) => (
          <li
            key={i}
            className="bg-[#F8F9FD] p-2 rounded-lg text-center flex-1"
          >
            <span className="text-center text-[#94A3B8]">{i}</span>
          </li>
        ))}
      </ul>

      <section className="mt-5 w-[90%] mx-auto">
        <h3 className="text-2xl font-bold mb-5">Stock Futures</h3>

        {isLoading && <p>Loading...</p>}

        {data?.data && (
          <ul className="space-y-5">
            {data.data.map((file) => (
              <Item key={file.id} {...file} />
            ))}
          </ul>
        )}

        {/* <Swiper
          slidesPerView={1}
          spaceBetween={50}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {Array.from({ length: 4 }, (_, i) => i).map((i) => (
            <SwiperSlide
              key={i}
              className="border border-gray-300 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <FaBitcoin size={30} color="gold" />

                  <p className="flex flex-col gap-1">
                    <span className="font-semibold">Crypto</span>
                    <span className="text-[#64748B]">10 Assets</span>
                  </p>
                </div>

                <div>
                  <p className="font-semibold">$20.300</p>
                  <p className="text-[#1DCE5C]">0.24%</p>
                </div>
              </div>

              <hr className="border border-gray-100 my-5" />

              <div className="flex justify-between">
                <div>
                  <p className="text-[#64748B]">Profits</p>
                  <p className="font-bold text-xl">$16,988</p>
                </div>

                <button className="bg-indigo-700 text-white rounded-xl px-7">
                  Buy
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper> */}
      </section>

      <section className="w-[90%] mx-auto mt-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-lg">Sectors</h1>
          <span className="text-indigo-600">See all</span>
        </div>

        <ul className="flex items-center justify-between">
          {SECTORS_DATA.map(({ Icon, name }) => (
            <li key={name}>
              <p className="size-12 rounded-full border border-gray-300 flex justify-center items-center">
                <Icon size={22} color="#6B39F4" />
              </p>

              <span>{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="w-[90%] mx-auto mt-5 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-lg">All Stocks</h1>
          <span className="text-indigo-600">Sort</span>
        </div>

        <ul className="space-y-4 mt-6">
          {DUMMY_CARD_DATA.map(({ subTitle, title }) => (
            <li
              key={title}
              className="flex justify-between p-4 border border-gray-300 rounded-xl"
            >
              <div className="flex gap-3 items-center">
                <FaBitcoin size={30} color="gold" />

                <p className="flex flex-col">
                  <span className="text-lg font-semibold">{title}</span>
                  <span className="text-gray-400">{subTitle}</span>
                </p>
              </div>

              <div className="">
                <p className="text-lg font-semibold">$19,07500</p>
                <p className="text-[#1DCE5C]">0.35%</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Market;
