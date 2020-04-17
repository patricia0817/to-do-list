//to-do-list
//am o lista in care pot sa adaug items de to do, pot sa le sterg, sau sa le marchez ca done
//lista -lifo - ultimu adaugat sa fie primu de sus
//sa faca display numai la ultimele 6
//lista sa se salveze (sa nu o pierd cand inchid browseru)
const inputField = document.querySelector('.input-field');
const form = document.querySelector('.input-form');
const itemsListNode = document.querySelector('.list');
let items = [];
const url = 'https://jsonplaceholder.typicode.com/todos';

function retriveData(url, itemsListNode, callback, items) {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const dataItems = data.map(item => {
        items.push({ value: item.title, isChecked: item.completed });
      });
      callback(items, itemsListNode);
    });
}

retriveData(url, itemsListNode, renderList, items);

function postData(url, data, list, itemsListNode, callback) {
  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      callback(data, list);
      renderList(list, itemsListNode);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

form.addEventListener('submit', e => {
  handleSubmit(e, items, itemsListNode, inputField);
});

function handleSubmit(e, items, itemsListNode, inputField) {
  e.preventDefault();
  addItemToList(inputField, items, itemsListNode);
  renderList(items, itemsListNode);
}

function addItemToList(field, list, itemsListNode) {
  let inputValue = field.value;
  const item = {
    value: inputValue,
    isChecked: false
  };
  if (inputValue) {
    postData(url, item, list, itemsListNode, insertItem);
    field.value = '';
    // const item = {
    //   value: inputValue,
    //   isChecked: false
    // };
    // list.unshift(item);
    // postData(url, item);
    // field.value = '';
  }
}

function insertItem(item, list) {
  list.unshift(item);
}

function renderList(list, itemsListNode) {
  itemsListNode.innerHTML = '';
  list.slice(0, 6).forEach((item, index) => {
    const itemElement = document.createElement('li');
    const itemElementValue = document.createElement('p');
    const commandsWrapper = document.createElement('span');
    const remove = document.createElement('button');
    const checkItem = document.createElement('input');

    itemsListNode.appendChild(itemElement);
    itemElementValue.innerHTML = item.value;
    itemElement.appendChild(itemElementValue);

    commandsWrapper.classList.add('commands-wrapper');
    itemElement.appendChild(commandsWrapper);

    checkItem.dataset.itemId = index;
    checkItem.type = 'checkbox';
    // checkItem.addEventListener('click', () => {
    //   toggleItemCheck(index);
    //   renderList(list, itemsListNode);
    // });
    if (item.isChecked) {
      checkItem.checked = true;
    }
    commandsWrapper.appendChild(checkItem);

    // remove.innerHTML = 'Remove';
    remove.dataset.itemId = index;
    remove.addEventListener('click', () => {
      removeItemFromList(index);
      renderList(list, itemsListNode);
    });
    commandsWrapper.appendChild(remove);
    // ------------------------
    const checkmark = document.createElement('span');
    checkmark.classList.add('checkmark');
    commandsWrapper.appendChild(checkmark);
    checkmark.addEventListener('click', () => {
      toggleItemCheck(index);
      renderList(list, itemsListNode);
    });
    // ------------------------
  });

  persist(list);
}

function toggleItemCheck(index) {
  if (items[index].isChecked === false) {
    items[index].isChecked = true;
  } else {
    items[index].isChecked = false;
  }
}

function removeItemFromList(index) {
  items.splice(index, 1);
}

function persist(list) {
  localStorage.setItem('to-do-list', JSON.stringify(list));
}
