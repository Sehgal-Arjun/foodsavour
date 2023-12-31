import { get, ref } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { System } from "../firebase/system.js";
import { DatabaseAccess } from "./databaseaccess.js";
/*
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
apiKey: "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"
})
const openai = new OpenAIApi(configuration)
*/


//Input: Raw data ingredient not shortened.
/*
async function shortenList(ingredients) {
    const APIKEY = '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';
    if (!Array.isArray(ingredients)) {
        console.log("Ingredients input is incorrect.");
        return false;
    }
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${APIKEY}`,
        },
        body: JSON.stringify({
            prompt: "Remove the ingredient least likely to be in a recipe from the list: " + ingredients.toString() + " and return the remaining ingredients as a list of strings with single quotation marks separated by commas with no brackets",
            max_tokens: 500,
        }),
    });
    var data = await response.json();
    console.log(response);
}

async function removeBrackets(ingredients) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Return the first seven of the following ingredients: " + ingredients.toString() + "as a list of strings with single quotation marks separated by commas with no brackets",
        temperature: 0,
        max_tokens: 500
    })
    return completion.data.choices[0].text;
}
*/

/**
 * This is an asynchronous function for sending an Edamam API request based on queries.
 * You must use await when using this function as it is asynchronous.
 * @param {String,Array} query Inputs a string or Array query.
 * @returns Array of recipe responses with the following data: URL, name, image, source, cookingTime, and ingredientsAndMeasurements
 * The array will be a maximum of length 10.
 */
async function sendEdamamApiRequest(query) {
    var newQuery;
    if (Array.isArray(query)) {
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
function filterResponse(data) {
    if (data != null && data != undefined && typeof data != 'object') {
        console.log("This is not an object.");
        return false;
    }
    var recipes = new Array();
    //OK to assume from < to because of object response
    for (var i = data.from; i < data.to; i++) {
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

function sortExpiry(ingredients, expiryDates, length) {
    var sortedIngredients = new Array(length);
    for (var i = 0; i < length; i++) {
        var min = Date.parse(expiryDates[i]);
        var minIndex = i;
        for (var j = i; j < expiryDates.length; j++) {
            if (Date.parse(expiryDates[j]) < min) {
                min = Date.parse(expiryDates[j]);
                minIndex = j;
            }
        }
        var temp = ingredients[i];
        var tempDate = expiryDates[i];
        ingredients[i] = ingredients[minIndex];
        expiryDates[i] = expiryDates[minIndex];
        ingredients[minIndex] = temp;
        expiryDates[minIndex] = tempDate;
    }
    return ingredients;
}


async function searchIngredients() {
    this.system = new System();
    this.databaseAccess = new DatabaseAccess();
    var ingredients = databaseAccess.getProductNames().then((ingredients) => {
        var barcodes = databaseAccess.getProductBarcodes().then((barcodes) => {
            try {
                // var recipes = this.searchIngredients(ingredients, expiry);
                var ingredientsArray = ingredients;
                var expiryDates = new Array(barcodes.length);
                for (var i = 0; i < barcodes.length; i++) {
                    const temp = databaseAccess.getExpiryFromBarcode(barcodes[i]).split("-");
                    expiryDates[i] = new Date(parseInt(temp[0]), parseInt(temp[1]), parseInt(temp[2]));
                }
            } catch (error) {
                console.error(`Error generating recipes:`, error);
            }
        });
    });



    //var ingredientsArray = new Array("chicken", "beef", "pork", "grapes", "cheese", "rice", "apples", "tea");
    //var expiryDates = new Array(new Date(2021, 3, 21), new Date(2021, 3, 20), new Date(2021, 3, 12), new Date(2021, 3, 12), new Date(2021, 3, 12), new Date(2021, 3, 12), new Date(2021, 3, 12), new Date(2021, 3, 12));
    console.log(ingredientsArray);
    var sortedIngredients = sortExpiry(ingredientsArray, expiryDates, ingredientsArray.length);
    console.log(sortedIngredients);
    /*
    var test = await removeBrackets(sortedIngredients);
    console.log(test);
    while(await sendEdamamApiRequest(test) == false) {
        var test = await shortenList(test);
        console.log(test);
    }
    */

    for (var i = 0; i < sortedIngredients.length; i++) {
        var recipes = await sendEdamamApiRequest(sortedIngredients);
        console.log(recipes);
        return recipes;
    }
}

searchIngredients();

var test = await sendEdamamApiRequest(getlocalStorage.getItem("TestIngredients2"));

let container = document.getElementById("recipecontainer");

container.innerHTML = '<h2 class="custom_heading">Your Recipes</h2><p class="custom_heading-text">Here are some recipes you can make based off of the ingredients you have entered!</p>';
for (let i = 0; i < test.length; i++) {
    let ingandmes = "";
    for (let j = 0; j < test[i].ingredientsAndMeasurements.length; j++) {
        ingandmes = ingandmes + "<br>" + test[i].ingredientsAndMeasurements[j];
    }

    let addingtext = '<div class="row layout_padding2"><div class="col-md-8"><div class="fruit_detail-box"><h3>' + test[i].name + '</h3><p class="mt-4 mb-5">' + ingandmes + '</p><div><a href="' + test[i].url + '" class="custom_dark-btn">See More</a></div></div></div><div class="col-md-4 d-flex justify-content-center align-items-center"><div class="fruit_img-box d-flex justify-content-center align-items-center"><img src="' + test[i].image + '" alt="" class="" width="250px" /></div></div></div>';
    container.innerHTML = container.innerHTML + addingtext;
}


