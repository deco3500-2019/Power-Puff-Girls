import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './Popup.css';

export default class Inventory extends React.Component {
    constructor() {
        super();
    }
    render(){
        return(
            <section className="overlay">
                <div className="box">
                    <h1>Enter amount</h1>
                    <h2>Cucumber</h2>
                    <button type="button" name="decrease" className="decrese"><FontAwesomeIcon icon={faMinusCircle} /></button>
                    <input type="number" placeholder="10"  className="inputQuantity"></input>
                    <button type="button" name="increase" ><FontAwesomeIcon icon={faPlusCircle} /></button><br></br>
                    <button type="button" name="add" className="bbutton" style={{borderRight: '0.5px solid rgba(17, 17, 17, 0.5)'}}>Add</button>
                    <button type="button" name="cancel" className="bbutton" style={{borderLeft: '0.5px solid rgba(17, 17, 17, 0.5)'}}>Cancel</button>
                </div>
            </section>
        );
    } 
}
