#!/usr/bin/node
import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

const productsList = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5
  },
];

const findProductById = (id) => {
  const product = productsList.find(obj => obj.itemId === id);

  if (product) {
    return Object.fromEntries(Object.entries(product));
  }
};

const app = express();
const redisClient = createClient();
const PORT = 1245;

const updateReservedStockById = async (itemId, stock) => {
  return promisify(redisClient.SET).bind(redisClient)(`item.${itemId}`, stock);
};

const fetchCurrentReservedStockById = async (itemId) => {
  return promisify(redisClient.GET).bind(redisClient)(`item.${itemId}`);
};

app.get('/list_products', (_, res) => {
  res.json(productsList);
});

app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = findProductById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  fetchCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
      res.json(productItem);
    });
});

app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = findProductById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  fetchCurrentReservedStockById(itemId)
    .then((result) => Number.parseInt(result || 0))
    .then((reservedStock) => {
      if (reservedStock >= productItem.initialAvailableQuantity) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
      }
      updateReservedStockById(itemId, reservedStock + 1)
        .then(() => {
          res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

const resetProductStock = () => {
  return Promise.all(
    productsList.map(
      item => promisify(redisClient.SET).bind(redisClient)(`item.${item.itemId}`, 0),
    )
  );
};

app.listen(PORT, () => {
  resetProductStock()
    .then(() => {
      console.log(`API available on localhost port ${PORT}`);
    });
});

export default app;
