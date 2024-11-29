import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

export const saveUserData = async ({
  address,
  image,
}: {
  address: string;
  image: string;
}) => {
  const { data } = await axios.post('add-user', { address, image });

  return data;
};

export const getUserData = async (address: string) => {
  const { data } = await axios.get(`get-user/${address}`);

  return data;
};
