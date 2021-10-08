const express=require('express');
const Blockchain=require('../blockchain');
const bodyParser=require('body-parser');
const path=require('path');
const P2pServer=require('./p2p-server');
const Wallet=require('../wallet');
const TransactionPool=require('../wallet/transaction-pool');
const Miner=require('./miner');
//const { blockchainWallet } = require('../wallet');
  const HTTP_PORT=process.env.HTTP_PORT||3001;

  const app=express();
  const tp=new TransactionPool()
  const wallet=new Wallet();
  const bc =new Blockchain();
  const p2pServer= new P2pServer(bc,tp);
  const miner=new Miner(bc,tp,wallet,p2pServer);
  
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname,'../client/dist')))
  app.get('/blocks',(req,res)=>{
      res.json(bc.chain);
  })

  app.post('/mine',(req,res)=>{
      const block=bc.addBlock(req.body.data);
      console.log(`New block added ${block.toString()}`);
      p2pServer.syncChains();
      res.redirect('/blocks');
  })

  app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
})

app.post('/transact',(req,res)=>{
  const {recipient,amount}=req.body;
  const transaction =wallet.createTransaction(recipient,amount,bc,tp);
  p2pServer.broadcastTransaction(transaction)
  res.redirect('/transactions')
  
})

app.get('/public-key',(req,res)=>{
    res.json({publicKey: wallet.publicKey});
})
app.get('/wallet-info',(req,res)=>{
    res.json({publicKey: wallet.publicKey,
    balance:wallet.balance});
})

app.get('/miner-transaction',(req,res)=>{
    const block=miner.mine();
    console.log(`New block added ${block.toString()}`)
    res.redirect('/blocks');
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/dist/index.html'))
});

const walletFoo=new Wallet();
const walletBar=new Wallet();

const generateWalletTransaction=({wallet,recipient,amount})=>{
    const transaction=wallet.createTransaction(recipient,amount,bc,tp) 

tp.updateOrAddTransaction(transaction)
}

const walletAction=()=>generateWalletTransaction({wallet,recipient:walletFoo.publicKey,amount:5,tp})

const walletFooAction=()=>generateWalletTransaction({wallet:walletFoo,recipient:walletBar.publicKey,amount:10,tp})

const walletBarAction=()=>generateWalletTransaction({wallet:walletBar,recipient:wallet.publicKey,amount:15,tp})
    
for(let i=0;i<10;i++){
    if(i%3==0){
        walletAction();
        walletFooAction();
    }
    else if(i%3==1){
        walletAction();
        walletBarAction();
    }else{
        walletFooAction();
        walletBarAction();
    }
    miner.mine();
}

  app.listen(HTTP_PORT,()=>console.log(`Listening on port ${HTTP_PORT}`));
  p2pServer.listen();