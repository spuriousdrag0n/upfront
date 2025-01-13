import { LoginButton } from '@telegram-auth/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addPoints,
  getVerifiedWithTelegram,
  verifiedWithTelegram,
} from '@/utils/http';

const TelegramLogin = () => {
  let content;

  const { address } = useAppKitAccount();

  const { data: verfiedWithTele, isLoading: isVerfiedWithTele } = useQuery({
    queryKey: ['isVerfiedWithTele', { address }],
    queryFn: () => getVerifiedWithTelegram({ address: address! }),
    enabled: !!address,
  });

  const { mutate: addPointsMutation } = useMutation({
    mutationFn: addPoints,
    onSuccess: () => {
      content = 'Thanks, you will get 500 points';
    },
  });

  const { mutate } = useMutation({
    mutationFn: verifiedWithTelegram,
    onSuccess: ({ success, message }) => {
      if (success) {
        addPointsMutation({ address: address!, points: '500' });
      } else content = message;
    },
  });

  return (
    <div className="text-center">
      {isVerfiedWithTele && <p>Loading...</p>}

      {verfiedWithTele && !verfiedWithTele.isverified && (
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-xl px-6">
            Verified Your account with telegram to get 500 point
          </p>

          <LoginButton
            lang="en"
            cornerRadius={5}
            showAvatar={true}
            buttonSize="large"
            botUsername={import.meta.env.VITE_BOT_USER_NAME}
            onAuthCallback={({ id }) => {
              if (id) mutate({ address: address!, userId: id });
            }}
          />

          {content}
        </div>
      )}
    </div>
  );
};

export default TelegramLogin;
