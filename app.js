//Item Controller
const ItemCtrl = (function () {

    //Data Structure
    const data = {
        items: [],
        totalArray: []
    }
    //Fetch the items from the demo_api or from the USDA Api

    FetchItems.getItems().then(items => {

        let i = 0;
        while (items.list.item[i]) {

            data.items.push(items.list.item[i]);
            i++;
        }
    });


    return {
        getItems: function () {
            return data.items;
        },
        getTotalArray: function () {
            return data.totalArray;
        }
    }
})();

//App Controller

const App = (function () {

    const loadEventListeners = function () {
        //create a table with the avilable food options
        UICtrl.searchItem.addEventListener('keyup', (e) => {
            //Get input text
            const userText = e.target.value;

            UICtrl.selectItem.innerHTML = '';

            UICtrl.emptyFeedback.style.display = 'none';

            if (userText !== '') {

                ItemCtrl.getItems().forEach(item => {

                    if (item.name.indexOf(userText) != -1)

                        UICtrl.chooseItem(item.name);
                    else {
                        UICtrl.noFound();
                    }
                })
            }
        });

        //Select the choosen item and insert it to the DOM
        UICtrl.selectItem.addEventListener('click', (e) => {
            let item = e.target.textContent;
            UICtrl.emptyFeedback.style.display = 'none';
            UICtrl.selectItem.innerHTML = '';
            UICtrl.searchItem.value = '';
            UICtrl.addItem(item);
            UICtrl.getAnalysisTable(e.target.textContent);
        });

        //handle the search button
        UICtrl.searchButton.addEventListener('click', (e) => {

            if (UICtrl.searchItem.value == '') {

                UICtrl.emptyFeedback.style.display = 'block';
            }
        });
        //Show the table analysis for the selected item
        UICtrl.activeItem.addEventListener('click', (e) => {
            //handle the event click on the item name
            if (e.target.className.includes('add-cursor')) {

                let qty = e.target.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.value;

                UICtrl.activateItem(e.target.parentElement, UICtrl.addActiveClass);

                UICtrl.getAnalysisTable(e.target.textContent, qty);

            }

        });
        //handle the input event on change value
        UICtrl.activeItem.addEventListener('input', (e) => {

            if (e.target.className.includes('form-control')) {

                let qty = e.target.value;

                UICtrl.activateItem(e.target.parentElement.parentElement.parentElement.parentElement, UICtrl.addActiveClass);

                UICtrl.getAnalysisTable(e.target.parentElement.parentElement.parentElement.previousElementSibling.textContent, qty);

                console.log(e.target.parentElement.parentElement.parentElement.previousElementSibling.textContent);
            }
        })
        //Confirm delete all items
        UICtrl.confirmBtn.addEventListener('click', () => {
            console.log(UICtrl.addItems.firstElementChild);
            while (UICtrl.addItems.firstChild) {

                UICtrl.addItems.removeChild(UICtrl.addItems.firstChild);
            }
            localStorage.clear();
        });
        UICtrl.totalButton.addEventListener('click', () => {
            console.log(ItemCtrl.getTotalArray());
        });
    }

    //Public Methods
    return {
        init: function () {

            loadEventListeners();

            //console.log(items);
        }
    }
})();

App.init();
//testing the git repo