const express = require('express');
const cors = require('cors');
const projectRouter = require('./routers/projectRouter');
const actionRouter = require('./routers/actionRouter');


const server = express();

server.use(express.json());
server.use(cors());
server.use(logger);
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
    res.send('<h2>Welcome to Project/Action API</h2>');
})

function logger(req, res, next) {
    const method = req.method;
    const url = req.originalUrl;
    const timeStamp = new Date;
    console.log(`Method '${method}' to URL '${url}' requested on '${timeStamp}'`);
    next();
}

module.exports = server;