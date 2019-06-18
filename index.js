const API_KEY = '6f03dc7bbfc8691e6052dd28b71260ad';
const TOKEN = '558d2ff642d811695cc3aae89e347a88069ec4c306e29bb27f4e63a4bf72213c';
const LIST_ID = '5ce55069bffb786eee14d8f5';
// const fetch=require('node-fetch')
/*------------------------for all cards of lists---------------------*/
const getCardId = () => {

 return fetch(`https://api.trello.com/1/lists/${LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`)
   .then(response => response.json())
   .then(data => data.map(itemId => itemId["id"]));
}
const cardIdResult = getCardId();


/*---------------------------- for all checklist of cards --------------*/
const getChecklistIds = (array) => {

return Promise.all(array.map(current => {
   return fetch(`https://api.trello.com/1/cards/${current}/checklists?key=${API_KEY}&token=${TOKEN}`)
     .then(response => response.json())
     .then(data => data.map(itemId => itemId["id"]));
 }))
}

var checkListId = cardIdResult.then(item => {
    let array = item
    return getChecklistIds(array);
   });

// /*------------------------------- for all Checklist-Item of Checklist ----------------*/
const getCheckListItem = (items) => {

 return Promise.all(items.map(current => {
   return fetch(`https://api.trello.com/1/checklists/${current}/checkItems?key=${API_KEY}&token=${TOKEN}`)
   .then(resp => resp.json())
   .then(data =>  data.map(items => items["name"]));
 }))
}

var checkListItemId = checkListId.then(items => {
 return getCheckListItem(items.flat())
});

checkListItemId.then(current=>appendingList(current));

function appendingList(item){

     item.flat().map(i=>{
        var node=document.createElement('li');
        var textnode=document.createTextNode(i);
        node.append(textnode);
        document.getElementById("node-list").append(node);
    })
}