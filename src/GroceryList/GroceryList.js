import React from 'react';
import "./GroceryList.css";
import * as fb from '../server';
import Popup from '../Popup/Popup';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class GroceryList extends React.Component {
    constructor() {
        super();
        this.state = ({
            groceryList: [],
            loading: true,
            addItemRequest: [],
            searchResults: [],
            allInventory: [],
            addItemName: ''
        })

        const userId = sessionStorage.getItem('user_id');
        fb.database.ref(`Users/${userId}/groceryList`).on('value', ((list) => {
            let groceryList = list.val();
            let data = [];
            groceryList.forEach((item) => {
                fb.database.ref(`inventory/${item.id}`).once('value').then((groceryItem) => {
                    data = [...data, { ...groceryItem.val(), quantity: item.quantity }];
                }).then(() => {
                    this.setState({
                        groceryList: data,
                        loading: false
                    })
                })
            })
        }))
        this.search = this.search.bind(this);
        this.addItem = this.addItem.bind(this);
        this.cancelPopup = this.cancelPopup.bind(this);
        this.addItemRequest = this.addItemRequest.bind(this);
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

    addItem(id, number){
        fb.addGroceryItem(id, number).then(() => {
            this.setState({
                addItemRequest: [],
                addItemName: '',
                searchResults: []
            }) 
        })
    }
    cancelPopup(){
        this.setState({
            addItemRequest: []
        })
    }
    addItemRequest(item){
        this.setState({
            addItemRequest: item
        })
    }
    render() {
        const { groceryList, loading, addItemRequest } = this.state;
        return (
            <div>
                {loading ? 'Loading...' :
                    <div>
                        {addItemRequest.length !== 0 ? <Popup addFunc={this.addItem} cancelFunc={this.cancelPopup} item={addItemRequest} /> : null}
                        <button className="scan">Scan</button>
                        <input search="text" placeholder="Add item" value={this.state.addItemName}
                            onChange={this.search} name="addItemName" className="searchbar"
                            onClick={(event) => event.target.style.background = "#FFF"}
                            onBlur={(event) => event.target.style.background = "rgba(255, 255, 255, 0.7)"} />
                        <button className="select">Select</button>
                        <div>
                            {this.state.searchResults.map((result, index) => {
                                return <li key={index} onClick={() => this.addItemRequest(result)} id={result.id} className="result"><FontAwesomeIcon icon={faSearch} /> {result.name}</li>
                            })}
                        </div>
                        <ul className="groceryList">
                            {groceryList.map(item => {
                                return <li key={item.id}><input type="checkbox" key={item.id} className="groceyItem" value={item.name} />{item.name} <div className="itemQuantity">{item.quantity}x</div></li>

                            })}
                        </ul>
                    </div>
                }
                <button type="button" name="Purchase" className="purchase">Purchase</button>
                <button type="button" name="Delete" className="delete">Delete</button>
            </div>
        )
    }
}

export default GroceryList;