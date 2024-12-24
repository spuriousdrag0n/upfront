import { useEffect, useState } from 'react';

import CryptoJS from 'crypto-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react';
import { arbitrum, mainnet, unichainSepolia } from '@reown/appkit/networks';

import { ethers } from 'ethers';
import { ABI } from '../constants/ABI';
import { pinata } from '../utils/config';
import { addPoints, createFile, getPoints } from '../utils/http';
import DragAndDrop from '../components/DragAndDrop';
import { queryClient } from '../main';

const projectId = '218f573f7987430400eac25d58a0ca68';

const metadata = {
  name: 'my-project',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, arbitrum, unichainSepolia],
  metadata,
  projectId,
  features: { analytics: true },
});

const CONTRACT_ADDRESS = '0x9e76aab5e4d17Ee17426954f8aFF11Bb569a64C2';

const UNICHAIN_TESTNET_PARAMS = {
  // chainId: '0x1B', // 27 in hexadecimal
  chainId: '0x515', // 27 in hexadecimal
  chainName: 'UNI Smart Chain Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.unichain.org/'],
  blockExplorerUrls: ['https://sepolia.uniscan.xyz/'],

  iconUrls: [], // Add network logo URLs if available
  networkId: '0x515', // Should match chainId
};

const Profile = () => {
  const [price, setPrice] = useState('0');
  const [isPublic, setIsPublic] = useState(false);
  const { address, isConnected } = useAppKitAccount();
  const [file, setFile] = useState<File | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const { mutate } = useMutation({
    mutationKey: ['create-file'],
    mutationFn: createFile,
    onError(error) {
      console.log('ERROR : ', error);
    },

    onSuccess(data) {
      console.log('SUCCESS');
      console.log(data);
    },
  });

  const { mutate: addPointsMutation } = useMutation({
    mutationKey: ['add-points'],
    mutationFn: addPoints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-points', { address }] });
    },
  });

  const { data } = useQuery({
    queryKey: ['get-points', { address }],
    queryFn: () => getPoints({ address: address! }),
    enabled: !!address,
  });

  const handleConnect = async () => {
    await appKit.open({ view: 'Connect' });
  };

  const encryptImage = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const encrypted = CryptoJS.AES.encrypt(
          reader.result as string,
          'secret-key'
        ).toString();

        resolve(encrypted);
      };

      reader.readAsDataURL(file);
    });
  };

  async function switchToUnichainTestnet() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: UNICHAIN_TESTNET_PARAMS.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [UNICHAIN_TESTNET_PARAMS],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching network:', switchError);
        throw switchError;
      }
    }
  }

  const uploadHandler = async (encryptedFile: string) => {
    const encryptedBlob = new Blob([encryptedFile], { type: 'text/plain' });

    const encryptedFileObj = new File(
      [encryptedBlob],
      `encrypted-${file!.name}`,
      { type: 'text/plain' }
    );

    const { IpfsHash } = await pinata.upload.file(encryptedFileObj);
    return IpfsHash;
  };

  const createFileHandler = async () => {
    if (!file || !contract) return;

    const encryptedFile = await encryptImage(file);
    const ipfsHash = await uploadHandler(encryptedFile as string);
    console.log('IPFS HASH : ', ipfsHash);
    const fileId = BigInt(Date.now());
    console.log('FILE ID : ', fileId);
    console.log('PRICE : ', ethers.parseEther(price));

    const tx = await contract.createFile(
      fileId,
      ethers.parseEther(price),
      false // CHECK LATER
    );

    console.log(tx);

    mutate({
      price,
      ipfsHash,
      isPublic,
      address: address!,
      contractHash: tx.hash,
      fileId: fileId.toString(),
    });

    addPointsMutation({ address: address!, points: '50' });
  };

  useEffect(() => {
    const connectContract = async () => {
      if (!isConnected) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await switchToUnichainTestnet();

      const { name } = await provider.getNetwork();
      console.log('NETWORK NAME : ', name);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contract);
    };

    connectContract();
  }, [isConnected]);

  return (
    <div className="flex justify-center h-[88%]">
      <div className=" pt-9">
        <h1 className="text-center text-2xl font-bold mb-14">Up front</h1>

        {!isConnected && (
          <button
            onClick={handleConnect}
            className="bg-indigo-600 p-3 rounded-2xl text-white"
          >
            Connect with wallet
          </button>
        )}

        <DragAndDrop file={file} onChange={setFile} />
        <p className="text-center text-xl font-bold mt-3">Add media</p>
        <p className="text-center  text-gray-600">Of any kind</p>

        <hr className="h-[2px] w-full mt-8 mb-10" />

        <div className="flex justify-center items-center gap-4 bg-gray-100 p-2 rounded-xl border border-indigo-400">
          <input
            min="0"
            // step="1"
            type="number"
            placeholder="Enter a price"
            className="outline-none rounded-lg px-3 py-1"
            onChange={(e) => setPrice(e.currentTarget.value)}
          />

          <label htmlFor="input">is Public</label>
          <input
            id="input"
            type="checkbox"
            onChange={(e) => setIsPublic(e.currentTarget.checked)}
          />
        </div>

        <button
          onClick={createFileHandler}
          className="bg-indigo-600 p-3 w-full rounded-2xl text-white my-12"
        >
          Create File
        </button>

        {isConnected && address && <p>{address}</p>}
        {data && <p> Your Points : {data.points}</p>}
      </div>
    </div>
  );
};

export default Profile;
