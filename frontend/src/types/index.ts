export type File = {
  id: string;
  price: string;
  fileId: string;
  isPublic: boolean;
  ipfsHash: string;
  createdAt: number;
  userAddress: string;
  contractHash: string;
};

export type FurchasedFile = {
  date: string;
  fileId: string;
  price: string;
  ipfsHash: string;
  fileOwner: string;
};
