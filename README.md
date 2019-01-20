# marketplace_api

## Introduction
The marketplace API is backend application that contains the basic functionality necessary for an eCommerce website. For example, a user may
* sign-up
* login
* query products from the store (either one at a time or all at once)
* add items to their cart
* remove items from their cart
* view the metadata in their cart (owner, subtotal, total, number of items, and all carted items)
* checkout their cart


## Technical Overview
This repository contains the code for the market_api application written in [Node.js](https://nodejs.org/en/). The application ultizes [GraphQL](https://graphql.org/) which is a query lanuage for the API that alllows the user to clearly and easily define what type of data they want to receive. As for storing persistent data, the application uses a [MySQL](https://www.mysql.com/) instance and uses [Sequelize](http://docs.sequelizejs.com/) as a ORM tool to interact with the database. 

## Security
The API is secured by utilizing [JWT](https://jwt.io/). When a user signs-up or login, the API will  automatically create `Cart` instance in the database and will return JWT that contains the data for that cart. The user may now include this JWT as a **Bearer Token** in their request headers and will have access to modifying their cart. This allows users to signup or login (using a username & password) into their own cart. Users will not have access to each other's carts unless they somehow get a user's JWT (or username & password).

How does the Authorization work within the server? Since GraphQL has only one endpoint, which all the requests are made through, I simply made a **authorization middleware** to that endpoint. Just as with REST, the JWT will check if an Authorization header with a valid token is available on every request made to the endpoint. If so, then we decode it a `User` object (which is actually just a `Cart` object) to the requet. Then, I simply added an authorization check at the resolvers I wanted to secure, and boom! Each endpoint is only accessible to the right users with valid credentials.


## Database Schema
![db_schema](assets/marketplace_db_schema.png)

## API Usage

### Product Queries
| Method               | Description                                                     | Params                             | Return Type  | Requires JWT   |
| -------------------- |:----------------------------------------------------------------| :---------------------------------:| ------------:| -------------: |
| getOneProduct()      | Returns the product with the corresponding productId            | id: Int!                           | Product      | No
| getAllProducts()     | Returns an array of all products. If boolean `onlyAvailableInventory` is true, it will only return all the products with available inventory (where inventoryCount != 0) | onlyAvailableInventory: Boolean!   | \[Product\]  | No

### Cart Queries 
| Method               | Description                                                | Params      | Return Type    | Requires JWT  |
| -------------------- |:----------------------------------------------------------:| -----------:| --------------:| -------------:|
| getCart              | Returns the corresponding cart with its respective JWT     | None        | Cart           | Yes           |

### Cart Mutations
| Method               | Description                                                | Params      | Return Type    | Requires JWT  |
| -------------------- |:----------------------------------------------------------:| -----------:| --------------:| -------------:|
| login()              | Returns a JWT with the associated cart metadata associated    | owner: String!, password: String!        | String (JWT)   | No            |
| signup()             | Creates a new `cart` entity and returns a JWT with the associated cart metadata associated    | owner: String!, password: String!        | String (JWT)   | No            |
| addItemToCart()      | Searches for the productId and adds it into cart    | productId: Int!, quantity: Int!        | Cart           | Yes           |
| removeItemFromCart() | Searches for product in cart and removes it    | productId: Int!        | Cart           | Yes           |
| checkoutCart         | Checks out the cart by validating and decrementing the `inventoryCount` of all the `cartItem` in the cart     | None        | String         | Yes           |


## Get Started (Setting Up Locally)
Setting up **marketplace_api** is pretty simple. The two main compontents of this application is the backend server and the database server. The following steps will help you run the server locally, run a MySQL instance locally, and use [Insomnia](https://insomnia.rest/graphql/) for endpoint testing.

1. Clone this repository.

```
git clone https://github.com/enochtangg/marketplace_api.git
```

2. Change into marketplace_api directory
```
cd marketplace_api
```

3. Install dependencies from npm
```
npm install
```

4. Make sure you have MySQL install into your machine. You can check by using:
```
mysql -V
```

5. If you do not have MySQL installed, you can install it using homebrew by following the steps [here](https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e).

6. Once MySQL is installed, you want to set the root password for your local instance. **For testing purposes, set password to 'password'**. If you want create your own password, remember to change the *DATABASE_PASSWORD* variable in the [.env](.env) file of this repository.
```
brew services start mysql
mysql -u root
mysql> USE mysql;
mysql> UPDATE user SET password=PASSWORD("password") WHERE User='root';
mysql> FLUSH PRIVILEGES;
mysql> quit

```

7. Lastly, run the server. Once the server starts, it will execute a bunch of raw queries to populate the Products table so you may play around with the carting items.
```
npm start
```

## Demo

## Error Handling

## TODO