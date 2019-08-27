// UI Controller

const UICtrl = (function () {
    //Search input
    const searchItem = document.querySelector('.form-control');
    //Select the search table
    const selectItem = document.querySelector('.select-item');
    //Select the body of the add items table
    const addItems = document.querySelector('#addItems');
    //Select the search button
    const searchButton = document.querySelector('#search');
    //Select the empty feedback
    const emptyFeedback = document.querySelector('.empty-feedback');
    //Select the table with choosen foods
    const activeItem = document.querySelector('#choosenFoods');
    //Select div with the nutrition analysis table
    const divAnalysis = document.querySelector('#nutritionAnalysis');
    // Select confirm to clean all button
    const confirmBtn = document.querySelector('#confirmBtn');
    //Select total button
    const totalButton = document.querySelector('#getTotal');
    //Render the available options
    const chooseItem = (item) => {

        const tr = document.createElement('tr');
        tr.className = "select-item2";
        const td = document.createElement('td');
        td.innerText = item;
        tr.appendChild(td);

        selectItem.appendChild(tr);

    }
    //add items to the table
    const addItem = (item) => {

        const tr = document.createElement('tr');
        tr.innerHTML = `<th scope="row" class="pt-3 add-cursor">${item}</th>
                                <td>
                                    <div class="input-group row d-flex justify-content-center">
                                        <input type="number" class="form-control text-right pt-0 col-6" value="100">
                                        <div class="input-group-append">
                                            <span class="input-group-text pt-0">g</span>
                                        </div>
                                    </div>
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
                                </td>`
        addItems.insertBefore(tr, addItems.firstChild);
    }
    //Feedback for no found elements
    const noFound = () => {
        emptyFeedback.textContent = 'No food items were found for your search.';
        emptyFeedback.style.display = 'block';
    }
    //the active element is shown its nutritional properties
    const addActiveClass = (active) => {

        active.classList.add('activeItem');
    }
    const activateItem = (active, callback) => {

        for (let child of addItems.children) {
            child.classList.remove('activeItem');
        }

        callback(active);

    }
    const percentCalc = (value, dr) => {

        return Math.round((value * 100 / dr) * 100) / 100;
    }
    let arr = [];
    const getAnalysisTable = (name, qty) => {

        FetchItems.getItems().then(items => {

            let nutrients;

            //Array for local storage of values
            let storage = [];

            for (let i = 0; i < items.foods.length; i++) {

                //daily values recomended
                let drWater = 2500, drEnergy = 2000, drProtein = 50, drFat = 78, drCarbo = 275, drFiber = 28;

                if (items.foods[i].food.desc.name == name) {

                    nutrients = items.foods[i].food.nutrients;

                    for (let j = 0; j < nutrients.length; j++) {
                        storage.push(nutrients[j].value);
                    }
                    localStorage.setItem(`${name}`, `${storage}`);

                    divAnalysis.innerHTML = `<div class="card mx-4">
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
                                    <td>${nutrients[0].value * qty / 100}</td>
                                    <td>${percentCalc(nutrients[0].value, drWater)}</td>
                                </tr>
                                <tr>
                                    <td>Energy</td>
                                    <td>kcal</td>
                                    <td>${nutrients[1].value}</td>
                                    <td>${percentCalc(nutrients[1].value, drEnergy)}</td>
                                </tr>
                                <tr>
                                    <td>Protein</td>
                                    <td>g</td>
                                    <td>${nutrients[2].value}</td>
                                    <td>${percentCalc(nutrients[2].value, drProtein)}</td>
                                </tr>
                                <tr>
                                    <td>Total lipid(fat)</td>
                                    <td>g</td>
                                    <td>${nutrients[3].value}</td>
                                    <td>${percentCalc(nutrients[3].value, drFat)}</td>
                                </tr>
                                <tr>
                                    <td>Carbohydrate, by difference</td>
                                    <td>g</td>
                                    <td>${nutrients[4].value}</td>
                                    <td>${percentCalc(nutrients[4].value, drCarbo)}</td>
                                </tr>
                                <tr>
                                    <td>Fiber, total dietary</td>
                                    <td>g</td>
                                    <td>${nutrients[5].value}</td>
                                    <td>${percentCalc(nutrients[5].value, drFiber)}</td>
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
                    console.log(nutrients[0].value);
                    return nutrients[0].value;
                }
            }

        });


    }
    //Public methods
    return {

        searchItem,
        selectItem,
        chooseItem,
        searchButton,
        emptyFeedback,
        activeItem,
        totalButton,
        addItems,
        confirmBtn,
        addItem,
        noFound,
        activateItem,
        addActiveClass,
        getAnalysisTable
    }

})();