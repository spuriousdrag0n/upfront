const redisClient = require('./redisClient'); // Import the Redis client

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

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

    // Get all IPFS entry IDs for this user
    const ipfsEntryIds = await redisClient.sMembers(`user:${address}:ipfs`);

    // Get the details for each IPFS entry
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

    // Sort files by createdAt (newest first)
    allFiles.sort((a, b) => b.createdAt - a.createdAt);
    res.json({
      success: true,
      total: allFiles.length,
      data: allFiles,
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

app.listen(3000);
