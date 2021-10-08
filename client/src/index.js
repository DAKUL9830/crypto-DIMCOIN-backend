import React from 'react';
import {render} from 'react-dom';
import App from './components/App'
import Blocks from './components/Blocks'
import {Router,Switch,Route} from 'react-router-dom';
import history from './history';
import Transaction from './components/TransactionPool';
import ConductTransaction from './components/ConductTransaction';
import './index.css'
render(<Router history={history}>
<Switch>
    <Route exact path='/' component={App}/>
    <Route  path='/blocks' component={Blocks}/>
    <Route  path='/conduct-transaction' component={ConductTransaction}/>
    <Route  path='/transaction-pool' component={Transaction}/>
</Switch>
</Router>
    ,
document.getElementById('root')
)
 