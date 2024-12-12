import { Outlet } from 'react-router';

import BottomMenu from '../components/BottomMenu';

const Root = () => {
  return (
    <main className="h-screen">
      <Outlet />

      <BottomMenu />
    </main>
  );
};

export default Root;
