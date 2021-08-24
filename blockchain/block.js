//const SHA256=require('crypto-js/sha256');
const ChainUtil=require('../chain-util')
const {DIFFICULTY,MINE_RATE}=require('../config');

class Block{

    constructor(timestamp,lastHash,hash,data,nonce,difficulty){
        this.timestamp=timestamp;
        this.hash=hash;
        this.lastHash=lastHash;
        this.data=data;
        this.difficulty=difficulty||DIFFICULTY;
        this.nonce=nonce;
    }
    toString(){
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0,10)}
        Hash      : ${this.hash.substring(0,10)}
        Data      : ${this.data}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}`;
    }
    static genesis(){
        return new this('TIME','----','wrgweg',[],0,DIFFICULTY)
    }

    static mineBlock(lastBlock,data){
        let hash,timestamp;
      const lastHash=lastBlock.hash;
      let {difficulty}=lastBlock;
       let nonce=0;
     do{
            nonce++;
            timestamp=Date.now();
            difficulty=Block.adjustDifficulty(lastBlock,timestamp)
            hash=Block.hash(timestamp,lastHash,data,nonce,difficulty);
            
        }while(hash.substring(0,difficulty)!=='0'.repeat(difficulty));
        return new this(timestamp,lastHash,hash,data,nonce,difficulty);
    }
    static hash(timestamp,lastHash,data,nonce,difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
    }

    static blockHash(block){
        const {timestamp,lastHash,data,nonce,difficulty} =block;
        return Block.hash(timestamp,lastHash,data,nonce,difficulty);
    }

    static adjustDifficulty(lastBlock,currTime){
        let {difficulty}=lastBlock;
        difficulty=lastBlock.timestamp + MINE_RATE > currTime?difficulty+1:difficulty-1;
        return difficulty;
    }
}
module.exports=Block;