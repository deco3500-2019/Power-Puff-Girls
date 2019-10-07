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
            clicked: -1
        }
        this.search = this.search.bind(this);
        this.expand = this.expand.bind(this);
        /* setTimeout(
            fetch('https://s4540545-ppg.uqcloud.net/php_files/inventory_connect.php', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                } 
            }).then((response) => {
                console.log(response);
                return response.json();
            }).then((responseJson) => {
                console.log(responseJson);
            }).catch((error) => {
                console.log(error);
            }), 2000); */
    }

    search(event) {
        const value = event.target.value;
        const searchResults = dummyListAllItems.filter(({ item }) => {
            return item.toLowerCase().includes(value.toLowerCase());
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
    render() {
        const { clicked } = this.state;
        return (<div>
            <h1>Inventory</h1>
            <input search="text" placeholder="Add new item..." value={this.state.addItemName}
                onChange={this.search} name="addItemName" />
            <div>{/* Search results section */}
                {this.state.searchResults.map((result, index) => {
                    return <li key={index}>{result.item}</li>
                })}
            </div>
            <hr />
            <ul className="inventory">
                {dummyListInventoryForUser.map(({ id, item }, index) => {
                    return <li key={id} className={'inventoryItem ' + (Number(clicked) === id ? 'expandedItem' : '')}
                        id={id} onClick={this.expand}>
                        {item}
                        {Number(clicked) === id? 
                        <p className="expandedSection">Lorem Ipsum dor si amet</p> : ''}
                    </li>
                })}
            </ul>
        </div>
        )
    }
}

export default Inventory;

const dummyListInventoryForUser = [
    {
        id: 1,
        item: 'Avocado'
        //etc
    },
    {
        id: 2,
        item: 'Banana'
    }
]
const dummyListAllItems = [
    {
        id: 1,
        item: 'Avocado',
        expiry_date: '5 days',
        measure: 'item'
    },
    {
        id: 2,
        item: 'Apples',
        expiry_date: '10 days',
        measure: 'item'
    },
    {
        id: 3,
        item: 'Bananas',
        expiry_date: '7 days',
        measure: 'item'
    },
    {
        id: 4,
        item: 'Pasta',
        expiry_date: '300 days',
        measure: 'gram'
    },
    {
        id: 5,
        item: 'Tomatoes',
        expiry_date: '10 days',
        measure: 'item'
    },
]

