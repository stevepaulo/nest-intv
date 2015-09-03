"use strict";

var frisby = require('frisby');

frisby.create('Get heartbeat')
  .get('http://localhost:8012/api/heartbeat')
  .expectStatus(200)
  .toss();

frisby.create('Get v1')
  .get('http://localhost:8012/api/v1/products')
  .expectStatus(200)
  .expectJSONTypes('products.*', {
    name: String,
    price: Number,
    inStock: Boolean,
    availableColors: Array
  })
  .toss();
