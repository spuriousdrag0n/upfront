import { useState } from 'react';

import { formatUnits, ethers } from 'ethers';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react';

import DragAndDrop from './DragAndDrop';

const projectId = '218f573f7987430400eac25d58a0ca68';

// 3. Create a metadata object - optional
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

interface TokenAsset {
  symbol: string;
  balance: string;
  address: string;
}

const WalletConnect = () => {
  const { address, isConnected } = useAppKitAccount();

  const [file, setFile] = useState<File | null>(null);

  const [assets, setAssets] = useState<TokenAsset[]>([]);
  const [balance, setBalance] = useState<string | null>(null);

  const getBalance = async () => {
    if (!isConnected) {
      console.log('No connection');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);

    setBalance(formatUnits(balance, 18));
  };

  const handleConnect = async () => {
    await appKit.open({ view: 'Connect' });
  };

  const getAssets = async () => {
    if (!isConnected || !address) {
      console.log('No connection or address');
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);

    const tokenAddresses = [
      address,
      // '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC
      // '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
      // '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', // WBTC
    ];

    try {
      const tokenPromises = tokenAddresses.map(async (tokenAddress) => {
        const tokenContract = new ethers.Contract(
          tokenAddress,
          [
            'function balanceOf(address) view returns (uint256)',
            'function symbol() view returns (string)',
          ],
          provider
        );

        const [balance, symbol] = await Promise.all([
          tokenContract.balanceOf(address),
          tokenContract.symbol(),
        ]);

        return {
          symbol,
          balance: formatUnits(balance, 18), // Note: You might need to adjust decimals per token
          address: tokenAddress,
        };
      });

      const tokenAssets = await Promise.all(tokenPromises);
      console.log(tokenAssets);

      // setAssets(tokenAssets);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Unlocket App</h1>

      {isConnected && address && <p className="my-2">{address}</p>}
      {balance && <p className="my-2">{balance}</p>}

      {!isConnected && (
        <button
          onClick={handleConnect}
          className="bg-teal-500 text-white p-3 rounded-2xl"
        >
          Connect With Wallet
        </button>
      )}

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <DragAndDrop file={file} onChange={setFile} />

        <div className="h-[2px] w-[80%] mx-auto  bg-gray-300 my-5" />

        <div className="space-y-2">
          <span>Set a price</span>

          <input
            type="text"
            // value={price ?? ''}
            placeholder="0.00"
            // onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* {!address ? (
        <button
          onClick={handleConnect}
          className="bg-indigo-500 text-white p-3 rounded-md"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance} ETH</p>
          <h3>Assets:</h3>

          <ul>
            {assets.map((asset, index) => (
              <li key={index}>{asset}</li>
            ))}
          </ul>
        </div>
      )} */}

      <button
        onClick={getBalance}
        className="bg-teal-500 p-3 text-white rounded-3xl my-5 w-60 hover:bg-teal-600 transition"
      >
        Generate Link
      </button>

      {/* <button
        onClick={getBalance}
        className="bg-teal-500 p-3 text-white rounded-md my-5"
      >
        Get User Balance
      </button>

      <button
        onClick={getAssets}
        className="bg-teal-500 p-3 text-white rounded-md my-5 ml-5"
      >
        Get Assets Inside Wallet
      </button> */}
    </div>
  );
};

export default WalletConnect;
