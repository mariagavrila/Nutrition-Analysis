//Item Controller
const ItemCtrl = (function () {

    //Data Structure
    const data = {
        items: [],
        totalArray: []
    }
    //Fetch the items from the demo_api or from the USDA Api
    // TODO get dynamics items from the API
    FetchItems.getItems().then(items => {

        let i = 0;
        while (items.list.item[i]) {
            data.items.push(items.list.item[i]);
            i++;
        }
    });

    async function formatString(string) {
        return string.toLowerCase()
    }

    return {
        getItems: function () {
            return data.items;
        },
        paginate: function (items, page, activeItem = 1) {

            let currentPage = activeItem;

            let recordsPerPage = 5;

            let numPages = () => {
                return Math.ceil(items.length / recordsPerPage);
            }

            //Handle the next and previous buttons


            if (formatString(page) === formatString('raquo')) {
                currentPage++;
            } else if (formatString(page) === formatString('laquo')) {
                currentPage--;

            } else {
                currentPage = page;
            }

            UICtrl.createBtn(numPages());

            if (page === 1) {
                UICtrl.prevBtn.style.visibility = "hidden";
            } else {
                UICtrl.prevBtn.style.visibility = "visible";
            }

            if (page === numPages()) {
                UICtrl.nextBtn.style.visibility = "hidden";
            } else {
                UICtrl.nextBtn.style.visibility = "visible";
            }

            for (let i = 0; i < items.length; i++) {
                items[i].style.display = 'none';
            }

            for (let i = (currentPage - 1) * recordsPerPage; i < (currentPage * recordsPerPage); i++) {

                if (items[i]) {
                    items[i].style.display = 'table-row';
                    //if item is last one on page and it's removed, then paginate again with the previous page
                } else if (!items[i] && i % 5 === 0) {

                    for (let item of UICtrl.pagination.children) {

                        if (item.classList.contains('active')) {

                            item.classList.remove('active');
                        }
                        if (item.firstElementChild.textContent === page - 1)
                            item.classList.add('active');
                    }
                    ItemCtrl.paginate(UICtrl.addItems.children, page - 1);
                } else break;

            }
        }
    }
})();

//App Controller

