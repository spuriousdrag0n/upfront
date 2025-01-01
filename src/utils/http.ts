import axios from 'axios';
import { File } from '../types';

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

type CreateFile = {
  fileId: string;
  price: string;
  address: string;
  ipfsHash: string;
  isPublic: boolean;
  contractHash: string;
};

export const createFile = async ({
  address,
  ipfsHash,
  contractHash,
  fileId,
  isPublic,
  price,
}: CreateFile) => {
  const { data } = await axios.post('create-file', {
    fileId,
    price,
    isPublic,
    address,
    ipfsHash,
    contractHash,
  });

  return data;
};

export const getFiles = async ({ address }: { address: string }) => {
  const { data } = await axios.get(`get-files/${address}`);

  return data;
};

export const getAllFiles = async () => {
  const { data } = await axios.get('get-all-files');
  return data as { data: File[] };
};

type Point = {
  address: string;
  points: string;
};

export const addPoints = async ({ address, points }: Point) => {
  const { data } = await axios.post('add-points', { address, points });

  return data;
};

export const getPoints = async ({ address }: { address: string }) => {
  const { data } = await axios.get(`get-points/${address}`);

  return data;
};

type BuyFile = {
  fileId: string;
  price: string;
  date: string;
  address: string;
  ipfsHash: string;
};

export const buyFile = async ({ address, date, fileId, price }: BuyFile) => {
  const { data } = await axios.post('buy-file', {
    address,
    date,
    price,
    fileId,
  });

  return data;
};

export const getBuiedFiles = async ({ address }) => {
  const { data } = await axios.get(`buy-file/${address}`);

  return data;
};
