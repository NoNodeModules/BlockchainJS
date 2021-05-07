const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const client = require('socket.io-client');
const Block = require ("./Block");
const Blockchain = require("./Blockchain");
const socketListener = require('./socketListener');
const Transaction = require("./Transaction");
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3001;
app.use(express.json());

const blockchain = new Blockchain(io)

app.get('/blocks',(req,res) => {
    res.json(blockchain.chain)
    console.log(blockchain.nodes)
});

app.post('/mine', (req,res) => {
    const {sender, receiver, qty} = req.body
    io.emit('mine', sender, receiver, qty)

    res.redirect('/blocks')
})

app.post('/nodes', (req,res) =>{
    const {host, port} = req.body;
    const {callback} = req.query;
    const node = `http://${host}:${port}`;
    const socketNode = socketListener(client(node), blockchain)
    blockchain.addNewNode(socketNode);
    
    if(callback === 'true'){
        console.info(`Node ${node} added via callback`)
        res.json({status: 'Added node', node: node, callback : true})
    }else{
        fetch(`${node}/nodes?callback=true`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({host: req.hostname, port: PORT})
        })
        console.info(`Node ${node} added via callback`);
        res.json({status: 'Added node', node: node, callback : true})
    }
})

app.get('/nodes',(req,res) => {
    res.json({count: blockchain.nodes.length})
    console.log(blockchain.nodes)
});

http.listen(PORT, () => {
    console.log("listening on port", PORT);
});

io.on('connection', (socket) => {
    console.info(`Socket connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.info(`Socket disconnected ${socket.id}`)
    })
})

let stonks = new Blockchain();
stonks.createTransaction(new Transaction('address1', 'address2', 100));
stonks.createTransaction(new Transaction('address2', 'address1', 50));

console.log(stonks);

//console.log(stonks.getBalanceOfAdress('address1'));
blockchain.addNewNode(socketListener(client(`http://localhost:${PORT}`), blockchain))