# rando-api
Random API response generator

# Installation

1. `npm i`
2. `npm start`

Rando-api has all the necessary pieces to be deployed to Heroku and shouldn't need any configuration to do so.

# Usage

The API provides four endpoints:

### /api/health

Responds with "OK" if the API is running.

### /api/v1/products

Responds with a relatively-predictable JSON payload.

* Has a root `products` array
* `products` array has between 1 and 10 objects.
* Every object has the same property keys:
  * `name` String
  * `origin` String
  * `price` Number
  * `quantity` Number
  * `inStock` Boolean
  * `availableColors` Array
* Every object property value is randomized. Strings are unique among the other response members.

### /api/v2/products

Responds with an unpredictable JSON payload.

* Has a root `products` array
* `products` array has between 1 and 10 objects.
* Every object has at least some, but not necessarily all of the following property keys:
  * `name` String
  * `origin` String
  * `price` Number
  * `quantity` Number
  * `inStock` Boolean
  * `availableColors` Array
* Every object property value is randomized. Strings are unique among the other response members.

### /api/v3/products

Responds with an unpredictable, nested JSON payload.

* Has a root `products` array
* `products` array has between 1 and 10 objects.
* Every object has at least some, but not necessarily all of the following property keys:
  * `name` String
  * `origin` String
  * `price` Number
  * `quantity` Number
  * `inStock` Boolean
  * `availableColors` Array
* Every object may or may not have a `relatedProducts` array, which mimics the root `products` array in all ways.
* Every object in a `relatedProducts` array may or may not itself have a `relatedProducts` array.
  * The rabbit hole doesn't go further than that. Maximum three total levels.
* Every object property value is randomized. Strings are unique among the other response members at the same nesting level.

# Testing

1. `npm test`
