const redisClient = require('./redisClient'); // Import the Redis client

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/add-user', async (req, res, next) => {
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

app.get('/get-user/:address', async (req, res, next) => {
  const { address } = req.params;

  const userData = await redisClient.get(`user:${address}`);

  if (!userData) {
    return res.status(401).send({ messgae: 'USER NOT FOUND' });
  }

  res.status(200).send({ message: 'Success', user: JSON.parse(userData) });
});

app.listen(3000);
