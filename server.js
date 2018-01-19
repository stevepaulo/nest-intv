'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8012;
const logger = require('./logger');
const colors = ['blue', 'red', 'green', 'orange', 'yellow', 'purple', 'pink', 'brown', 'black', 'white', 'gray'];
const names = ['thing', 'widget', 'sprocket', 'item', 'device', 'product', 'accessory', 'gadget', 'doohickey', 'whatsit'];
const origins = ['mexico', 'norway', 'germany', 'china', 'italy', 'united states', 'japan', 'morocco', 'france', 'united kingdom', 'canada'];
const props = [
  {
    name: 'name',
    type: 'names',
    p: 100
  },
  {
    name: 'price',
    type: 'number',
    p: 95
  },
  {
    name: 'quantity',
    type: 'number',
    p: 90
  },
  {
    name: 'inStock',
    type: 'boolean',
    p: 85
  },
  {
    name: 'availableColors',
    type: 'colors',
    p: 75
  },
  {
    name: 'origin',
    type: 'origins',
    p: 50
  }
];

const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getThisProductsProperties = randomizeProperties => {
  let thisProductsProperties = JSON.parse(JSON.stringify(props));
  if (randomizeProperties) {
    thisProductsProperties.forEach((prop, i) => {
      const diceRoll = getRandomIntInclusive(1, 100);
      if (diceRoll > prop.p) {
        thisProductsProperties.splice(i, 1);
      }
    });
  }
  return thisProductsProperties;
};

const generateResponse = (maxDepth, randomizeProperties) => {
  let returnArr = [];
  let thisRequestsProductNames = JSON.parse(JSON.stringify(names));
  let thisRequestsProductOrigins = JSON.parse(JSON.stringify(origins));
  let members = getRandomIntInclusive(1, 10);
  for (let i = 0; i < members; ++i) {
    let thisProduct = {};
    let thisProductsProperties = getThisProductsProperties(randomizeProperties);
    thisProductsProperties.forEach(prop => {
      switch(prop.type) {
        case 'boolean':
          if (getRandomIntInclusive(0,1) === 1) {
            thisProduct[prop.name] = true;
          } else {
            thisProduct[prop.name] = false;
          }
          break;
        case 'names':
          thisProduct[prop.name] = thisRequestsProductNames.splice(getRandomIntInclusive(0, (thisRequestsProductNames.length - 1)), 1)[0];
          break;
        case 'origins':
          thisProduct[prop.name] = thisRequestsProductOrigins.splice(getRandomIntInclusive(0, (thisRequestsProductOrigins.length - 1)), 1)[0];
          break;
        case 'colors':
          let thisProductsColorsArray = JSON.parse(JSON.stringify(colors));
          thisProduct[prop.name] = [];
          for (let j = 0; j < getRandomIntInclusive(1,5); ++j) {
            thisProduct[prop.name].push(thisProductsColorsArray.splice(getRandomIntInclusive(0, (thisProductsColorsArray.length - 1)), 1)[0]);
          }
          break;
        default:
          thisProduct[prop.name] = getRandomIntInclusive(1, 1000);
      }
    });
    if (thisProduct['quantity'] && thisProduct['quantity'] === 0) {
      thisProduct['inStock'] = false;
    }
    if (thisProduct['inStock'] && thisProduct['inStock'] === false) {
      thisProduct['quantity'] = 0
    }
    returnArr.push(thisProduct);
    let relatedProducts = getRandomIntInclusive(0, maxDepth);
    if (relatedProducts) {
      returnArr[i].relatedProducts = generateResponse((maxDepth - 1), randomizeProperties);
    }
  }
  return returnArr;
};

router.get('/v1/products', (req, res) => res.status(200).json({products: generateResponse(0, false)}));
router.get('/v2/products', (req, res) => res.status(200).json({products: generateResponse(0, true)}));
router.get('/v3/products', (req, res) => res.status(200).json({products: generateResponse(2, true)}));
router.get('/health', (req, res) => res.status(200).send('OK'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(compression());
app.use(bodyParser.json());
app.use('/api', router);
app.use((req, res, next) => res.status(404).send('404: Not Found'));

app.listen(port, () => logger.info('Express server listening on port ' + port + ' in ' + process.env.NODE_ENV + ' mode.'));
