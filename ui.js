// UI Controller

const UICtrl = (function () {
    //Search input
    const searchItem = document.querySelector('.form-control');
    //Select the search table
    const selectItem = document.querySelector('.select-item');
    //Select the search button
    const searchButton = document.querySelector('#search');
    //Select the empty feedback
    const emptyFeedback = document.querySelector('.empty-feedback');
    //Select the table with choosen foods
    const activeItem = document.querySelector('#choosenFoods');
    //Select the body of the add items table
    const addItems = document.querySelector('#addItems');
    //Select div with the nutrition analysis table
    const divAnalysis = document.querySelector('#nutritionAnalysis');
    // Select confirm to clean all button
    const confirmBtn = document.querySelector('#confirmBtn');
    //Select total button
    const totalButton = document.querySelector('#getTotal');
    //Select the ul with pagination
    const pagination = document.querySelector('.pagination');
    //Select the ul with pagination by id
    const pagination1 = document.querySelector('#pagination1');
    //Select prev button for pagination
    const prevBtn = document.querySelector('#prev');
    //Select next button for pagination
    const nextBtn = document.querySelector('#next');
    //Select the children of the table
    let children = addItems.children;

    //Render the available options
    const chooseItem = (item, id) => {

        const trow = document.createElement('tr');
        trow.className = "select-item2";
        const td = document.createElement('td');
        td.id = id;
        td.innerText = item;
        trow.appendChild(td);

        selectItem.appendChild(trow);

    }
    //add items to the table
    const addItem = (item) => {

        // FetchItems.getItems().then(items => {

        //     items.foods.forEach(elem => {
        //         if (elem.food.desc.name == item) {

        //             let nutrientsArr = [];
        //             let nutrients = elem.food.nutrients;

        //             for (let j = 0; j < nutrients.length; j++) {

        //                 nutrientsArr.push(nutrients[j].value);
        //             }

        //             localStorage.setItem(elem.food.desc.ndbno, `${nutrientsArr}`);
        //         }
        //     });
        // });


        const tr = document.createElement('tr');
        tr.className = 'activeItem';
        tr.innerHTML = `<th scope="row" class="pt-3 add-cursor">${item}</th>
                                <td>
                                    <span class="bmb-form-group is-filled">
                                    <div class="input-group row d-flex justify-content-center">
                                        <input type="number" class="form-control text-right pt-0 col-6" value="0" disabled>
                                        <div class="input-group-append">
                                            <span class="input-group-text pt-0">g</span>
                                        </div>
                                    </div>
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group my-0">
                                        <button class="btn btn-outline-secondary py-0 my-0" type="button"><i
                                                class="fas fa-plus"></i></button>
                                        <button class="btn btn-outline-secondary py-0 my-0" type="button"><i
                                                class="fas fa-minus"></i></button>
                                    </div>
                                </td>
                                <td>
                                    <div class="btn-group my-0">
                                        <button class="btn btn-outline-secondary py-0 my-0" type="button"><i
                                                class="fas fa-times fa-lg"></i></button>
                                    </div>
                                </td>`;
        console.log(tr);
        addItems.insertBefore(tr, addItems.firstChild);

        children = addItems.children;

        return children;
    }
    //Create buttons for pagination
    const createBtn = (num) => {



        if (pagination.children[pagination.children.length - 2].firstElementChild.textContent < num) {
            const li = document.createElement('li');
            li.className = 'page-item';
            li.innerHTML = `<a href="#" class="page-link">
                <span class="nopointer">${num}</span></a>`;
            pagination.insertBefore(li, nextBtn);
        }
        if (pagination.children[pagination.children.length - 2].firstElementChild.textContent > num) {

            pagination1.removeChild(pagination1.children[num + 1]);
        }

    }
    //Feedback for no found elements
    const noFound = () => {
        emptyFeedback.textContent = 'No food items were found for your search.';
        emptyFeedback.style.display = 'block';
    }
    //the active element is shown its nutritional properties
    const addActiveClass = (active) => {

        active.className = 'activeItem';
    }
    const activateItem = (active, callback) => {

        for (let child of addItems.children) {
            child.classList.remove('activeItem');
        }

        callback(active);

    }
    //Calculate the percent value of daily recommandation
    const percentCalc = (value, dr) => {

        return Math.round((value * 100 / dr) * 100) / 100;
    }
    // Calculate the nutrients value based on quantity
    const valCalc = (value, qty) => {

        return Math.round((value * qty / 100) * 100) / 100;
    }
    const round = (num) => {
        return Math.round(num * 100) / 100;
    }
    const getAnalysisTable = (name, qty, id, total) => {

        FetchItems.getItems().then(items => {

            let nutrients;

            for (let i = 0; i < items.foods.length; i++) {

                //daily values recomended
                let drWater = 2500, drEnergy = 2000, drProtein = 50, drFat = 78, drCarbo = 275, drFiber = 28,
                    drSugars = 50, drSodium = 2300, drPotassium = 4700, drCalcium = 1000, drIron = 18,
                    drMagnesium = 350, drPhosphorus = 700, drFolate = 400, drZinc = 10, drVitc = 80, drRiboflavin = 1.2,
                    drThiamin = 1.1, drNiacin = 15, drVitb6 = 1.3, drVitarae = 800, drVitb12 = 2.4, drVite = 15, drVitd = 15,
                    drVitk = 115, drCaffeine = 150, drCholesterol = 300, drFatsaturated = 20;

                if (items.foods[i].food.desc.ndbno == id || name == 'Total') {

                    nutrients = items.foods[i].food.nutrients;

                    let storageNutrients = {};

                    for (let i = 0; i < nutrients.length; i++) {

                        let id = nutrients[i].nutrient_id;

                        if (name == 'Total') {
                            storageNutrients = total;
                        }
                        else {
                            storageNutrients[`id_${id}`] = valCalc(nutrients[i].value, qty);
                        }


                    }
                    console.log(storageNutrients);
                    console.log(round(storageNutrients.id_435));
                    //set the item to local storage
                    if (name != 'Total') {

                        localStorage.setItem(`${id}`, JSON.stringify(storageNutrients));
                    }



                    divAnalysis.innerHTML = `<div class="card mx-2 mx-xl-4">
                        <div class="mx-5 mt-2 text-brown">
                            <h1 class="cover-heading">NUTRITION FACTS</h1>
                            <hr id="thick_hr">
                        </div>
                        <h5>${name}</h5>

                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Nutrient</th>
                                    <th scope="col">Unit</th>
                                    <th scope="col">Value</th>
                                    <th scope="col"> * % Daily Value</th>
                                </tr>
                            </thead>
                            <tbody id="nutrientsItems">
                                <tr>
                                    <td>Water</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_255)}</td>
                                    <td>${percentCalc(storageNutrients.id_255, drWater)}</td>
                                </tr>
                                <tr>
                                    <td>Energy</td>
                                    <td>kcal</td>
                                    <td>${round(storageNutrients.id_208)}</td>
                                    <td>${percentCalc(storageNutrients.id_208, drEnergy)}</td>
                                </tr>
                                <tr>
                                    <td>Protein</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_203)}</td>
                                    <td>${percentCalc(storageNutrients.id_203, drProtein)}</td>
                                </tr>
                                <tr>
                                    <td>Total lipid(fat)</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_204)}</td>
                                    <td>${percentCalc(storageNutrients.id_204, drFat)}</td>
                                </tr>
                                <tr>
                                    <td>Carbohydrate, by difference</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_205)}</td>
                                    <td>${percentCalc(storageNutrients.id_205, drCarbo)}</td>
                                </tr>
                                <tr>
                                    <td>Fiber, total dietary</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_291)}</td>
                                    <td>${percentCalc(storageNutrients.id_291, drFiber)}</td>
                                </tr>
                                <tr>
                                    <td>Sugars, total</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_269)}</td>
                                    <td>${percentCalc(storageNutrients.id_269, drSugars)}</td>
                                </tr>
                                <tr>
                                    <td>Calcium, Ca</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_301)}</td>
                                    <td>${percentCalc(storageNutrients.id_301, drCalcium)}</td>
                                </tr>
                                <tr>
                                    <td>Iron, Fe</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_303)}</td>
                                    <td>${percentCalc(storageNutrients.id_303, drIron)}</td>
                                </tr>
                                <tr>
                                    <td>Magnesium, Mg</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_304)}</td>
                                    <td>${percentCalc(storageNutrients.id_304, drMagnesium)}</td>
                                </tr>
                                <tr>
                                    <td>Phosphorus, P</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_305)}</td>
                                    <td>${percentCalc(storageNutrients.id_305, drPhosphorus)}</td>
                                </tr>
                                <tr>
                                    <td>Potassium, K</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_306)}</td>
                                    <td>${percentCalc(storageNutrients.id_306, drPotassium)}</td>
                                </tr>
                                <tr>
                                    <td>Sodium, Na</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_307)}</td>
                                    <td>${percentCalc(storageNutrients.id_307, drSodium)}</td>
                                </tr>
                                <tr>
                                    <td>Zinc, Zn</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_309)}</td>
                                    <td>${percentCalc(storageNutrients.id_309, drZinc)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin C, total ascorbic acid</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_401)}</td>
                                    <td>${percentCalc(storageNutrients.id_404, drVitc)}</td>
                                </tr>
                                 <tr>
                                    <td>Thiamin</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_404)}</td>
                                    <td>${percentCalc(storageNutrients.id_404, drThiamin)}</td>
                                </tr>
                                 <tr>
                                    <td>Riboflavin</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_405)}</td>
                                    <td>${percentCalc(storageNutrients.id_405, drRiboflavin)}</td>
                                </tr>
                                 <tr>
                                    <td>Niacin</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_406)}</td>
                                    <td>${percentCalc(storageNutrients.id_406, drNiacin)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin B-6</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_415)}</td>
                                    <td>${percentCalc(storageNutrients.id_415, drVitb6)}</td>
                                </tr>
                                 <tr>
                                    <td>Folate, DFE</td>
                                    <td>&micro;g</td>
                                    <td>${round(storageNutrients.id_435)}</td>
                                    <td>${percentCalc(storageNutrients.id_435, drFolate)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin B-12</td>
                                    <td>&micro;g</td>
                                    <td>${round(storageNutrients.id_418)}</td>
                                    <td>${percentCalc(storageNutrients.id_418, drVitb12)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin A, RAE</td>
                                    <td>&micro;g</td>
                                    <td>${round(storageNutrients.id_320)}</td>
                                    <td>${percentCalc(storageNutrients.id_320, drVitarae)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin E (alpha-tocopherol) </td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_323)}</td>
                                    <td>${percentCalc(storageNutrients.id_323, drVite)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin D (D2 + D3)</td>
                                    <td>&micro;g</td>
                                    <td>${round(storageNutrients.id_328)}</td>
                                    <td>${percentCalc(storageNutrients.id_328, drVitd)}</td>
                                </tr>
                                 <tr>
                                    <td>Vitamin K (phylloquinone)</td>
                                    <td>&micro;g</td>
                                    <td>${round(storageNutrients.id_430)}</td>
                                    <td>${percentCalc(storageNutrients.id_430, drVitk)}</td>
                                </tr>
                                 <tr>
                                    <td>Fatty acids, total saturated</td>
                                    <td>g</td>
                                    <td>${round(storageNutrients.id_606)}</td>
                                    <td>${percentCalc(storageNutrients.id_606, drFatsaturated)}</td>
                                </tr>
                                 <tr>
                                    <td>Cholesterol</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_601)}</td>
                                    <td>${percentCalc(storageNutrients.id_601, drCholesterol)}</td>
                                </tr>
                                 <tr>
                                    <td>Caffeine</td>
                                    <td>mg</td>
                                    <td>${round(storageNutrients.id_262)}</td>
                                    <td>${percentCalc(storageNutrients.id_262, drCaffeine)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- pagination -->
                        <nav class="">
                            <ul class="pagination justify-content-center mb-2" id="pagination2">
                                <li class="page-item first" id="prev2">
                                    <a href="javascript:;" class="page-link">
                                        <span class="nopointer">&laquo;</span>
                                    </a>
                                </li>
                                <li class="page-item active">
                                    <a href="javascript:;" class="page-link">
                                        <span>1</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="javascript:;" class="page-link">
                                        <span>2</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="javascript:;" class="page-link">
                                        <span>3</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="javascript:;" class="page-link">
                                        <span>4</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="javascript:;" class="page-link">
                                        <span>5</span>
                                    </a>
                                </li>
                                <li class="page-item last" id="next2">
                                    <a href="javascript:;" class="page-link">
                                        <span class="nopointer">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>`;

                    let pagination2 = document.querySelector('#pagination2');

                    let nutrientsItems = document.querySelector('#nutrientsItems').children;

                    let prevBtn2 = document.querySelector('#prev2');
                    let nextBtn2 = document.querySelector('#next2');

                    const paginate = (page = 1) => {

                        let currentPage = page;

                        let recordsPerPage = 6;

                        if (currentPage == 1) {
                            prevBtn2.style.visibility = "hidden";
                        } else {
                            prevBtn2.style.visibility = "visible";
                        }

                        if (currentPage == 5) {
                            nextBtn2.style.visibility = "hidden";
                        } else {
                            nextBtn2.style.visibility = "visible";
                        }

                        for (let i = 0; i < nutrientsItems.length; i++) {
                            nutrientsItems[i].style.display = 'none';

                        }

                        for (let i = (currentPage - 1) * recordsPerPage; i < (currentPage * recordsPerPage); i++) {

                            if (nutrientsItems[i]) {
                                nutrientsItems[i].style.display = 'table-row';
                                //if item is last one on page and it's removed, then paginate again with the previous page
                            }


                            else break;

                        }
                    };
                    paginate();

                    pagination2.addEventListener('click', (e) => {
                        // console.log(e.target.textContent);

                        let activeItem = 1;
                        for (let item of pagination2.children) {

                            if (item.classList.contains('active')) {

                                activeItem = item.textContent;
                            }
                            item.classList.remove('active');
                        }

                        //handle the html entities
                        let text = e.target.textContent;
                        if (e.target.parentElement.classList.contains('first'))
                            text = text.replace(text, 'laquo');

                        if (e.target.parentElement.classList.contains('last'))
                            text = text.replace(text, 'raquo');

                        if (text == 'laquo') {
                            activeItem--;
                        } else if (text == 'raquo') {
                            activeItem++;

                        } else {
                            activeItem = e.target.textContent;
                        }

                        paginate(activeItem);
                        //console.log(activeItem);
                        //console.log(pagination2.children[2]);
                        pagination2.children[Number(activeItem)].classList.add('active');

                    });

                    break;
                } else {
                    emptyAnalysis();
                }

            }

        });

    }
    const emptyAnalysis = () => {

        divAnalysis.innerHTML = `<div class="card mx-2 mx-xl-4">
            <div class="mx-5 mt-2 text-brown">
                <h1 class="cover-heading">NUTRITION FACTS</h1>
                <hr id="thick_hr">
            </div>
            <h5>No data available!</h5>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Nutrient</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Value</th>
                        <th scope="col"> * % Daily Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Water</td>
                        <td>g</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Energy</td>
                        <td>kcal</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Protein</td>
                        <td>g</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Total lipid(fat)</td>
                        <td>g</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Carbohydrate, by difference</td>
                        <td>g</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Fiber, total dietary</td>
                        <td>g</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    }


    //Public methods
    return {

        searchItem,
        selectItem,
        chooseItem,
        pagination,
        pagination1,
        children,
        searchButton,
        emptyFeedback,
        activeItem,
        totalButton,
        addItems,
        confirmBtn,
        prevBtn,
        nextBtn,
        addItem,
        noFound,
        activateItem,
        createBtn,
        addActiveClass,
        getAnalysisTable,
        emptyAnalysis
    }

})();