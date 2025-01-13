import axios from 'axios';
import { File, FurchasedFile } from '../types';

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

export const getAllFiles = async ({ address }: { address: string }) => {
  const { data } = await axios.get('get-all-files', { params: { address } });
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
  fileOwner: string;
};

export const buyFile = async ({
  address,
  date,
  fileId,
  price,
  ipfsHash,
  fileOwner,
}: BuyFile) => {
  const { data } = await axios.post('buy-file', {
    address,
    date,
    price,
    fileId,
    ipfsHash,
    fileOwner,
  });

  return data;
};

export const getBuiedFiles = async ({ address }: { address: string }) => {
  const { data } = await axios.get(`buy-file/${address}`);

  return data as { files: FurchasedFile[] };
};

export const getVerifiedWithTelegram = async ({
  address,
}: {
  address: string;
}) => {
  const { data } = await axios.get('is-user-verified-with-telegram', {
    params: { address },
  });

  return data as { address: string; success: boolean; isverified: boolean };
};

export const verifiedWithTelegram = async ({
  address,
  userId,
}: {
  address: string;
  userId: number;
}) => {
  const { data } = await axios.post('is-user-verified-with-telegram', {
    address,
    userId,
  });

  return data as { address: string; success: boolean; message: string };
};

export const addRating = async ({
  address,
  rating,
  ratedBy,
}: {
  address: string;
  rating: number;
  ratedBy: string;
}) => {
  const { data } = await axios.post('rate', { address, rating, ratedBy });
  return data;
};

export const getRating = async ({ address }: { address: string }) => {
  const { data } = await axios.get(`rate/${address}`);
  return data;
};

type Report = {
  message: string;
  repoter: string;
  address: string;
};

export const addReport = async (report: Report) => {
  const { data } = await axios.post('report', { ...report });
  return data;
};
