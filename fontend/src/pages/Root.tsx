import { Outlet } from 'react-router';

import { Toaster } from '@/components/ui/toaster';
import BottomMenu from '../components/BottomMenu';

const Root = () => {
  return (
    <main className="min-h-screen">
      <div className="pb-28">
        <Outlet />
      </div>
      <Toaster />
      <BottomMenu />
    </main>
  );
};

export default Root;
