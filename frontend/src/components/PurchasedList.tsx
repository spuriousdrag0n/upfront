import { FurchasedFile } from '@/types';
import PurchasedItem from './PurchasedItem';

type Props = {
  files: FurchasedFile[];
};
const PurchasedList = ({ files }: Props) => {
  return (
    <ul className="space-y-8">
      {files.map((file) => (
        <PurchasedItem key={file.ipfsHash} {...file} />
      ))}
    </ul>
  );
};

export default PurchasedList;
