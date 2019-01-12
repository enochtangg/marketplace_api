const app = require('./app');
const {sequelize} = require('./database/sequelize');
require('dotenv').config();

function startServer(port) {
    try {
        app.listen(port, () => console.log(`Running a GraphQL API server at localhost:${port}/graphql`));
    } catch(e) {
        console.error(e);
    }
}

startServer(process.env.PORT);