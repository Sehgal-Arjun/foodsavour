const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: "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"
})
const openai = new OpenAIApi(configuration)

async function go(ingredients) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Remove the ingredient least likely to be in a recipe from the list: " + ingredients.toString() + " and return the remaining ingredients as a list of strings with single quotation marks separated by commas with no brackets",
    temperature: 0,
    max_tokens: 500
  })
  console.log(completion.data.choices[0].text)
}

async function searchIngredients() {
    var ingredientsArray = new Array("chicken", "beef", "pork");
    go(ingredientsArray);
    console.log(ingredientsArray);
    return ingredientsArray;
}

searchIngredients();