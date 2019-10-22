import { faChevronDown, faChevronRight, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import * as fb from './../server.js';
import './Inventory.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Popup from '../Popup/Popup';

class Inventory extends React.Component {
    constructor() {
        super();
        this.state = {
            addItemName: '',
            searchResults: [],
            clicked: -1,
            loading: true,
            allInventory: [],
            data: [],
            place: "all",
            addItemRequest: []
        }
        this.search = this.search.bind(this);
        this.expand = this.expand.bind(this);
        this.addItem = this.addItem.bind(this);
        this.throwItem = this.throwItem.bind(this);
        this.useItem = this.useItem.bind(this);
        this.cancelPopup = this.cancelPopup.bind(this);

        const userId = sessionStorage.getItem('user_id');
        this.userdb = fb.database.ref(`Users/${userId}`);
        
    }
    
    componentDidMount(){
        this.userdb.on('value', ((item) => {
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

    componentWillUnmount(){
        this.userdb.off();
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

    expand(id) {
        /*
        let id = event.target.id;
        if(!(id === '' || id === undefined) ){
            id = Number(id);
            const { clicked } = this.state;
            this.setState({
                clicked: clicked === id ? -1 : id
            })
        }*/
        //this.setState({clicked: clicked === id ? -1 : id})
    }
    addItem(id, number) {
        fb.addInventoryItem(id, number);
        this.setState({
            addItemRequest: [],
            addItemName: '',
            searchResults: []
        })
    }
    addItemRequest(item) {
        this.setState({
            addItemRequest: item
        })
    }

    throwItem(event) {
        event.preventDefault();
        const item = Number(event.target.id);
        fb.throwItem(item).then(()=>{
            this.setState({clicked: -1});
        });
        
    }

    useItem(event) {
        event.preventDefault();
        const item = Number(event.target.id);
        fb.useItem(item).then(()=>{
            this.setState({clicked: -1});
        });
    }
    tipsRedirect(id) {
        this.props.history.push(`/${id}/tips`);
    }
    cancelPopup() {
        this.setState({
            addItemRequest: []
        })
    }
    render() {
        const { clicked, loading, data, addItemRequest } = this.state;
        return (
        <div className="inventoryPage"> 
            {addItemRequest.length !== 0 ? <Popup addFunc={this.addItem} cancelFunc={this.cancelPopup} item={addItemRequest} /> : null}
            <button className="scan">Scan</button>
            <input search="text" placeholder="Add item" value={this.state.addItemName}
                onChange={this.search} name="addItemName" className="searchbar"
                onClick={(event) => event.target.style.background = "#FFF"}
                onBlur={(event) => event.target.style.background = "rgba(255, 255, 255, 0.7)"} />
            <button className="select">Select</button>
            <div>{/* Search results section */}
                {this.state.searchResults.map((result, index) => {
                    return <li key={index} onClick={() => this.addItemRequest(result)} id={result.id} className="result"><FontAwesomeIcon icon={faSearch} /> {result.name}</li>
                })}
            </div>
            <nav className="navbar">
                <ul>
                    <li className={(this.state.place === "all" ? 'activelink' : '')} onClick={() => this.setState({ place: "all" })}>All</li>
                    <li className={(this.state.place === "fridge" ? 'activelink' : '')} onClick={() => this.setState({ place: "fridge" })}>Fridge</li>
                    <li className={(this.state.place === "freezer" ? 'activelink' : '')} onClick={() => this.setState({ place: "freezer" })}>Freezer</li>
                    <li className={(this.state.place === "pantry" ? 'activelink' : '')} onClick={() => this.setState({ place: "pantry" })}>Dry Pantry</li>
                </ul>
            </nav>
            <hr />
            <ul className="inventory">
                {loading ? 'Loading..' :
                    data.map(({ name, expiration, place, id, quantity }, index) => {
                        return <li key={index} className={('inventoryItem ' + (clicked === index ? 'expandedItem' : '')) +
                            (this.state.place !== place && this.state.place !== "all" ? 'hide' : '')}
                            id={index}>
                            <section className="header" onClick={()=>this.setState({clicked: clicked === index ? -1 : index})}><h1 id={index}>{name}</h1>
                                <p>Expire in {expiration}</p>
                                <FontAwesomeIcon icon={faChevronDown} id={index} />
                                <article className="quantity">{quantity}x</article>
                                <article className="place">{place}</article>
                            </section>
                            {clicked === index ?
                                <section className="expandedSection" id={index}>
                                    <input type="number" placeholder={quantity} id={index} className="inputQuantity"></input>
                                    <div className="subadd">
                                    <div name="subtract" onClick={() => fb.decrementQuantity(index)}><FontAwesomeIcon icon={faMinus} /></div>
                                    <div name="add" onClick={() => fb.incrementQuantity(index)}><FontAwesomeIcon icon={faPlus} /></div><br></br><br></br>
                                    </div>
                                    <button type="button" name="tips" className="button" onClick={() => this.tipsRedirect(id)}>Tips<FontAwesomeIcon icon={faChevronRight} /></button><br></br>
                                    <button type="button" name="recipes" className="button">Recipes<FontAwesomeIcon icon={faChevronRight} /></button><br></br>
                                    <button type="button" name="Throw" className="throw" id={index} onClick={this.throwItem}>Throw</button>
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
