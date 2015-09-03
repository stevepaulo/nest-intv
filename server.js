'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8012;
const logger = require('./logger');
const colors = ['blue', 'red', 'green', 'orange', 'yellow', 'purple', 'pink', 'brown', 'black', 'white', 'gray'];
const products = ['thing', 'widget', 'sprocket', 'item', 'device', 'product', 'accessory', 'gadget', 'doohickey', 'whatsit'];

const getRandomIntInclusive = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateResponse = maxDepth => {
  maxDepth = maxDepth || 0;
  let returnArr = [];
  let thisRequestsProductNames = JSON.parse(JSON.stringify(products));
  let members = getRandomIntInclusive(1, 10);
  for (let i = 0; i < members; ++i) {
    let thisMembersColorsArray = JSON.parse(JSON.stringify(colors));
    let arrSize = getRandomIntInclusive(1, 5);
    let relatedProducts = getRandomIntInclusive(0, maxDepth);
    returnArr.push({
      name: thisRequestsProductNames.splice(getRandomIntInclusive(0, (thisRequestsProductNames.length - 1)), 1)[0],
      price: getRandomIntInclusive(1, 1000),
      inStock: (i % 2 === 0) ? true : false,
      availableColors: []
    });
    for (let j = 0; j < arrSize; ++j) {
      returnArr[i].availableColors.push(thisMembersColorsArray.splice(getRandomIntInclusive(0, (thisMembersColorsArray.length - 1)), 1)[0]);
    }
    if (relatedProducts) {
      returnArr[i].relatedProducts = generateResponse(maxDepth - 1);
    }
  }
  return returnArr;
};

router.get('/v1/products', (req, res) => res.status(200).json({products: generateResponse()}));
router.get('/v2/products', (req, res) => res.status(200).json({products: generateResponse(2)}));
router.get('/heartbeat', (req, res) => res.status(200).json({ message: 'OK' }));

app.use(compression());
app.use(bodyParser.json());
app.use('/api', router);
app.use((req, res, next) => res.status(404).json({ message: '404: Not Found' }));

app.listen(port, () => console.log('Express server listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode.'));
