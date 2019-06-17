const fetch = require('node-fetch');
const key= '6f03dc7bbfc8691e6052dd28b71260ad';
const token='558d2ff642d811695cc3aae89e347a88069ec4c306e29bb27f4e63a4bf72213c'
const trelloId='E1XSb6RL';
const paricularList='5ce55069bffb786eee14d8f5'

 function Data()
{
    return fetch(`https://api.trello.com/1/lists/${paricularList}/cards?key=${key}&token=${token}`)
    .then(res => res.json())
    .then(data => data.map(item=>item['id']));
}
var result = Data();
var dataofCardId=result.then(value =>console.log(value));


