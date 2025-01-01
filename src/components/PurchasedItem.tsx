import { useEffect, useState } from 'react';

import { decryptImage } from '../utils/decryptImage';

type Props = { fileId: string; date: string; price: string; ipfsHash: string };

const PurchasedItem = ({ fileId, date, price, ipfsHash }: Props) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (ipfsHash) {
      decryptImage(ipfsHash).then((url) => {
        setImage(url!);
      });
    }
  }, [ipfsHash]);

  return (
    <li className="border border-gray-300 rounded-2xl p-5 shadow-md transition duration-300 hover:shadow-indigo-200 hover:shadow-lg">
      {!image && <div className="p-3 bg-gray-300 mb-5 animate-pulse" />}
      {image && <img src={image} className="w-full h-28 rounded-md mb-5" />}

      <p>File Id: {fileId}</p>
      <p>purchased at: {date}</p>
      <p>Price: {price}</p>
    </li>
  );
};

export default PurchasedItem;
