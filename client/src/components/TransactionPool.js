import React,{Component} from 'react';
import Transaction from './Transaction';
import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import history from '../history';
const INTERVAL=10000
//import { format } from 'crypto-js';

class TransactionPool extends Component{
 state={transactionPool:[]};
 fetchTransactionMap=()=>{
    fetch(`${document.location.origin}/transactions`)
    //fetch('http://localhost:57152/transactions')
.then(response => response.json())
.then(json=>this.setState({transactionPool:json}));
}
fetchMineTransaction=()=>{
    fetch(`${document.location.origin}/miner-transaction`)
    .then(response=>response.json())
    .then(history.push('./blocks'))
}

 componentDidMount(){
    // fetchTransactionMap=()=>{
    //     fetch('http://localhost:3001/transactions')
    // .then(response => response.json())
    // .then(json=>this.setState({transactionPool:json}));
    // }
    this.fetchTransactionMap()

    this.fetchInterval=setInterval(()=>this.fetchTransactionMap(),INTERVAL
    )
 }

 componentWillUnmount(){
     clearInterval( this.fetchInterval);
 }

render(){
  
       //const{outputs}=this.state.transactionPool;
    console.log("transaction-pool", this.state)
    return(
        <div className='TransactionPool'>
        <div><Link to='/'>HOME</Link></div>
              <h2>TRANSACTION POOL</h2>
              {
                 this.state.transactionPool.map(transaction=>{
                     return(
                         <div  key={transaction.id}>
                            <hr/>
                             <Transaction  transaction={transaction}/>
                        </div>
                     )
                 })
              }
              <hr/>
              <Button onClick={this.fetchMineTransaction}>Mine the Transactions</Button>
            </div>

    )
}

}
export default TransactionPool;