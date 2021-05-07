const { io } = require('socket.io-client');
const Block = require('./Block')

class Blockchain{
    constructor(io){
        this.chain = [this.startGenesisBlock()]
        this.difficulty = 1;
        this.nodes = [];
        this.io = io;
        this.pendingTransactions = [];
    }
    startGenesisBlock(){
        let actualDate = "2015/02/03";
        let block = new Block({sender: '', recipient: '', qty: 0}, actualDate);
        return block;
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    addNewBlock(newblock){
        newblock.precedingHash = this.getLatestBlock().hash
        newblock.index = this.getLatestBlock().index+1;
        newblock.timestamp = Date.now();
        newblock.proofOfWork(this.difficulty);
        this.chain.push(newblock);
        this.io.emit('blockmined', this.chain);   
    }

    //Valider l’intégrité de la chaine
    checkChainValidity(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const precedingBlock = this.chain[i-1];
    
          if(currentBlock.hash !== currentBlock.computeHash()){
              return false;
          }
          if(currentBlock.precedingHash !== precedingBlock.hash)
            return false;
        }
        return true;
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
        console.log("bite");
    }

    getBalanceOfAdress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    addNewNode(node){
        this.nodes.push(node)
    }
}

module.exports = Blockchain