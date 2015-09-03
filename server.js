"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8012;
const logger = require('./logger');

app.use(bodyParser.json());

const colors = ['blue', 'red', 'green', 'orange', 'yellow', 'purple', 'pink', 'brown', 'black', 'white', 'gray'];
const products = ['thing', 'widget', 'sprocket', 'item', 'device', 'product', 'accessory', 'gadget', 'doohickey', 'whatsit'];

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate(depth) {
  let returnObj = {products: []};
  if (depth > 1) {

  } else {
    let thisRequestsProductNames = JSON.parse(JSON.stringify(products));
    let members = getRandomIntInclusive(1, 10);
    for (let i = 0; i < members; ++i) {
      returnObj.products.push({});
      let thisMembersColorsArray = JSON.parse(JSON.stringify(colors));
      let arrSize = getRandomIntInclusive(1, 5);
      returnObj.products[i].name = thisRequestsProductNames.splice(getRandomIntInclusive(0, (thisRequestsProductNames.length - 1)), 1)[0];
      returnObj.products[i].price = getRandomIntInclusive(0, 1000);
      returnObj.products[i].inStock = (i % 2 === 0) ? true : false;
      returnObj.products[i].availableColors = [];
      for (let j = 0; j < arrSize; ++j) {
        returnObj.products[i].availableColors.push(thisMembersColorsArray.splice(getRandomIntInclusive(0, (thisMembersColorsArray.length - 1)), 1)[0]);
      }
    }
  }
  return returnObj;
}

router.get('/v1/products', (req, res) => {
  res.status(200).json(generate(1));
});

router.get('/heartbeat', (req, res) => res.status(200).json({ message: 'OK' }));

app.use('/api', router);

// handle 404s
app.use((req, res, next) => res.status(404).json({ message: '404: Not Found' }));

// start
app.listen(port, () => console.log('Express server listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode.'));
