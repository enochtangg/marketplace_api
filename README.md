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

### Endpoint/Usage

## Get Started

## Demo

## TODO