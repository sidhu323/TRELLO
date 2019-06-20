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
   .then(data =>  data);
 }))
}

var checkListItemId = checkListId.then(items => {
 return getCheckListItem(items.flat())
});


//FOR Appending the Checklists Items in HTML
checkListItemId.then(current=>{
   appendingList(current.flat())
   checkListDelete();

});


function newCollection(items){
   // console.log(items)
   let division=document.createElement('div');
   division.id='trellolist';
      let div2=`<input type="checkbox" class="check">
               <p class="lists">${items.name}</p>
               <i class="far fa-window-close" data-itemId=${items.id} data-checkListid= ${items.idChecklist} data-state=${items.state}></i>`
              
       division.innerHTML=div2;
       return division;
}

const appendingList=(current)=>{

   var checkdos=document.getElementById("checklists");
   current.map(items=>{ 
         let newItems= newCollection(items);
         checkdos.appendChild(newItems);
       })
}

/*---------------------------- Adding new items -----------------------*/
const addCallBack = (events) =>{
   // console.log(events);
   var textItem = document.getElementById('myInput');
   var name = textItem.value;
   var idChecklist = '5ce905e45860805731f95c3a'
   fetch(`https://api.trello.com/1/checklists/${idChecklist}/checkItems?name=${name}&key=${API_KEY}&token=${TOKEN}`,{method: 'POST'})
     .then(response => response.json())
       .then(data => {
         let parent = document.getElementById('checklists')
      let element =   createLI(data);
         parent.prepend(element)
  
       } );
  }
  const checkListAdd = () => {
   var dataAdd = document.getElementById('button');
  
   dataAdd.addEventListener('click',addCallBack)
  }

  /*------------------------delete checklist item------------------------*/
const deleteChecklistItems =  (events) => {

 if (events.target.className === 'far fa-window-close') {
   //  console.log(events);
   let itemId = events.target.dataset.itemid;
   let listId = events.target.dataset.checklistid;
  fetch(`https://api.trello.com/1/checklists/${listId}/checkItems/${itemId}?key=${API_KEY}&token=${TOKEN}`, {
       method: 'DELETE'
     })
     .then(resp => resp.json())
     .then(data=>data)
     events.target.parentElement.remove();
 }
}

const checkListDelete = () => {
 var dataDelete = document.getElementById('checklists')
 dataDelete.addEventListener('click', deleteChecklistItems)
}







