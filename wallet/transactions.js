const ChainUtil=require('../chain-util');
const {MINING_REWARD}=require('../config');


class Transaction{
    constructor(){
        this.id=ChainUtil.id();
       this.input=null;
       this.outputs=[]
    }

    update(sendersWallet,recipient,amount){
        const senderOutput=this.outputs.find(output=>output.address==sendersWallet.publicKey);
        if((amount>sendersWallet.amount)){
            console.log(`Amount ${amount} exceeeds the balance.`)
            return
        }
        senderOutput.amount=senderOutput.amount - amount;
        this.outputs.push({amount,address:recipient});
        Transaction.signTransaction(this,sendersWallet);
        return this;
    }
    static transactionWithOutputs(sendersWallet,outputs){
        const transaction=new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction,sendersWallet)
        return transaction;
    }

    static newTransaction(sendersWallet,recipient,amount){
        if(amount>sendersWallet.balance){
        console.log (`Amount ${amount} exeeds balance`)
        return;
        }
       
    return Transaction.transactionWithOutputs(sendersWallet,[
        {amount:sendersWallet.balance-amount,address:sendersWallet.publicKey},
    {amount,address:recipient}
     ])
   }
   static rewardTransaction(minerWallet,blockchainWallet){
    return Transaction.transactionWithOutputs(blockchainWallet,[
        {amount:MINING_REWARD,address:minerWallet.publicKey}
     ])
   }
    static signTransaction(transaction,sendersWallet){
        transaction.input={
            timestamp: Date.now(),
            amount: sendersWallet.balance,
            address: sendersWallet.publicKey,
            signature: sendersWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }

}

module.exports=Transaction;