const App = (function () {

    const loadEventListeners = function () {
        //create a table with the avilable food options
        UICtrl.searchItem.addEventListener('keyup', (e) => {
            //Get input text
            const userText = e.target.value.toLowerCase();

            UICtrl.selectItem.innerHTML = '';

            UICtrl.emptyFeedback.style.display = 'none';

            if (userText !== '') {

                ItemCtrl.getItems().forEach(item => {

                    let name = item.name.toLowerCase();

                    if (name.indexOf(userText) != -1) {

                        UICtrl.chooseItem(item.name, item.ndbno);
                    } else {
                        UICtrl.noFound();
                    }
                })
            }
        });

        //Select the choosen item and insert it to the DOM
        UICtrl.selectItem.addEventListener('click', (e) => {
            let item = e.target.textContent;
            let id = e.target.id;
            UICtrl.emptyFeedback.style.display = 'none';
            UICtrl.selectItem.innerHTML = '';
            UICtrl.searchItem.value = '';
            //check if item already it's in the list, if is, show the page where it is and activate it
            for (let i = 0; i < UICtrl.addItems.children.length; i++) {

                let element = UICtrl.addItems.children[i];

                if (element.firstElementChild.id === id) {

                    item = null;

                    for (let item of UICtrl.addItems.children) {

                        if (item.classList.contains('activeItem')) {

                            item.classList.remove('activeItem');
                        }
                    }
                    console.log(element);
                    element.classList.add('activeItem');
                    //to find item's page, use the i variable and divide by the records per page
                    let recordsPerPage = 5;
                    //avoid the division with 0, for the 0 element the page will always be 1
                    if (i == 0) {
                        ItemCtrl.paginate(UICtrl.children, 1);
                    } else {
                        ItemCtrl.paginate(UICtrl.children, Math.ceil(i / recordsPerPage));
                    }
                    let qty = element.children[1].firstElementChild.firstElementChild.firstElementChild.value;
                    UICtrl.getAnalysisTable(element.firstElementChild.textContent, qty, element.firstElementChild.id);
                    break;

                }

            }
            //if the item is already in the list, the item is set to null
            if (item) {
                //remove active class for all items
                for (let child of UICtrl.addItems.children) {
                    child.classList.remove('activeItem');
                }
                ItemCtrl.paginate(UICtrl.addItem(e.target.textContent), 1);
                UICtrl.getAnalysisTable(e.target.textContent, 100, e.target.id);

            }

        });
        //Handle the pagination
        UICtrl.pagination.addEventListener('click', (e) => {
            e.stopPropagation();

            let text = e.target.textContent;

            let activeItem;

            //Handle the active class from pagination
            for (let item of e.target.parentElement.parentElement.children) {

                if (item.classList.contains('active')) {
                    activeItem = item.firstElementChild.textContent;
                    item.classList.remove('active');

                    //Handle the html entity &raquo; and &laquo;
                    if (e.target.classList.contains('last')) {
                        text = text.replace(text, 'raquo');

                        item.nextElementSibling.classList.add('active');
                        break;
                    } else if (e.target.classList.contains('first')) {
                        text = text.replace(text, 'laquo');
                        item.previousElementSibling.classList.add('active');
                        break;
                    } else {
                        e.target.parentElement.classList.add('active');
                        break;
                    }
                }
            }

            ItemCtrl.paginate(UICtrl.children, text, activeItem);

        });

        //handle the search button
        UICtrl.searchButton.addEventListener('click', (e) => {

            if (UICtrl.searchItem.value === '') {

                UICtrl.emptyFeedback.style.display = 'block';
            }
        });
        //Show the table analysis for the selected item
        UICtrl.activeItem.addEventListener('click', (e) => {
            //handle the event click on the item name
            if (e.target.className.includes('add-cursor')) {

                //The quantity from the input
                let qty = e.target.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.value;

                UICtrl.activateItem(e.target.parentElement, UICtrl.addActiveClass);
                if (!e.target.id) {
                    UICtrl.emptyAnalysis();
                }
                UICtrl.getAnalysisTable(e.target.textContent, qty, e.target.id);

            }

        });
        //handle the input event on change value
        UICtrl.activeItem.addEventListener('input', (e) => {

            if (e.target.className.includes('form-control')) {

                let td = e.target.parentElement.parentElement.parentElement;

                let qty = e.target.value;

                UICtrl.activateItem(td.parentElement, UICtrl.addActiveClass);

                UICtrl.getAnalysisTable(td.previousElementSibling.textContent, qty, td.previousElementSibling.id);

            }

        });
        //Handle the plus, minus and remove buttons
        UICtrl.activeItem.addEventListener('click', (e) => {


            //console.log(e.target);
            if (e.target.className.includes('fa-plus')) {

                let td = e.target.parentElement.parentElement.parentElement;

                let input = td.previousElementSibling.firstElementChild.firstElementChild.firstElementChild;

                let inputVal = input.value;

                inputVal = Number(inputVal);

                inputVal += 10;

                //if input is disabled, can't modify the value
                if (input.disabled) {

                    input.value = 0;
                } else {

                    input.value = inputVal;
                }
                UICtrl.activateItem(td.parentElement, UICtrl.addActiveClass);

                //if element has no id, get the empty table
                if (!td.parentElement.parentElement.firstElementChild.firstElementChild.id) {
                    UICtrl.emptyAnalysis();
                }

                UICtrl.getAnalysisTable(td.parentElement.firstElementChild.textContent, inputVal, td.parentElement.firstElementChild.id);

            }
            if (e.target.className.includes('fa-minus')) {

                let td = e.target.parentElement.parentElement.parentElement;

                let input = td.previousElementSibling.firstElementChild.firstElementChild.firstElementChild;

                let inputVal = input.value;

                inputVal = Number(inputVal);

                inputVal -= 10;
                //if input is disabled, can't modify the value
                if (input.disabled) {

                    input.value = 0;
                } else {
                    //if the input value is 0, don't get negative numbers
                    if (input.value === 0) {
                        inputVal = 0;
                    }
                    input.value = inputVal;
                }

                UICtrl.activateItem(td.parentElement, UICtrl.addActiveClass);
                //if element has no id, get the empty table
                if (!td.parentElement.parentElement.firstElementChild.firstElementChild.id) {
                    UICtrl.emptyAnalysis();
                }

                UICtrl.getAnalysisTable(td.parentElement.firstElementChild.textContent, inputVal, td.parentElement.firstElementChild.id);

            }
            if (e.target.className.includes('fa-times')) {

                let tb = e.target.parentElement.parentElement.parentElement.parentElement;
                tb.parentElement.removeChild(tb);
                console.log(tb);
                localStorage.removeItem(tb.firstElementChild.id);

                for (let item of UICtrl.pagination1.children) {

                    if (item.classList.contains('active')) {
                        activeItem = item.firstElementChild.textContent;
                        // console.log(activeItem);
                        // console.log(UICtrl.addItems.children);
                        ItemCtrl.paginate(UICtrl.addItems.children, activeItem);
                    }
                }

                if (UICtrl.addItems.children.length === 0) {

                    UICtrl.emptyAnalysis();
                    UICtrl.pagination1.innerHTML = '';
                }
            }
        });
        //Confirm delete all items
        UICtrl.confirmBtn.addEventListener('click', () => {

            while (UICtrl.addItems.firstChild) {

                UICtrl.addItems.removeChild(UICtrl.addItems.firstChild);
            }
            localStorage.clear();
            UICtrl.emptyAnalysis();
            UICtrl.pagination1.innerHTML = '';
        });

        UICtrl.totalButton.addEventListener('click', () => {

            let totalArray = [];

            keys = Object.keys(localStorage)

            i = keys.length;

            while (i--) {
                totalArray.push(JSON.parse(localStorage.getItem(keys[i])));
            }

            //let result = nutrientsRes();
            let result = nutrientsRes();

            for (let i = 0; i < totalArray.length; i++) {

                let num = Number(totalArray[i].id_203);
                console.log(result.id_203);
                console.log(num + ' num');
                //console.log(Math.round(Number(totalArray[i].id_203) * 100) / 100);


                result.id_255 += Number(totalArray[i].id_255);
                result.id_208 += Number(totalArray[i].id_208);
                result.id_203 += Number(totalArray[i].id_203);
                result.id_204 += Number(totalArray[i].id_204);
                result.id_205 += Number(totalArray[i].id_205);
                result.id_291 += Number(totalArray[i].id_291);
                result.id_269 += Number(totalArray[i].id_269);
                result.id_301 += Number(totalArray[i].id_301);
                result.id_303 += Number(totalArray[i].id_303);
                result.id_304 += Number(totalArray[i].id_304);
                result.id_305 += Number(totalArray[i].id_305);
                result.id_306 += Number(totalArray[i].id_306);
                result.id_307 += Number(totalArray[i].id_307);
                result.id_309 += Number(totalArray[i].id_309);
                result.id_401 += Number(totalArray[i].id_401);
                result.id_404 += Number(totalArray[i].id_404);
                result.id_405 += Number(totalArray[i].id_405);
                result.id_406 += Number(totalArray[i].id_406);
                result.id_415 += Number(totalArray[i].id_415);
                result.id_435 += Number(totalArray[i].id_435);
                result.id_418 += Number(totalArray[i].id_418);
                result.id_320 += Number(totalArray[i].id_320);
                result.id_323 += Number(totalArray[i].id_323);
                result.id_328 += Number(totalArray[i].id_328);
                result.id_430 += Number(totalArray[i].id_430);
                result.id_606 += Number(totalArray[i].id_606);
                result.id_601 += Number(totalArray[i].id_601);
                result.id_262 += Number(totalArray[i].id_262);
            }
            UICtrl.getAnalysisTable('Total', null, null, result);

            //console.log(result);

        });
    }

    //Public Methods
    return {
        init: window.onload = function () {

            localStorage.clear();

            loadEventListeners();

            ItemCtrl.paginate(UICtrl.children, 1);

            UICtrl.activateItem(UICtrl.addItems.firstElementChild, UICtrl.addActiveClass);

            UICtrl.getAnalysisTable(UICtrl.addItems.firstElementChild.firstElementChild.textContent, 100, UICtrl.addItems.firstElementChild.firstElementChild.id);

            FetchItems.getItems().then(items => {

                let nutrients;

                for (let i = 0; i < items.foods.length; i++) {

                    let nutrientsArr = {};

                    nutrients = items.foods[i].food.nutrients;

                    for (let j = 0; j < nutrients.length; j++) {

                        let id = nutrients[j].nutrient_id;

                        nutrientsArr[`id_${id}`] = nutrients[j].value;
                    }
                    // console.log(nutrientsArr);

                    localStorage.setItem(items.foods[i].food.desc.ndbno, JSON.stringify(nutrientsArr));

                }
            });

        }
    }
})();

App.init();
