import PurchasedItem from './PurchasedItem';

type Props = {
  files: {
    date: string;
    fileId: string;
    price: string;
    ipfsHash: string;
    fileOwner: string;
  }[];
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
