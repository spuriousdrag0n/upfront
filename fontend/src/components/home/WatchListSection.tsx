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

import { FaBitcoin } from 'react-icons/fa6';

const WatchList = () => {
  return (
    <section className="w-[90%] mx-auto mt-5 mb-10">
      <h1 className="text-2xl font-bold">Watchlist</h1>

      <ul className="flex justify-between gap-6 mt-4">
        {DUMMY_DATA.map((i) => (
          <li
            key={i}
            className="bg-[#F8F9FD] p-2 rounded-lg text-center flex-1"
          >
            <span className="text-center text-[#94A3B8]">{i}</span>
          </li>
        ))}
      </ul>

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

            <div>
              <p className="text-lg font-semibold">$19,07500</p>
              <p className="text-[#1DCE5C]">0.35%</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WatchList;
