import React from 'react';
import './Inventory.css';
import * as fb from './../server.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const element = <FontAwesomeIcon icon={faCoffee} />

class Inventory extends React.Component {
    constructor() {
        super();
        this.state = {
            addItemName: '',
            searchResults: [],
            clicked: -1,
            loading: true,
            allInventory: [],
            data: []
        }
        this.search = this.search.bind(this);
        this.expand = this.expand.bind(this);
        this.addItem = this.addItem.bind(this);

        const userId = sessionStorage.getItem('user_id');
        fb.database.ref(`Users/${userId}`).on('value', ((item) => {
            const idList = item.val().inventory;
            let data = []
            idList.forEach((item) => {
                fb.database.ref(`inventory/${item.id}`).once('value').then((inventoryItem) => {
                    data = [...data, inventoryItem.val()];
                }).then(() => {
                    this.setState({
                        data,
                        loading: false
                    })
                })
            })
        }))
    }

    search(event) {
        const value = event.target.value;
        if (this.state.allInventory.length === 0) {
            fb.getAllInventory().then((item) => {
                this.setState({
                    allInventory: item
                })
            }).then(() => {
                const searchResults = this.state.allInventory.filter(({ name }) => {
                    return name.toLowerCase().includes(value.toLowerCase());
                });
                this.setState({
                    addItemName: value,
                    searchResults: value === '' ? [] : searchResults
                })
            })
        }
        else {
            const searchResults = this.state.allInventory.filter(({ name }) => {
                return name.toLowerCase().includes(value.toLowerCase());
            });
            this.setState({
                addItemName: value,
                searchResults: value === '' ? [] : searchResults
            })
        }
    }

    expand(event) {
        const id = Number(event.target.id);
        const { clicked } = this.state;
        this.setState({
            clicked: clicked === id ? -1 : id
        })
    }
    addItem(event) {
        event.preventDefault();
        const item = Number(event.target.id);
        fb.addInventoryItem(item, 3);
    }
    render() {
        const { clicked, loading, data } = this.state;
        return (<div>
            <h1 className="title">Inventory</h1>
            <input search="text" placeholder="Add new item..." value={this.state.addItemName}
                onChange={this.search} name="addItemName" className="searchbar"/>
            <div>{/* Search results section */}
                {this.state.searchResults.map((result, index) => {
                    return <li key={index} onClick={this.addItem} id={result.id}>{result.name}</li>
                })}
            </div>
            <hr />
            <ul className="inventory">
                {loading ? 'Loading..' :
                    data.map(({ name, expiration, place }, index) => {
                        return <li key={index} className={'inventoryItem ' + (clicked === index ? 'expandedItem' : '')}
                            id={index} onClick={this.expand}>
                            <h1 id={index}>{name}</h1><p>Expire in {expiration}</p>
                            {clicked === index ?
                                <section className="expandedSection" id={index}>
                                    <p id={index}>Avarage expiration: {expiration}<br></br>
                                    {place}</p>
                                    <FontAwesomeIcon icon="coffee" id={index}/>
                                    <input type="number" placeholder="5" id={index}></input>
                                    <button type="button" name="subtract" id={index}>-</button>
                                    <button type="button">+</button><br></br>
                                    <button type="button" name="Throw" className="throw" onClick={fb.deleteItem}>Throw</button>
                                    <button type="button" name="Use" className="use">Use</button>
                                </section> : ''}
                        </li>
                    })}
            </ul>
        </div>
        )
    }
}

export default Inventory;
