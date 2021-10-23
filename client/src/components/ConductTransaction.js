import React,{Component} from 'react';
import {FormGroup,FormControl,Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component{
    state={recipient:'',amount:0,knownAddresses:[]}

    componentDidMount(){
        fetch(`${document.location.origin}/known-addresses`)
        .then(response=>response.json())
        .then(json=>this.setState({knownAddresses:json}));
    }
    upadateRecipient=event=>{
        this.setState({recipient:event.target.value});
     }
 
     upadateAmount=event=>{
         this.setState({amount:Number(event.target.value)});
     }

     conductTransaction=()=>{
        const {recipient,amount}=this.state;
        fetch(`${document.location.origin}/transact`,{
            method:'POST',
            headers:{'Content-Type':'application/json'}, 
            body:JSON.stringify({recipient,amount})
        })
        .then(response=>response.json())
        .then(json=>({recipient:json},{amount:json})
        
        ).then(history.push('./transaction-pool'))

          
     
    }
render(){
   
  console.log('this.state',  this.state)
   
    

    return (

             

        <div className='ConductTransaction'>
            <div><Link to='/'>HOME</Link></div>
              <h2>KNOWN ADDRESSES</h2>
              <br/>
              {
                  this.state.knownAddresses.map(knownAddress=>{
                    return(
            <div key={knownAddress}>
                <div>{knownAddress}</div>
                <br/>
                </div>
                    )
                    })
                }
                <br/>
            <h1>CONDUCT TRANSACTION</h1>
            <FormGroup>
               <FormControl
               input='text'
               placeholder='recipient'
               value={this.state.recipient}
               onChange={this.upadateRecipient}

               />
               <br/>
               <FormControl
               input='text'
               placeholder='amount'
               value={this.state.amount}
               onChange={this.upadateAmount}

               />
            </FormGroup>
            <div>
                <Button  onClick={this.conductTransaction}>Submit</Button>
            </div>


        </div>

    )
}

}
export default ConductTransaction;