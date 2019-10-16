import { faChevronDown, faChevronRight, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import * as fb from './../server.js';
import './Inventory.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function bg() {
   document.getElementsByClassName('.searchbar').style.backgroundColor = "#fff";
}

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
        this.removeItem = this.removeItem.bind(this);
        this.useItem = this.useItem.bind(this);

        const userId = sessionStorage.getItem('user_id');
        fb.database.ref(`Users/${userId}`).on('value', ((item) => {
            let idList = item.val().inventory;
            let data = []
            let arrayList = fb.convertToArray(idList);
            arrayList.forEach((item) => {
                fb.database.ref(`inventory/${item.id}`).once('value').then((inventoryItem) => {
                    data = [...data, { ...inventoryItem.val(), quantity: item.quantity }];
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

    removeItem(event) {
        event.preventDefault();
        const item = Number(event.target.id);
        fb.throwAway(item);
    }

    useItem(event) {
        event.preventDefault();
        const item = Number(event.target.id);
        fb.useItem(item);
    }

    tipsRedirect(id) {
        this.props.history.push(`/${id}/tips`);
    }

    render() {
        const { clicked, loading, data } = this.state;
        return (<div>
            <button className="scan">Scan</button>
            <input search="text" placeholder="Add item" value={this.state.addItemName}
                onChange={this.search} name="addItemName" className="searchbar" onClick={bg} />
            <button className="select">Select</button>
            <div>{/* Search results section */}
                {this.state.searchResults.map((result, index) => {
                    return <li key={index} onClick={this.addItem} id={result.id} className="result"><FontAwesomeIcon icon={faSearch}/> {result.name}</li>
                })}
            </div>
            <nav className="navbar">
                <ul>
                    <li className="activelink" onClick={fb.getAllInventory}>All</li>
                    <li>Fridge</li>
                    <li>Freezer</li>
                    <li>Dry Pantry</li>
                </ul>
            </nav>
            <hr />
            <ul className="inventory">
                {loading ? 'Loading..' :
                    data.map(({ name, expiration, place, id, quantity }, index) => {
                        return <li key={index} className={'inventoryItem ' + (clicked === index ? 'expandedItem' : '')}
                            id={index}>
                            <section className="header" onClick={this.expand}><h1 id={index}>{name}</h1>
                                <p>Expire in {expiration}</p>
                                <FontAwesomeIcon icon={faChevronDown} id={index} />
                                <article className="quantity">{quantity}x</article>
                                <article className="place">{place}</article>
                            </section>
                            {clicked === index ?
                                <section className="expandedSection" id={index}>
                                    <input type="number" placeholder="5" id={index} className="inputQuantity"></input>
                                    <button type="button" name="subtract" id={index}><FontAwesomeIcon icon={faMinus} /></button>
                                    <button type="button" name="add"><FontAwesomeIcon icon={faPlus} /></button><br></br><br></br>

                                    <button type="button" name="tips" className="button" onClick={() => this.tipsRedirect(id)}>Tips<FontAwesomeIcon icon={faChevronRight} /></button><br></br>
                                    <button type="button" name="recipes" className="button">Recipes<FontAwesomeIcon icon={faChevronRight} /></button><br></br>
                                    <button type="button" name="Throw" className="throw" id={index} onClick={this.removeItem}>Throw</button>
                                    <button type="button" name="Use" className="use" id={index} onClick={this.useItem}>Use</button>
                                </section> : ''}
                        </li>
                    })}
            </ul>
        </div>
        )
    }
}

export default Inventory;
