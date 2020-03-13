const express = require('express');



const server = express();

server.use(express.json());
server.use(logger);

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
