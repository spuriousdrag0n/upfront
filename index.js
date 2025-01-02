const redisClient = require('./redisClient'); // Import the Redis client

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('7935566118:AAFaIEmhvSnbo6ijG6P66mHmo9LzFGZShmc', {
  polling: true,
});

const channelId = '@upfrontappChannel';

const { Client, GatewayIntentBits } = require('discord.js');

const BOT_TOKEN =
  'MTMyMTgzNzE2MTI2NzU5MzI2Nw.Gkm_Q3.R-5TyB14md9EBHMSP06eY7Um11sXsWTxocW58c';
const SERVER_ID = '1321532312323620966';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.on('ready', async () => {
  try {
    console.log(`Logged in as ${client.user.id}`);
  } catch (error) {
    console.log('ERROR');
    console.log(error);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  try {
    const guild = await client.guilds.fetch(SERVER_ID);

    const member = await guild.members.fetch(userId);

    if (member) {
      message.reply('Thank you for joining the server!');
    } else {
      message.reply('You are not a member of the server.');
    }
  } catch (error) {
    console.error('Error checking membership:', error);
    message.reply('Could not verify your membership. Please try again later.');
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    console.log(chatMember);

    if (
      chatMember.status === 'member' ||
      chatMember.status === 'administrator' ||
      chatMember.status === 'creator'
    ) {
      bot.sendMessage(chatId, 'Thank you for joining the channel!');
    } else {
      bot.sendMessage(
        chatId,
        `You are not a member of the channel. Please join here: https://t.me/${channelId.slice(
          1
        )}`
      );
    }
  } catch (error) {
    console.log(error);

    bot.sendMessage(chatId, 'You are not a member');
  }
});

app.post('/add-user', async (req, res) => {
  const { address, image } = req.body;

  if (!address || !image) {
    return res.status(401).json({ message: 'Invalid address or image' });
  }

  await redisClient
    .set(`user:${address}`, JSON.stringify({ address, image }))
    .then((val) => {
      console.log(val);

      res.status(200).send({ message: 'Success' });
    });
});

app.get('/get-user/:address', async (req, res) => {
  const { address } = req.params;

  const userData = await redisClient.get(`user:${address}`);

  if (!userData) {
    return res.status(401).send({ messgae: 'USER NOT FOUND' });
  }

  res.status(200).send({ message: 'Success', user: JSON.parse(userData) });
});

app.post('/create-file', async (req, res) => {
  try {
    const { ipfsHash, contractHash, address, fileId, price, isPublic } =
      req.body;

    if (!ipfsHash || !contractHash || !address || !fileId) {
      return res.status(400).json({
        message: 'IPFS hash, fileId, contract-hash, and address are required',
      });
    }

    const ipfsEntryId = `ipfs:${address}:${fileId}`;

    // Store the IPFS entry data
    const ipfsData = {
      fileId,
      ipfsHash,
      contractHash,
      price: price.toString(),
      isPublic: Boolean(isPublic),
      createdAt: Date.now(),
    };

    await redisClient.sAdd(`user:${address}:ipfs`, ipfsEntryId);

    const DATA = { ...ipfsData };

    await redisClient.hSet(ipfsEntryId, 'data', JSON.stringify(DATA));

    res.status(201).json({
      success: true,
      data: {
        id: ipfsEntryId,
        ...ipfsData,
      },
    });
  } catch (error) {
    console.error('Error storing IPFS data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/get-files/:address', async (req, res) => {
  try {
    const { address } = req.params;

    const ipfsEntryIds = await redisClient.sMembers(`user:${address}:ipfs`);

    const ipfsEntries = await Promise.all(
      ipfsEntryIds.map(async (entryId) => {
        const data = await redisClient.hGetAll(entryId);
        return {
          id: entryId,
          ...data,
        };
      })
    );

    res.json({
      success: true,
      data: ipfsEntries,
    });
  } catch (error) {
    console.error('Error fetching IPFS hashes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/get-all-files', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res
      .status(400)
      .json({ success: false, message: 'Address is required' });
  }

  try {
    const userSets = await redisClient.keys('user:*:ipfs');
    let allFiles = [];

    for (const userSet of userSets) {
      const ipfsEntryIds = await redisClient.sMembers(userSet);

      const ipfsEntries = await Promise.all(
        ipfsEntryIds.map(async (entryId) => {
          const data = await redisClient.hGetAll(entryId);

          const DATA = JSON.parse(data.data);
          const userAddress = userSet.split(':')[1];

          return {
            id: entryId,
            userAddress,
            ...DATA,
          };
        })
      );

      allFiles = [...allFiles, ...ipfsEntries];
    }

    const purchasedFilesKey = `user:${address}:files`;
    const purchasedFiles = await redisClient.lRange(purchasedFilesKey, 0, -1);

    const purchasedFileIds = purchasedFiles.map(
      (file) => JSON.parse(file).fileId
    );

    const filteredFiles = allFiles.filter(
      (file) => !purchasedFileIds.includes(file.fileId)
    );

    filteredFiles.sort((a, b) => b.createdAt - a.createdAt);
    res.json({
      success: true,
      total: filteredFiles.length,
      data: filteredFiles,
    });
  } catch (error) {
    console.error('Error fetching all files:', error);

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

app.post('/add-points', async (req, res) => {
  const { address, points } = req.body;

  if (!address || !points) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }

  try {
    const currectPoints = await redisClient.get(address);
    let updatedPoints = +points;

    if (currectPoints) {
      updatedPoints += parseInt(currectPoints, 10);
    }

    await redisClient.set(address, updatedPoints);

    return res.status(200).json({
      message: 'Points updated successfully',
      address,
      points: updatedPoints,
    });
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-points/:address', async (req, res) => {
  const { address } = req.params;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing address' });
  }

  try {
    const points = (await redisClient.get(address)) || 0;

    return res.status(200).json({
      message: 'Points retrieved successfully!',
      address,
      points: parseInt(points, 10),
    });
  } catch (error) {}
});

app.post('/buy-file', async (req, res) => {
  const { fileId, price, date, address, ipfsHash } = req.body;

  if (!fileId || !price || !date || !address) {
    return res.status(400).json({
      error: 'All fields are required: fileId, price, date, address, ipfsHash',
    });
  }

  try {
    const userKey = `user:${address}:files`;
    const fileData = { fileId, price, date, ipfsHash };
    await redisClient.rPush(userKey, JSON.stringify(fileData));

    return res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving file data:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while saving file data.' });
  }
});

app.get('/buy-file/:address', async (req, res) => {
  const { address } = req.params;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const userKey = `user:${address}:files`;
    const files = await redisClient.lRange(userKey, 0, -1);

    const parsedFiles = files.map((file) => JSON.parse(file));
    return res.status(200).json({ files: parsedFiles });
  } catch (error) {
    console.error('Error retrieving files:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while retrieving files.' });
  }
});

app.get('/is-user-verified-with-telegram', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'address not found' });
  }

  try {
    const key = `user:${address}:telegramVerified`;
    const isVerified = await redisClient.get(key);
    res.json({
      address,
      success: true,
      isVerified: isVerified === 'true',
    });
  } catch (error) {
    console.error('Error checking verification status:', error);

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

app.post('/is-user-verified-with-telegram', async (req, res) => {
  const { address, userId } = req.body;

  if (!address || !userId) {
    return res.status(400).json({
      success: false,
      message: 'address and userId are required in the request body.',
    });
  }

  try {
    const chatMember = await bot.getChatMember(channelId, userId);

    if (
      chatMember.status === 'member' ||
      chatMember.status === 'administrator' ||
      chatMember.status === 'creator'
    ) {
      const key = `user:${address}:telegramVerified`;
      await redisClient.set(key, 'true');

      res.status(200).json({
        address,
        success: true,
        message: 'User successfully verified.',
      });
    } else {
      res.status(200).json({
        address,
        success: false,
        message: `You are not a member of the channel. Please join here: https://t.me/${channelId.slice(
          1
        )}`,
      });
    }
  } catch (error) {
    console.error('Error verifying user:', error);

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

app.post('/clear-database', async (req, res) => {
  try {
    await redisClient.flushAll();
    res.json({
      success: true,
      message: 'Database cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing database',
      error: error.message,
    });
  }
});

client.login(BOT_TOKEN);

app.listen(3000);
