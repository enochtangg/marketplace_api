const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./graphql/schema');
const root = require('./graphql/resolver');
const {errorType} = require('./utlils/errors');

// Error lookup middleware
const getErrorCode = (errorName) => {
    return errorType[errorName];
}
// Create express server
const app = express();
app.use('/graphql', express_graphql({
    formatError: (err) => {
        console.log(err);
        const error = getErrorCode(err.message);
        return ({ message: error.message, statusCode: error.statusCode})
    },
    schema: schema,
    rootValue: root,
    graphiql: true,
}))



module.exports = app;