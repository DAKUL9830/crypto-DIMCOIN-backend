const Transaction = require('./transactions');

class TransactionPool{
    constructor(){
        this.transactions=[]
    }
    updateOrAddTransaction(transaction){
        let transactionWithId=this.transactions.find(t=>t.id==transaction.id);
        if(transactionWithId){
            this.transactions[this.transactions.indexOf(transactionWithId)]=transaction;
        }else{
            this.transactions.push(transaction)
        }
    }
    existingTransaction(address){
        return this.transactions.find(t=>t.input.address==address);
    }

    // validTransaction(){
    //     return this.transactions.filter(transaction=>{
    //         const outputTotal=transaction.outputs.reduce((total,output)=>{
    //             return total + output.amount;
    //         },0);
    //         if(transaction.input.amount!==outputTotal){
    //             console.log(`Invalid transaction from ${transaction.input.address}`)
    //             return;
    //         }
    //         if(!Transaction.verifyTransaction(transaction)){
    //         console.log(`Invalid signature from ${transaction.input.address}`)
    //         return;
    //         };
    //         return transaction;
    //     });
       
    // }

    validTransactions() {
       //return this.transactions.filter(transaction=>Transaction.verifyTransaction(transaction));
        return this.transactions.filter(transaction => {
          const outputTotal = transaction.outputs.reduce((total, output) => {
            return total + output.amount;
          }, 0);
          
          if (transaction.input.amount!== outputTotal) {
           return console.log(`Invalid transaction from ${transaction.input.address}.`);
            
          }
      
          if (!Transaction.verifyTransaction(transaction)) {
           return console.log(`Invalid signature from ${transaction.input.address}.`)
            
          };
          
          return transaction;
        });
      }
      clear(){
          this.transactions=[];
      }
      
}

module.exports=TransactionPool;