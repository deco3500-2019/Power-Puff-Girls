import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './Popup.css';

export default class Popup extends React.Component {
    constructor() {
        super();
        this.state = ({
            number: 1
        })
        this.increase = this.increase.bind(this);
        this.decrease = this.decrease.bind(this);
    }
    increase() {
        const { number } = this.state;
        this.setState({
            number: number + 1
        })
    }
    decrease() {
        const { number } = this.state;
        this.setState({
            number: number === 0 ? 0 : number - 1
        })
    }
    render() {
        const { name, id } = this.props.item;
        const { number } = this.state;
        return (
            <section className="overlay">
                <div className="box">
                    <h1>Enter amount</h1>
                    <div className="box2">
                        <h2>{name}</h2>
                        <div name="decrease" onClick={this.decrease} className="decrese"><FontAwesomeIcon icon={faMinusCircle} /></div>
                        <input type="number" className="inputQuantity" value={number} readOnly/>
                        <div name="increase" onClick={this.increase}><FontAwesomeIcon icon={faPlusCircle} /></div><br></br>
                    </div>
                    <button type="button" name="add" className="bbutton" onClick={() => this.props.addFunc(id, number)} style={{ borderRight: '0.5px solid rgba(17, 17, 17, 0.5)' }}>Add</button>
                    <button type="button" name="cancel" className="bbutton" onClick={this.props.cancelFunc} style={{ borderLeft: '0.5px solid rgba(17, 17, 17, 0.5)' }}>Cancel</button>
                </div>
            </section>
        );
    }
}
