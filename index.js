const API_KEY = '6f03dc7bbfc8691e6052dd28b71260ad';
const TOKEN = '558d2ff642d811695cc3aae89e347a88069ec4c306e29bb27f4e63a4bf72213c';
const LIST_ID = '5ce905dacd7d8022cf6b0886';
/*------------------------for all cards of lists---------------------*/
const getCardId = () => {

   return fetch(`https://api.trello.com/1/lists/${LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`)
      .then(response => response.json())
      .then(data => data.map(itemId => itemId["id"]));
}
const cardIdResult = getCardId();

/*---------------------------- for all checklist of cards --------------*/
const getChecklistIds = (item) => {

   return Promise.all(item.map(current => {
      return fetch(`https://api.trello.com/1/cards/${current}/checklists?key=${API_KEY}&token=${TOKEN}`)
         .then(response => response.json())
         .then(data => data.reduce((result, list) => {
            let newList = list.checkItems.map(l => {
               return {
                  ...l,
                  cardId:list.idCard
               }
            })
            result = result.concat(newList);
            return result;
         }, []))
         .then(data => data)
   }))

}
var checkListId = cardIdResult.then(item => {
   return getChecklistIds(item);
});

/*------------------------------- for all Checklist-Item of Checklist ----------------*/
var checkListItem = checkListId.then(items => items)
checkListItem.then(current => {
   appendingList(current)
   checkListDelete();
   checkListAdd();
   checkListCross();
});

function newCollection(newItems) {
   let checklistsBigDivision = document.createElement('div');
   checklistsBigDivision.id = 'trellolist';
   var checklistParticularDivision = `<input type="checkbox" class="check"  data-cardId = ${newItems.cardId}  data-itemId = ${newItems.id} data-checkListid = ${newItems.idChecklist} data-state = ${newItems.state}>
                   <p class="lists"  data-itemId = ${newItems.id} data-cardId = ${newItems.cardId}>${newItems.name} </p>
                   <i class="far fa-window-close" data-itemId = ${newItems.id} data-checkListid = ${newItems.idChecklist} data-cardId = ${newItems.cardId} data-state = ${newItems.state}></i>`
   checklistsBigDivision.innerHTML = checklistParticularDivision;
   return checklistsBigDivision
}

const appendingList = (current) => {
   var items = current.flat();
   var checkListdomains = document.getElementById("checklists");
   items.map(i => {
      let newItems = newCollection(i);
      checkListdomains.appendChild(newItems);
   })
}

/*---------------------------- Adding new items -----------------------*/
const addCallBack = (events) => {
   // console.log(events);
   var textItem = document.getElementById('myInput');
   var name = textItem.value;
   var idChecklist = '5ce905e45860805731f95c3a'
   fetch(`https://api.trello.com/1/checklists/${idChecklist}/checkItems?name=${name}&key=${API_KEY}&token=${TOKEN}`, {
         method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
         let parent = document.getElementById('checklists')
         let element = newCollection(data);
         parent.prepend(element)
      });
}
const checkListAdd = () => {
   var dataAdd = document.getElementById('adding-button');
   dataAdd.addEventListener('click' || 'keyPress', addCallBack)
}

/*------------------------delete checklist item------------------------*/
const deleteChecklistItems = (events) => {

   if (events.target.className === 'far fa-window-close') {
      let itemId = events.target.dataset.itemid;
      let listId = events.target.dataset.checklistid;
      fetch(`https://api.trello.com/1/checklists/${listId}/checkItems/${itemId}?key=${API_KEY}&token=${TOKEN}`, {
            method: 'DELETE'
         })
         .then(resp => resp.json())
         .then(data => data)
      events.target.parentElement.remove();
   }
}
const checkListDelete = () => {
   var dataDelete = document.getElementById('checklists')
   dataDelete.addEventListener('click', deleteChecklistItems)
}



//****************----------- CROSS the CHecklist Items-------------****************
const CrossChecklistItems = (events) => {

   if (events.target.className === "check") {
      console.log(events)
      let element = events.target;
      let cardId = events.target.dataset.cardid;
      let itemId = events.target.dataset.itemid;
      let itemState = events.target.dataset.state;
      let result = document.querySelectorAll(".lists")
      for (let i = 0; i < result.length; i++) {
         if (itemId === result[i].dataset.itemid) {
            result[i].style.textDecoration = 'line-through';
            result[i].style.color = "aquamarine";
         }
      }
      if (events.target.checked === true) {
         if (itemState === 'incomplete') {
            itemState = 'complete'
            fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${itemState}&key=${API_KEY}&token=${TOKEN}`, {
               method: 'PUT'
            })
            element.setAttribute("data-state", itemState)
         }
      } else if (events.target.checked === false) {
         for (let i = 0; i < result.length; i++) {
            if (itemId === result[i].dataset.itemid) {
               result[i].style.textDecoration = 'none';
               result[i].style.color = "white";
            }
         }
         if (itemState === 'complete') {
            itemState = 'incomplete'
            fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${itemState}&key=${API_KEY}&token=${TOKEN}`, {
               method: 'PUT'
            })
            element.setAttribute("data-state", itemState)
         }
      }
   }
}
const checkListCross = () => {
   var checkCross = document.getElementById('checklists')
   checkCross.addEventListener('click', CrossChecklistItems)
}