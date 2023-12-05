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
        newQuery = Array.toString(query);
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
    var recipes = new Array();
    //OK to assume from < to because of object response
    for (var i = data.from; i < data.to; i++){
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

var test = await sendEdamamApiRequest("neon");
console.log(test);
console.log(test[0].name);

let container = document.getElementById("recipecontainer");

container.innerHTML = '<h2 class="custom_heading">Your Recipes</h2><p class="custom_heading-text">Here are some recipes you can make based off of the ingredients you have entered!</p>';
for (let i = 0; i < test.length; i++){
    let ingandmes = "";
    for (let j = 0; j < test[i].ingredientsAndMeasurements.length; j++){
        ingandmes = ingandmes + "<br>" + test[i].ingredientsAndMeasurements[j];
    }

    let addingtext = '<div class="row layout_padding2"><div class="col-md-8"><div class="fruit_detail-box"><h3>'+test[i].name+'</h3><p class="mt-4 mb-5">'+ingandmes+'</p><div><a href="' + test[i].url + '" class="custom_dark-btn">See More</a></div></div></div><div class="col-md-4 d-flex justify-content-center align-items-center"><div class="fruit_img-box d-flex justify-content-center align-items-center"><img src="' + test[i].image + '" alt="" class="" width="250px" /></div></div></div>';
    container.innerHTML = container.innerHTML + addingtext;
} 
