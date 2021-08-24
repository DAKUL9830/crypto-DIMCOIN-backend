//let Transaction=require('./transactions');
const TransactionPool=require('./transaction-pool');
let Transaction=require('./transactions');
const Wallet=require('./index');
const Blockchain=require('../blockchain');

 
describe('TransactionPool', ()=>{
    let tp,wallet,transaction,bc;
    beforeEach(()=>{
      tp=new TransactionPool();
      wallet= new Wallet();
      bc=new Blockchain();
      transaction=wallet.createTransaction('r4nd-4dr355',30,bc, tp);
      
      

    });
    it('adds transaction to the pool' ,()=>{
        expect(tp.transactions.find(t=>t.id==transaction.id)).toEqual(transaction);
    });
    it('update transaction in the pool' ,()=>{
       let oldTransaction=JSON.stringify(transaction);
       let newTransaction=transaction.update(wallet,'Alina',50);
       tp.updateOrAddTransaction(newTransaction)

      
        expect(JSON.stringify(tp.transactions.find(t=>t.id==newTransaction.id))).not.toEqual(oldTransaction);
    })
    it('clear transaction pool' ,()=>{
        tp.clear()
        expect(tp.transactions).toEqual([]);
    });

  

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions;
        beforeEach(() => {
          validTransactions = [...tp.transactions];
          for (let i=0; i<6; i++) {
            wallet = new Wallet();
            transaction = wallet.createTransaction('r4nd-4dr355', 30,bc, tp);
            if (i%2==0) {
              transaction.input.amount = 9999;
            // } else  if(i%3==1){
            //     console.log('This is error')
              //validTransactions.push(transaction);
            }else{
                validTransactions.push(transaction);
            }
           // return validTransactions
          }
        });
      
        it('shows a difference between valid and corrupt transactions', () => {
          expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });
      
        it('grabs valid transactions', () => {
          expect(tp.validTransactions()).toEqual(validTransactions);
        });
      });
      

})