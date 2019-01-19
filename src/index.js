const app = require('./app');
require('dotenv').config();

function startServer(port) {
    try {
        app.listen(port, () => console.log(`Running a GraphQL API server at localhost:${port}/graphql`));
    } catch(e) {
        console.error(e);
    }
}

startServer(process.env.PORT);