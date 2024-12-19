import { useEffect, useState } from 'react';

import CryptoJS from 'crypto-js';
import { useMutation } from '@tanstack/react-query';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react';
import { arbitrum, mainnet, unichainSepolia } from '@reown/appkit/networks';

import { ethers } from 'ethers';
import { ABI } from '../constants/ABI';
import { pinata } from '../utils/config';
import { createFile } from '../utils/http';
import DragAndDrop from '../components/DragAndDrop';

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
      isPublic
    );

    console.log(tx);

    mutate({
      address: address!,
      ipfsHash,
      contractHash: tx.hash,
      fileId: fileId.toString(),
      isPublic,
      price,
    });
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
    <div className="flex justify-center items-center h-[90%]">
      <div>
        {!isConnected && (
          <button
            onClick={handleConnect}
            className="bg-indigo-600 p-3 rounded-2xl text-white"
          >
            Connect with wallet
          </button>
        )}

        <DragAndDrop file={file} onChange={setFile} />

        <div className="flex justify-center items-center gap-4">
          <input
            min="0"
            step="1"
            type="number"
            placeholder="Enter a price"
            onChange={(e) => setPrice(e.currentTarget.value)}
            className="border border-indigo-500 my-5  block rounded-lg px-3 py-1"
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
          className="bg-indigo-600 p-3 rounded-2xl text-white mx-auto block"
        >
          Create File
        </button>

        {isConnected && address && <p>{address}</p>}
      </div>
    </div>
  );
};

export default Profile;
