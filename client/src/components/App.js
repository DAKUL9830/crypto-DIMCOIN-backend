import React,{Component} from 'react';
//import Blocks from './Blocks';
import {Link } from 'react-router-dom';
import logo from '../logo.jpeg'

class App extends Component{
    
    state={walletInfo:{}}
    componentDidMount(){
        //fetch(`${document.location.origin}/wallet-info`)
        
        fetch(`${document.location.origin}/wallet-info`)
        .then(response => response.json())
        .then(json=>this.setState({walletInfo:json}));
    }
    
render(){
    
    const {publicKey,balance}=this.state.walletInfo;
    return(
        <div className='App'>
            <img className='logo'  src={logo}></img>
        <h1>Welcome to DIMECOIN</h1>
        <div className='WalletInfo'>
         <div>Balance:{balance}</div> 
         <br/>
         <br/>
         <div>Address:{publicKey}</div>
         </div>
         <br/>
         <div><Link to='/blocks'>BLOCKS</Link></div>
         <br/>
         <div><Link to='/conduct-transaction'>CONDUCT TRANSACTION</Link></div>
         <br/>
         <div><Link to='/transaction-pool'>TRANSACTION POOL</Link></div>
        </div>
    )
}
}
export default App;

