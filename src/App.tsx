import { createBrowserRouter, RouterProvider } from 'react-router';

import './App.css';
// import NormalApp from './components/NormalApp';
// import WalletConnect from './components/WalletConnect';

import Home from './pages/Home';
import Root from './pages/Root';
import Profile from './pages/Profile';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        { index: true, element: <Home /> },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: 'market',
          element: <Market />,
        },
        {
          path: 'portfolio',
          element: <Portfolio />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;

  // return (
  //   <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
  //     {/* <NormalApp /> */}

  //     <WalletConnect />
  //   </div>
  // );
}

export default App;
