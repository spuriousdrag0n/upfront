import { Outlet } from 'react-router';

import BottomMenu from '../components/BottomMenu';

const Root = () => {
  return (
    <main className="min-h-screen">
      <div className="pb-28">
        <Outlet />
      </div>

      <BottomMenu />
    </main>
  );
};

export default Root;
