const FetchItems = (function () {

    const ds = 'Standard Reference';
    let q = 'broccoli';

    //Public methods
    return {
        getItems: async function getItems(item) {
            const response = await fetch('demo_api.json');

            // const USDAResponse = await fetch(`https://api.nal.usda.gov/ndb/search/?${api_key}&q=${this.q}&ds=${this.ds}`);

            const data = await response.json();

            //const data = await USDAResponse.json();

            return data;
        }
    }

})();
