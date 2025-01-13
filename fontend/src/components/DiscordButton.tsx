import { useUser } from '@clerk/clerk-react';
import { FaDiscord } from 'react-icons/fa6';

const DiscordButton = () => {
  const { isSignedIn, isLoaded, user } = useUser();

  console.log('Is Signed In : ', isSignedIn);
  console.log('Is Loaded : ', isLoaded);
  console.log('User : ', user);

  return (
    <div className="mt-5 bg-[#8338ec] text-xl py-2 rounded-full font-bold flex justify-center items-center gap-5 px-5">
      <FaDiscord size={30} />
      <span>Login With Discord</span>
    </div>
  );
};

export default DiscordButton;
