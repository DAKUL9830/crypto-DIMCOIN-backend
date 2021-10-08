import React,{Component}  from 'react';
import Block from './Block';
import {Link} from 'react-router-dom'

class Blocks extends Component{
    state={ blocks:[]  };
componentDidMount(){
    fetch(`${document.location.origin}/blocks`)
    .then(response=>response.json())
    .then(json=>this.setState({blocks:json}));
}

render(){
    console.log('this.state' ,this.state)
    return(
        <div>
            <div><Link to='/'>HOME</Link></div>
        <h1>Blocks:</h1>
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