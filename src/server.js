import firebase from './Config/fbConfig.js';

const app = firebase.app()
export const database = app.database();

export function login(usernameInput, passwordInput) {
    return database.ref("Users").once('value').then((user) => {
        const users = user.val();
        const userFound = users.find(({ username }) => {
            return username === usernameInput;
        })
        if (userFound) {
            if (userFound.password === passwordInput) {
                sessionStorage.setItem('user_id', userFound.id);
                return { success: true, message: 'Success' }
            }
            else {
                return { success: false, message: 'Sorry, incorrect password' }
            }
        }
        else {
            return { success: false, message: "Can't find username" }
        }
    })
}

export function getAllInventory() {
    return database.ref("inventory").once('value').then((item) => {
        return item.val();
    })
}

export function addInventoryItem(id, quantity) {
    const userId = sessionStorage.getItem('user_id');
    let count = 0;
    database.ref(`Users/${userId}/inventory`).once('value')
        .then((item) => {
            const value = item.val();
            let alreadyInDatabase = false;
            value.forEach((item) => {
                if(item.id === id){
                    alreadyInDatabase = true
                }
            })
            count = value.length
            if(!alreadyInDatabase){
                return database.ref(`Users/${userId}/inventory/${count}`).set({
                    id,
                    quantity
                })
            } 
        })
}
export function throwAway(name){
    let id;
    console.log(name + " param")
    const userId = sessionStorage.getItem('user_id');
    database.ref(`inventory`).once('value').then((item)=>{
        item.val().forEach((data)=>{
            if(data.name === name ) {
                id = data.id;
            }
        })

        database.ref(`Users/${userId}/thrown`).once('value').then((count)=>{
            let thrownCount = (count.val() != 0) ? (count.val()) : (0); 
            database.ref(`Users/${userId}`).update({thrown:thrownCount+1});
            database.ref(`Users/${userId}/inventory/`).once('value').then((data) =>{
                let inventory = data.val();
                console.log(inventory)
                console.log(Object.keys(inventory));
                inventory.forEach((entry) => {
                    let index = inventory.indexOf(entry);
                    if(entry.id === id){
                        database.ref(`Users/${userId}/inventory/${index}`).remove();
                        return;
                    }
                });
            });
        });

    });
}
export function useItem(){
    const userId = sessionStorage.getItem('user_id');
    database.ref(`Users/${userId}`).update({used:1})

}