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
                    drMagnesium = 350, drPhosphorus = 700, drFolate = 400;

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
                            <tbody>
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
                            </tbody>
                        </table>
                        <!-- pagination -->
                        <nav class="">
                            <ul class="pagination justify-content-center mb-2">
                                <li class="page-item">
                                    <a href="#" class="page-link">
                                        <span>&laquo;</span>
                                    </a>
                                </li>
                                <li class="page-item active">
                                    <a href="#" class="page-link">
                                        <span>1</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="#" class="page-link">
                                        <span>2</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="#" class="page-link">
                                        <span>3</span>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="#" class="page-link">
                                        <span>&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>`;
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