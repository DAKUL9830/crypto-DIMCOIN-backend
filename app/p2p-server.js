const Websocket=require('ws');
//const { listenerCount, Server } = require('ws');
const P2P_PORT=process.env.P2P_PORT||5001;
const peers=process.env.PEERS?process.env.PEERS.split(','):[];
const MESSAGE_TYPE={
  chain:'CHAIN',
  transaction:'TRANSACTION',
  clear_transactions:'CLEAR_TRANSACTIONS'

}
class P2pServer{
    constructor(blockchain,transactionPool){
       this.blockchain=blockchain;
       this.transactionPool=transactionPool;
       this.sockets=[]
    }
listen(){
    const server=new Websocket.Server({port:P2P_PORT})
   server.on('connection',socket=>this.connectSocket(socket));
   this.connectToPeers();
   console.log(`Listening for peer-to-peer connection on: ${P2P_PORT}`);
}

connectToPeers(){
    peers.forEach(peer =>{

        //ws://localhost:5001
       const socket= new Websocket(peer);
       socket.on('open',()=>this.connectSocket(socket));
    });
}
connectSocket(socket){
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
    this.sendChain(socket)
    //socket.send(JSON.stringify(this.blockchain.chain));
}

messageHandler(socket){
    socket.on('message',message=>{
        const data=JSON.parse(message);
        //console.log('data',data)
        //this.blockchain.replaceChain(data)
        switch(data.type){
            case MESSAGE_TYPE.chain:
                this.blockchain.replaceChain(data.chain);
                break;
            case MESSAGE_TYPE.transaction:
            this.transactionPool.updateOrAddTransaction(data.transaction);
                break;
                case MESSAGE_TYPE.clear_transactions:
                    this.transactionPool.clear()
                    break;
        }
    })
}
sendChain(socket){
    socket.send(JSON.stringify({type:MESSAGE_TYPE.chain,chain:this.blockchain.chain}));
}
syncChains(){
  this.sockets.forEach(socket=>this.sendChain(socket));
}

sendTransaction(socket,transaction){
socket.send(JSON.stringify({type:MESSAGE_TYPE.transaction,transaction}))
}
broadcastTransaction(transaction){
    this.sockets.forEach(socket=>this.sendTransaction(socket,transaction))
}
broadcastClearTransactions(){
    this.sockets.forEach(socket=>socket.send(JSON.stringify({
        type:MESSAGE_TYPE.clear_transactions
    })))
}
}

module.exports=P2pServer;