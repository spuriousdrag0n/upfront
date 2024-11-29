import './App.css';
// import NormalApp from './components/NormalApp';
import WalletConnect from './components/WalletConnect';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* <NormalApp /> */}

      <WalletConnect />
    </div>
  );
}

export default App;
