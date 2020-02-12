const express = require('express');

const dataRouter = require('./data/data-router.js');

const server = express();
server.use(express.json());

server.use('/api/posts', dataRouter);

server.get('/', (req, res) => {
    res.send(
        `<h2>Building RESTful API's with Express</h2>`
    );
});

const port = 3333;

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
