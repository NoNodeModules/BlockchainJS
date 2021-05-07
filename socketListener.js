const Block = require('./Block');

const socketListener = (socket, blockchain) => {

    socket.on('mine', (sender, receiver, qty) => {
        let block = new Block({sender, receiver, qty});
        blockchain.addNewBlock(block);
        console.info(`Block number ${block.index} just mined`);
    })

    socket.on('blockmined', (newChain) =>{
        if(newChain !== blockchain.chain){
            //console.log(newChain);
            blockchain.chain = newChain;
            console.info('Blockchain synchronized');
        }else{
            console.info('Blockchain already updated');
        }
        
    })
    return socket
}

module.exports = socketListener