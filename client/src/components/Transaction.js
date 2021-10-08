import React from 'react';
//import { id } from '../../../chain-util';

const Transaction=({transaction})=>{
const {input,outputs}=transaction;
//const recipients=Object.keys(outputs)
   
return(
    <div>
        <div>From:{`${input.address.substring(0,15)}...`} | Balance: {input.amount}</div>
        
       {
           outputs.map(output=>{
               return(
           <div key={output.id}>
               To: {`${output.address.substring(0,15)}...`} | Sent: {output.amount}
               </div>
               )
           })
       }
        
    </div>

)

}
export default Transaction;