import React,{Component}  from 'react';
import {Button} from 'react-bootstrap';
import Transaction from './Transaction';


class Block extends Component{
    state={displayTransaction:false};
    toggleTransaction=()=>{
        this.setState({displayTransaction:!this.state.displayTransaction})
    }
    get displayTrans(){
        const  {data} =this.props.block;
        const strData=JSON.stringify(data);
        const displayData=strData.length>30?
         `${strData.substring(0,30)}...`:
        strData;

        if(this.state.displayTransaction){
            return(
                 <div className='Transaction'>
                 {/* {JSON.stringify(data)}
                 <br/>
                 <Button bsstyle="danger"  bssize="small" onClick={this.toggleTransaction}>Show less..</Button>
                 </div>  */}
                {
                    data.map(transaction=>(
                        <div key={transaction.id}>
                            <hr/>
                           <Transaction transaction={transaction}/>
                        </div>
                    ))
                }
                
                  <br/>
                 <Button bsstyle="danger"  bssize="small" onClick={this.toggleTransaction}>Show less..</Button>
                 </div> 
            )
        }
        return(
            <div>
            <div>Data : {displayData}</div>
            <Button bsstyle="danger"  bssize="small" onClick={this.toggleTransaction}>Show more..</Button>
            </div>
        )
    }
      render(){
        const  {timestamp,hash} =this.props.block;
        const displayHash=`${hash.substring(0,15)}...`;
            return(
             <div  className='Block'>
                 <div>Hash : {displayHash}</div>
                 <div>Time : {new Date(timestamp).toLocaleString()}</div>
                {this.displayTrans}

             </div>

          )
      }
}

export default Block;