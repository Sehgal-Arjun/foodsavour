/**
 * This is an asynchronous function for sending an Edamam API request based on queries.
 * You must use await when using this function as it is asynchronous.
 * @param {String,Array} query Inputs a string or Array query.
 * @returns Array of recipe responses with the following data: URL, name, image, source, cookingTime, and ingredientsAndMeasurements
 * The array will be a maximum of length 10.
 */
async function sendEdamamApiRequest(query) {
    var newQuery;
    if (Array.isArray(query)){
        newQuery = query.toString();
    } else {
        newQuery = query;
    }
    let APP_ID = "7fd5c1c4"
    let APP_KEY = "7a1c68323da3429b95240df1cd92f930"
    //Since fetch is an asynchronous function, we need an await to catch the promise
    let response = await fetch(`https://api.edamam.com/search?&app_id=${APP_ID}&app_key=${APP_KEY}&q=${newQuery}`);
    //We want to keep the data as a object and handle it this way.
    var data = await response.json();
    return filterResponse(data);
}

/**
 * The purpose of this function is to take an input of data from the Edamam Recipe API.
 * Then, it will respond with an array of Recipe Objects based on the number of hit recipes.
 * It will filter out all the data that is not needed from the original json response.
 * @param {Object} data 
 * @returns Array of recipe responses
 */
function filterResponse(data){
    if (data != null && data != undefined && typeof data != 'object'){
        console.log("This is not an object.");
        return false;
    }
    var len = data.hits.length;
    if (len == 0){
        return false;
    }
    var recipes = new Array();
    //OK to assume from < to because of object response
    for (var i = 0; i < len; i++){
        var currentRecipe = data.hits[i];
        const necessaryRecipeData = {
            url: currentRecipe.recipe.shareAs, //URL
            name: currentRecipe.recipe.label, //String
            image: currentRecipe.recipe.image, //URL
            source: currentRecipe.recipe.source, //String
            cookingTime: currentRecipe.recipe.totalTime, //int
            ingredientsAndMeasurements: currentRecipe.recipe.ingredientLines //Array of Strings
        }
        recipes.push(necessaryRecipeData);
    }
    return recipes;
}