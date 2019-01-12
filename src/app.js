const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./graphql/schema');
const root = require('./graphql/resolver');

// Create express server
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

module.exports = app;