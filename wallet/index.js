const {INIT_BALANCE}=require('../config')
const ChainUtil=require('../chain-util');
const Transaction=require('./transactions');
const { ec } = require('elliptic');


class Wallet{
    constructor(){
        this.balance=INIT_BALANCE;
        this.keyPair=ChainUtil.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet-
        Public Key:${this.publicKey.toString()}
        Balance   :${this.balance}`;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient,amount,blockchain,transactionPool){
        this.balance=this.calculateBalance(blockchain)
        if(amount>this.balance){
            console.log(`Amount of ${amount}  the balance of  ${this.balance} `)
            return 
        }
        let transaction=transactionPool.existingTransaction(this.publicKey);
        if(transaction){
             transaction.update(this,recipient,amount)
        }else{
            transaction=Transaction.newTransaction(this,recipient,amount);
            transactionPool.updateOrAddTransaction(transaction)
        }
        return transaction;
    }
      static blockchainWallet(){
        const blockchainWallet=new this();
        blockchainWallet.address='blockchain-wallet';
        return blockchainWallet;
      }
      calculateBalance(blockchain){
        let balance=this.balance;
        let transactions=[];
        blockchain.chain.forEach(block=>block.data.forEach(transaction=>{
        transactions.push(transaction)
        }))
          const walletInputs=transactions.filter(transaction=>transaction.input.address==this.publicKey);

          let startTime=0;
          if(walletInputs.length>0){
              const recentInputT=walletInputs.reduce((prev,curr)=>
              prev.input.timestamp>curr.input.timestamp?prev:curr)
              
              balance=recentInputT.outputs.find(output=>output.address==this.publicKey).amount;
              startTime=recentInputT.input.timestamp;
          }
          transactions.forEach(transaction=>{
              if(transaction.input.timestamp>startTime){
                  transaction.outputs.find(output=>{
                    if(output.address==this.publicKey){
                        balance+=output.amount;
                    }
                  })
              }
              

          })
          
         return balance;
      }

}

module.exports=Wallet;