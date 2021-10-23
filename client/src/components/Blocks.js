import React,{Component}  from 'react';
import Block from './Block';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom'

class Blocks extends Component{
    state={ blocks:[],paginatedId:0 ,blocksLength:0};
componentDidMount(){
    fetch(`${document.location.origin}/blocks/length`)
   
    .then(response=>response.json())
    .then(json=>this.setState({blocksLength:json}));
    this.fetchPaginatedId(this.state.paginatedId)()
}

   fetchPaginatedId=paginatedId=>()=>{
    fetch(`${document.location.origin}/blocks/${paginatedId}`)
    
    .then(response=>response.json())
    .then(json=>this.setState({blocks:json}));
}

render(){
    console.log('this.state' ,this.state)
    return(
        <div>
            <div><Link to='/'>HOME</Link></div>

        <h1>Blocks:</h1>
        <div>
            {
                [...Array(Math.ceil(this.state.blocksLength/5)).keys()].map(key=>{
                    let paginatedId=key+1;
                    return(
                        <span  key={key} onClick={this.fetchPaginatedId(paginatedId)}>
                    <Button bsSize='small' bsStyle='danger' >{paginatedId}</Button>{' '}
                    </span>
                    )
                })
            }
        </div>
        {this.state.blocks.map(block=>{
            return(
                // <div key={block.hash} className="Block">{block.hash}</div>
                <Block key={block.hash} block={block}/>
                )
        })}
        </div> )
}

}

export default Blocks