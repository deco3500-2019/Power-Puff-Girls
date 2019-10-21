import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import Profile from './Profile/Profile';
import Inventory from './InventoryList/Inventory';
import GroceryList from './GroceryList/GroceryList';
import Login from './Login/Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import Tips from './InventoryList/Tips/Tips';

function App() {
  return (
    <BrowserRouter>
      {sessionStorage.getItem('foodWaste-loggedIn') === 'true' ?
        <div className="App">
          <Switch>
            <Route path="/inventory" component={Inventory} />
            <Route path="/profile" component={Profile} />
            <Route path="/groceryList" component={GroceryList} />
            <Route path="/:itemId/tips" component={Tips} />
            <Route path="/" render={() => (<Redirect to="/inventory" />)} />
          </Switch>
          <div className="menu">
            <Link to="/inventory" className="menuItems"><FontAwesomeIcon icon={faArchive}/></Link>
            <Link to="/groceryList" className="menuItems"><FontAwesomeIcon icon={faShoppingCart}/></Link>
            <Link to="/profile" className="menuItems"><FontAwesomeIcon icon={faUser}/></Link>
          </div>
        </div>
        :
        <Login />}
    </BrowserRouter>
  );
}

export default App;
