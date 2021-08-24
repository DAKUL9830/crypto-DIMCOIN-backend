const Transaction = require('./transactions');
const Wallet =require('./index');
const {MINING_REWARD}=require('../config')
describe('Transaction', ()=>{
    let wallet,transaction,recipient,amount;

    beforeEach(()=>{
        wallet =new Wallet();
        amount=50;
        transaction=Transaction.newTransaction(wallet,recipient,amount);
        recipient='Dmitry';
        
       
    })
    it('outputs the amount substructes from the wallet',()=>{
          expect(transaction.outputs.find(output=>output.address==wallet.publicKey).amount)
          .toEqual(wallet.balance-amount);
    })
    it('outputs the amount added to recipient',()=>{
        expect(transaction.outputs.find(output=>output.address==recipient).amount)
        .toEqual(amount);
  })
  it('inputs the balance of the wallet ',()=>{
    expect(transaction.input.amount).toEqual(wallet.balance);
});
it('validates a valid transaction ',()=>{
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
});

it('invalidates a corrupt transaction ',()=>{
    transaction.outputs[0].amount=50000;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
});
  describe('transaction of the amount that exeeds the ballance',()=>{
      beforeEach(()=>{
          amount=50000;
          transaction=Transaction.newTransaction(wallet,recipient,amount);
      });
      it('transaction is not created',()=>{
        expect(transaction)
        .toEqual(undefined);
  })

  })

  describe('updating the transaction',()=>{
    let nextAmount,nextRecipient;
    beforeEach(()=>{
        nextAmount=20;
        nextRecipient='Alina';
        transaction=transaction.update(wallet,nextRecipient,nextAmount);

        
    });
    it(' substructes the output from the senders outtput',()=>{
        expect(transaction.outputs.find(output=>output.address==wallet.publicKey).amount)
        .toEqual(wallet.balance-amount- nextAmount);
  })
  it('outputs the amount for the next recipient',()=>{
      expect(transaction.outputs.find(output=>output.address==nextRecipient).amount)
      .toEqual(nextAmount);
})

})
describe('creating reward transaction',()=>{
    beforeEach(()=>{
          transaction=Transaction.rewardTransaction(wallet,Wallet.blockchainWallet())
    })
    it('rewardto the miners wallet',()=>{
        expect(transaction.outputs.find(output=>output.address==wallet.publicKey).amount)
        .toEqual(MINING_REWARD);
  });
})
})