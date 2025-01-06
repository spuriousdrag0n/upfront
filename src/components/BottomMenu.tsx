import { NavLink } from 'react-router';

import { CiUser } from 'react-icons/ci';
import { VscPulse } from 'react-icons/vsc';
import { BiSolidHomeSmile } from 'react-icons/bi';
import { PiChartPieSliceThin } from 'react-icons/pi';

const LINKS = [
  { path: '/', name: 'Home', Icon: BiSolidHomeSmile },
  { path: 'market', name: 'Market', Icon: VscPulse },
  { path: 'portfolio', name: 'Portfolio', Icon: PiChartPieSliceThin },
  { path: 'profile', name: 'Profile', Icon: CiUser },
];

const BottomMenu = () => {
  return (
    <footer className="flex w-full fixed left-0 bottom-0 justify-between px-[10%] py-5 bg-gray-100 rounded-lg">
      {LINKS.map(({ name, path, Icon }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-500 font-bold flex flex-col items-center'
              : 'flex flex-col items-center'
          }
        >
          <Icon size={25} />
          <span>{name}</span>
        </NavLink>
      ))}
    </footer>
  );
};

export default BottomMenu;
