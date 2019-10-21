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

export async function addInventoryItem(id, quantity) {
    const userId = sessionStorage.getItem('user_id');
    let count = 0;

    return database.ref(`Users/${userId}/inventory`).once('value')
        .then((item) => {
            const value = item.val();
            let alreadyInDatabase = false;
            value.forEach((item) => {
                if (item.id === id) {
                    alreadyInDatabase = true
                }
            })
            count = value.length;
            console.log(id, alreadyInDatabase, count)
            if (!alreadyInDatabase) {
                return database.ref(`Users/${userId}/inventory/${count}`).set({
                    id,
                    quantity
                })
            }
        })
}
export function throwItem(id) {
    const userId = sessionStorage.getItem('user_id');

    return database.ref(`Users/${userId}/thrown`).once('value').then((count) => {
        let thrownCount = (count.val() !== 0) ? (count.val()) : (0);
        database.ref(`Users/${userId}`).update({ thrown: thrownCount + 1 });

        database.ref(`Users/${userId}/inventory/`).once('value').then(() => {
            return database.ref(`Users/${userId}/inventory/${id}`).remove().then(() => {
                database.ref(`Users/${userId}/inventory/`).once('value').then((newInventoryData) => {
                    //Going through all data to update the index
                    let list = [];
                    newInventoryData.val().forEach(newData => {
                        //To ignore the missing indexes
                        list = [...list, newData];
                    })
                    database.ref(`Users/${userId}/inventory`).set(
                        list //Update the database with correct indexes
                    )
                });
            });
        });
    });
}
export function useItem(id) {
    const userId = sessionStorage.getItem('user_id');

    return database.ref(`Users/${userId}/used`).once('value').then((count) => {
        let usedCount = (count.val() !== 0) ? (count.val()) : (0);
        database.ref(`Users/${userId}`).update({ used: usedCount + 1 });

        database.ref(`Users/${userId}/inventory/`).once('value').then(() => {
            return database.ref(`Users/${userId}/inventory/${id}`).remove().then(() => {
                database.ref(`Users/${userId}/inventory/`).once('value').then((newInventoryData) => {
                    //Going through all data to update the index
                    let list = [];
                    newInventoryData.val().forEach(newData => {
                        //To ignore the missing indexes
                        list = [...list, newData];
                    })
                    database.ref(`Users/${userId}/inventory`).set(
                        list //Update the database with correct indexes
                    )
                });
            });
        });
    });

}

export function getProfilePic() {
    const userId = sessionStorage.getItem('user_id');
    return database.ref(`Users/${userId}/profilepic`).once('value').then(profilepic => {
        return profilepic.val();
    })
}
export function getUserName() {
    const userId = sessionStorage.getItem('user_id');
    return database.ref(`Users/${userId}/username`).once('value').then(userName => {
        return userName.val();
    })
}
export function getThrownUsed() {
    const userId = sessionStorage.getItem('user_id');
    return database.ref(`Users/${userId}`).once('value').then(user => {
        const userItem = user.val();
        return { thrown: userItem.thrown, used: userItem.used }
    })
}

export function convertToArray(list) {
    let newList = [];
    Object.keys(list).forEach((key) => {
        newList = [...newList, { listIndex: key, ...list[key] }];
    })
    return newList;
}

export function getTips(id) {
    return database.ref(`inventory/${id}/tips`).on('value', (tips) => {
        return tips.val();
    })
}

export function saveTips(text, id, count) {
    const userId = sessionStorage.getItem('user_id');
    return database.ref(`inventory/${id}/tips/${count}`).set({
        text,
        rating: 0,
        userId
    })
}
export function incrementQuantity(id) {
    const userId = sessionStorage.getItem('user_id');

    database.ref(`Users/${userId}/inventory/${id}/quantity`).once('value').then((count) => {
        let quantityCount = (count.val() !== 0) ? (count.val()) : (0);
        database.ref(`Users/${userId}/inventory/${id}`).update({ quantity: quantityCount + 0.5 });

    });
}
export function decrementQuantity(id) {
    const userId = sessionStorage.getItem('user_id');

    database.ref(`Users/${userId}/inventory/${id}/quantity`).once('value').then((count) => {
        let quantityCount = (count.val() !== 0) ? (count.val()) : (0);
        database.ref(`Users/${userId}/inventory/${id}`).update({ quantity: quantityCount - 0.5 });

    });
}

export function changeRating(data) {
    const { itemId, number, commentId } = data;
    database.ref(`inventory/${itemId}/tips/${commentId}/rating`).once('value').then((count) => {
        let rating = (count.val() !== 0) ? (count.val()) : (0);
        database.ref(`inventory/${itemId}/tips/${commentId}`).update({ rating: (rating + number) });
    })
}

export function addGroceryItem(id, quantity) {
    const userId = sessionStorage.getItem('user_id');
    let count = 0;
    return database.ref(`Users/${userId}/groceryList`).once('value')
        .then((item) => {
            const value = item.val();
            let alreadyInDatabase = false;
            value.forEach((item) => {
                if (item.id === id) {
                    alreadyInDatabase = true
                }
            })
            count = value.length
            if (!alreadyInDatabase) {
                return database.ref(`Users/${userId}/groceryList/${count}`).set({
                    id,
                    quantity
                })
            }
        })
}
export async function purchaseItem(itemList = []) {
    while (itemList.length > 0) {
        let item = itemList.pop();
        await addInventoryItem(item.id, item.quantity);
    }

}

export async function deleteItems(itemList = []) {
    while (itemList.length > 0) {
        let item = itemList.pop();
        await deleteItem(item.id);
    }
}

async function deleteItem(id) {
    const userId = sessionStorage.getItem('user_id');
    return database.ref(`Users/${userId}/groceryList/`).once('value').then(() => {
        return database.ref(`Users/${userId}/groceryList/${id}`).remove().then(() => {
            database.ref(`Users/${userId}/groceryList/`).once('value').then((newGroceryListData) => {
                //Going through all data to update the index
                let list = [];
                newGroceryListData = convertToArray(newGroceryListData.val());
                newGroceryListData.forEach(newData => {
                    //To ignore the missing indexes
                    list = [...list, newData];
                })
                database.ref(`Users/${userId}/groceryList`).set(
                    list //Update the database with correct indexes
                )
            });
        });
    });
}