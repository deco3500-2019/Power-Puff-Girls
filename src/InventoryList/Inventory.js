import React from 'react';
import './Inventory.css';

class Inventory extends React.Component {
    constructor() {
        super();
        this.state = {
            UserName: 'admin',
            UserPassword: 'admin',
            addItemName: '',
            searchResults: [],
            clicked: -1,
            loading: true,
            allInventory: []
        }
        this.search = this.search.bind(this);
        this.expand = this.expand.bind(this);
        this.addItem = this.addItem.bind(this);

        fetch('https://s4540545-ppg.uqcloud.net/php_files/inventory_connect.php', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((responseJson) => {
            this.setState({
                loading: false,
                data: [ ...responseJson ]
            })
            console.log(responseJson);

        }).catch((error) => {
            console.log(error);
        });

        fetch('https://s4540545-ppg.uqcloud.net/php_files/get_all_inventory.php', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((responseJson) => {
            this.setState({
                allInventory: responseJson
            })
            console.log(responseJson);
        }).catch((error) => {
            console.log(error);
        });
    }

    search(event) {
        const value = event.target.value;
        const searchResults = this.state.allInventory.filter(({ name }) => {
            return name.toLowerCase().includes(value.toLowerCase());
        });
        this.setState({
            addItemName: value,
            searchResults: value === '' ? [] : searchResults
        })
    }

    expand(event) {
        const id = event.target.id;
        const { clicked } = this.state;
        this.setState({
            clicked: clicked === id ? -1 : id
        })
    }
    addItem(event){
        event.preventDefault();
        fetch('https://s4540545-ppg.uqcloud.net/php_files/inventory_add.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                inventory_ID: Number(event.target.id)
            })
        }).then((response) => {
            console.log(response);
            return response.json();
        }).then((responseJson) => {
            console.log(responseJson);
            //IF SUCCESS 
            //Add item to state? 
        }).catch((error) => {
            console.log(error);
        });
    }
    render() {
        const { clicked, loading, data } = this.state;
        return (<div>
            <h1>Inventory</h1>
            <input search="text" placeholder="Add new item..." value={this.state.addItemName}
                onChange={this.search} name="addItemName" />
            <div>{/* Search results section */}
                {this.state.searchResults.map((result, index) => {
                    return <li key={index} onClick={this.addItem} id={result.ID}>{result.name}</li>
                })}
            </div>
            <hr />
            <ul className="inventory">
                {loading? 'Loading..' :
                    data.map(({ name, expiration }, index) => {
                    return <li key={index} className={'inventoryItem ' + (Number(clicked) === name ? 'expandedItem' : '')}
                        id={index} onClick={this.expand}>
                        {name}
                        {Number(clicked) === index ?
                            <p className="expandedSection">Lorem Ipsum dolor sit amet</p> : ''}
                    </li>
                })}
            </ul>
        </div>
        )
    }
}

export default Inventory;
