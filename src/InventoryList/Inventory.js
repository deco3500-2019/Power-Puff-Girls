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
            loading: true
        }
        this.search = this.search.bind(this);
        this.expand = this.expand.bind(this);
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
    }

    search(event) {
        const value = event.target.value;
        const searchResults = this.state.data.filter(({ name }) => {
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
    render() {
        const { clicked, loading, data } = this.state;
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
                {loading? 'Loading..' :
                    data.map(({ name, expiration }, index) => {
                    return <li key={index} className={'inventoryItem ' + (Number(clicked) === name ? 'expandedItem' : '')}
                        id={index} onClick={this.expand}>
                        {name}
                        {Number(clicked) === index ?
                            <p className="expandedSection">Lorem Ipsum dor si amet</p> : ''}
                    </li>
                })}
            </ul>
        </div>
        )
    }
}

export default Inventory;
