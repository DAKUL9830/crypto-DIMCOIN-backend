let Wallet=require('./index');
let TransactionPool=require('./transaction-pool');
const Blockchain=require('../blockchain');
const {INIT_BALANCE}=require('../config')


describe('Wallet', ()=>{

    let wallet,tp,bc; 
    beforeEach(()=>{
        wallet=new Wallet();
        tp=new TransactionPool();
        bc=new Blockchain();
        


    })
    describe('Creating a transaction', ()=>{
        let transaction,sendAmount,recipient;
        beforeEach(()=>{

            sendAmount=50;
            recipient='Alina'
            transaction=wallet.createTransaction(recipient,sendAmount,bc,tp)
        })
        describe('and dong the same transaction', ()=>{
           
            beforeEach(()=>{
              wallet.createTransaction(recipient,sendAmount,bc,tp)
            })
            it('doubles the sameAmount subtracted from the wallet balance',()=>{
                expect(transaction.outputs.find(output=>output.address==wallet.publicKey).amount)
                .toEqual(wallet.balance-sendAmount*2);
          })

          it('clones the sameAmount output for the recipient',()=>{
            expect(transaction.outputs.filter(output=>output.address==recipient).map(output=>output.amount))
            .toEqual([sendAmount,sendAmount]);
      })

        })
    })
    describe('calculating the balance', ()=>{
           let addBalance,sendersWallet,repeatAdd;
        beforeEach(()=>{
          addBalance=100;
          repeatAdd=3;
          sendersWallet=new Wallet();
          for(let i=0;i<repeatAdd;i++){
            sendersWallet.createTransaction(wallet.publicKey,addBalance,bc,tp)
          }
          bc.addBlock(tp.transactions);
        })
        it('calculates the balance for receipient',()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INIT_BALANCE+(addBalance*repeatAdd))
            
      })

      it('calculates the balance for sender',()=>{
        expect(sendersWallet.calculateBalance(bc)).toEqual(INIT_BALANCE-(addBalance*repeatAdd))
        
  })
  describe('recipient conduct the transaction', ()=>{
    let substractBalance,recipientBalance;
 beforeEach(()=>{
    substractBalance=70;
    recipientBalance=wallet.calculateBalance(bc);
    wallet.createTransaction(sendersWallet.publicKey,substractBalance,bc,tp)
    bc.addBlock(tp.transactions)
   })
   describe('and sender sends another transaction to the recipient', ()=>{
   
 beforeEach(()=>{
    tp.clear()
    sendersWallet.createTransaction(wallet.publicKey,addBalance,bc,tp)
    bc.addBlock(tp.transactions)
   })
   it('calculates the recipient balance only with the most recent transaction',()=>{
    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance-substractBalance+addBalance);
      })
     })

    })

  })
});
