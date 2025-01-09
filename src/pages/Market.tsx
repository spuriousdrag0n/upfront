import { FaSearch } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useAppKitAccount } from '@reown/appkit/react';

import Item from '../components/Item';
import { getAllFiles } from '../utils/http';

const Market = () => {
  const { address } = useAppKitAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['get-all-files', { address }],
    queryFn: () => getAllFiles({ address: address! }),
    enabled: !!address,
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

      <section className="mt-5 w-[90%] mx-auto">
        <h3 className="text-2xl font-bold mb-5">
          Files available for purchase
        </h3>

        {isLoading && <p>Loading...</p>}

        {data?.data && (
          <ul className="space-y-5">
            {data.data.map((file) => (
              <Item key={file.createdAt} {...file} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Market;
