import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import { FaBitcoin } from 'react-icons/fa6';

const MyPortfolioSection = () => {
  return (
    <section className="mt-20 w-[90%] mx-auto">
      <h3 className="text-2xl font-bold mb-5">My Portofilo</h3>

      <Swiper
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
                <FaBitcoin size={25} color="gold" />

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
              <div className="">
                <p className="text-[#64748B]">Profits</p>
                <p className="font-bold text-xl">$16,988</p>
              </div>

              <button className="bg-indigo-700 text-white rounded-xl px-7">
                Buy
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default MyPortfolioSection;
