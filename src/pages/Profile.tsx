import { useEffect, useState } from 'react';

import { arbitrum, mainnet } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react';

import { ethers } from 'ethers';
import { ABI } from '../constants/ABI';
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
  networks: [mainnet, arbitrum],
  metadata,
  projectId,
  features: { analytics: true },
});

const CONTRACT_ADDRESS = '0x9e76aab5e4d17Ee17426954f8aFF11Bb569a64C2';

const Profile = () => {
  const { address, isConnected } = useAppKitAccount();
  const [file, setFile] = useState<File | null>(null);

  const handleConnect = async () => {
    await appKit.open({ view: 'Connect' });
  };

  useEffect(() => {
    const connectContract = async () => {
      if (!isConnected) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      console.log(contract.target);
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

        <button
          // onClick={}
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
