import { CiSearch } from 'react-icons/ci';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';

import WatchList from '../components/home/WatchListSection';
import MyPortfolioSection from '../components/home/MyPortfolioSection';

const DUMMY_DATA = ['Stocks', 'Crypto', 'Gold', 'NFTs'];

const Home = () => {
  return (
    <div>
      <header className="flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">Upfront</h1>

        <p className="flex gap-2 items-center">
          <CiSearch size={25} color="#94A3B8" />
          <IoMdNotificationsOutline size={25} color="#94A3B8" />
        </p>
      </header>

      <section className="bg-[#061237] w-full h-[160px] p-6 *:text-white">
        <h1 className="text-3xl">Total assets value</h1>

        <div className="flex justify-between">
          <h2 className="text-xl">$56,555</h2>

          <div className="bg-[#1DCE5C] rounded-lg space-x-3 p-2 flex">
            <FaRegArrowAltCircleUp size={25} />
            <span>23.00%</span>
          </div>
        </div>

        <ul className="flex justify-between p-6 bg-white *:text-[#64748B] mx-auto mt-5 rounded-2xl shadow-md">
          {DUMMY_DATA.map((i) => (
            <li key={i}>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </section>

      <MyPortfolioSection />
      <WatchList />
    </div>
  );
};

export default Home;
