// FIREBASE PART
import {get, ref} from  "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import {System} from "../firebase/system.js";
import { DatabaseAccess } from "./databaseaccess.js";

class DisplayProduct {
    constructor() {
        this.system = new System();
        this.databaseAccess = new DatabaseAccess();

        // this.tableContainer = document.createElement('div');
        // document.body.appendChild(this.tableContainer);
        
        this.databaseAccess.getProductBarcodes().then(async (barcodes)=>{
            console.log(barcodes);
            for(let i in barcodes)
            {
              const currentBarcode = barcodes[i];
               console.log(currentBarcode);
               try
               {

                    const product = await this.fetchProduct(currentBarcode);
                    const currentProductName = this.getProductName(product);

                    
                    // const newTable = document.createElement('table');
                    // this.tableContainer.appendChild(newTable);

                    // this.tableContainer = document.querySelector('.tableContainer');

                    this.displayProductInfo(product, i, barcodes[i]);

                    this.databaseAccess.setProductName(currentBarcode, currentProductName);
               } catch(error)
               {
                console.error(`Error processing barcode ${currentBarcode}:`, error);
               }
            //    this.fetchProduct(currentBarcode).then((product) => {
            //     const currentProductName = this.getProductName(product);

            //     this.databaseAccess.setProductName(currentBarcode, currentProductName);
            // });
            }
        });

    }

   async fetchProduct(barcode) {
        const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,nutriments,nutrient_levels_tags,allergens_from_ingredients`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 1) {

        //        this.displayProductInfo(data.product);
                return data.product;

            } else {
                console.error('Product not found:', data.status);
                throw new Error('Product not found');
            }

        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    //    return fetch(apiUrl)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 1) {
    //                this.displayProductInfo(data.product);

    //               //  this.createProductRow(data.product);

    //                 return data.product;
    //             } else {
    //                 alert('Product not found');
    //                 throw new Error('Product not found');


    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error fetching product:', error);
    //             throw error;

    //         });
    }
    displayProductInfo(product,uid, barcode) {
        const sanitizedProductAllergens = product.allergens_from_ingredients.toLowerCase().split('en:').join('');

        let sanitizedNutrientLevelsTags = Array.isArray(product.nutrient_levels_tags) ? 
            product.nutrient_levels_tags.map(level => level.replace(/-/g, ' ').replace(/en:/g, '')) : [];

        //let tableElement =`<table border="2" style="width:120%"><thead><tr><th colspan="2" id="productName">${product.product_name}<tbody id="productInfoBody"><tr><td>Allergy Warning<td id="allergyWarning">${sanitizedProductAllergens}<tr><td>Nutrient Levels<td id="nutrientLevels">${sanitizedNutrientLevelsTags.join(', ') || 'N/A'}<tr><td>Nutrition Data<td id="nutritionData">${this.formatNutritionData(product.nutriments)}<tr><td colspan="2"><button id="${uid}">Delete Ingredient</button></table>`;

        this.databaseAccess.getExpiryFromBarcode(barcode).then((expiry)=>{
            let tableElement =`<table border="2" style="width:120%"><thead><tr><th colspan="2" id="productName">${product.product_name}<tbody id="productInfoBody"><tr><td>Allergy Warning<td id="allergyWarning">${sanitizedProductAllergens}<tr><td>Nutrient Levels<td id="nutrientLevels">${sanitizedNutrientLevelsTags.join(', ') || 'N/A'}<tr><td>Nutrition Data<td id="nutritionData">${this.formatNutritionData(product.nutriments)}<tr><tr><td>Expiry Date</td><td id="expiryDate">${expiry}</td></tr><td colspan="2"><button id="${uid}">Delete Ingredient</button></table><br>`;
            // insert table element
            let container = document.getElementById('ingredient-list')
            container.insertAdjacentHTML('afterbegin', tableElement)
            // bind remove button
            let removeButton = document.getElementById(uid);
            removeButton.addEventListener('click', ()=>{this.databaseAccess.deleteBarcode(barcode)})
        })
        

        // const infoToDisplay = {
        //     'Product Name': product.product_name,
        //     'Allergy Warning': product.allergens_from_ingredients,
        //     'Nutrient Levels': Array.isArray(product.nutrient_levels_tags) ? product.nutrient_levels_tags.join(', ') : 'N/A',
        //     'Nutrition Data': this.formatNutritionData(product.nutriscore_data),
        // };

        // for (const key in infoToDisplay) {
        //     // const value = infoToDisplay[key];
        //     // const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
        //     // tableBody.innerHTML += row;
        //     const value = infoToDisplay[key];

        //     const row = tableBody.insertRow(); // create a new row
        //     const cell1 = row.insertCell(0); // create cells
        //     const cell2 = row.insertCell(1);

        //    cell1.textContent = key; // set cell content
        //    cell2.textContent = value;
        // }

    }

    formatNutritionData(nutriscoreData) {
        if (typeof nutriscoreData === 'object') {
            let result = '';
            const keysToLog = ['fat', 'sugars', 'carbohydrates', 'energy-kcal_100g', 'sodium', 'proteins'];

            for (const key in nutriscoreData) {
                if (keysToLog.includes(key)) {
                    const value = nutriscoreData[key];
                //    console.log(`${key}: ${value}g`);
                    result += `-> ${key}: ${value}g<br>`;
                    result+='<br>';
                }

            }
    
            return result;
        } else {
            return 'N/A';
        }
    }


    // createProductRow(product) {
    //     // Assuming you have a table in your HTML with an id 'productTable'
    //     const table = document.getElementById("productInfoBody");
    
    //     const row = table.insertRow();
    //     const cell1 = row.insertCell(0);
    //     const cell2 = row.insertCell(1);
        
    //     const row1 = table.insertRow();
    //     const cell3 = row.insertCell(0);
    //     const cell4 = row.insertCell(1);
        
    //     const row2 = table.insertRow();
    //     const cell5 = row.insertCell(0);
    //     const cell6 = row.insertCell(1);

    //     const row3 = table.insertRow();
    //     const cell7 = row.insertCell(0);
    //     const cell8 = row.insertCell(1);
        
    
    //     cell1.textContent = "Product Name";
    //     cell2.textContent = product.product_name;

    //     cell3.textContent = "Allergy Warning";
    //     cell4.textContent = product.allergens_from_ingredients;

    //     cell5.textContent = "Nutrient Levels";
    //     cell6.textContent = Array.isArray(product.nutrient_levels_tags) ? product.nutrient_levels_tags.join(', ') : 'N/A';

    //     cell7.textContent = "Nutrition Data";
    //     cell8.textContent = formatNutritionData(product.nutriscore_data);
    //   }

    getProductName(product) {
        return product.product_name;
    }
}

const displayProduct = new DisplayProduct();
