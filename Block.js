const sha2566 = require('crypto-js/sha256');

class Block{
    constructor(data, date){
        this.nonce = 0;
        this.index = 0;
        this.timestamp = date;
        this.data = data;
        //this.transactions = transactions;
        this.precedingHash = "0";
        this.hash = this.computeHash();
    }

    proofOfWork(difficulty){
        while(this.hash.substring(0, difficulty) !==Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.computeHash();
        }        
    }

    computeHash(){
        return sha2566(this.index+this.precedingHash + this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }
}

module.exports = Block;