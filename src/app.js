const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./graphql/schema');
const root = require('./graphql/resolver');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const {errorType} = require('./utils/errors');
require('dotenv').config();

// Error lookup middleware
const getErrorCode = (errorName) => {
    return errorType[errorName];
}

// Create express server
const app = express();

// Authentication Middleware
const authMiddleware = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false
});
app.use(authMiddleware);

// GraphQL server
app.use('/graphql', bodyParser.json(), express_graphql(req => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    formatError: (err) => {
        console.log(err);
        const error = getErrorCode(err.message);
        return ({ message: error.message, statusCode: error.statusCode})
    },
    context: {
        user: req.user
    }
})));



module.exports = app;

