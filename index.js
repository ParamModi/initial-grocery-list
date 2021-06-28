let listOfItems;

let emptyImage = document.createElement("img"); //Image for Empty Cart, which will initially have display:none;
emptyImage.src = "./assets/empty.png";
emptyImage.id = "emptyCart";
document.getElementById("groceryDivision").append(emptyImage);
emptyImage = document.getElementById("emptyCart");
emptyImage.style.display = "none";

listOfItems = JSON.parse(window.localStorage.getItem("listOfGrocery")); //Getting data from local storage

if (listOfItems === null) {
	listOfItems = [];
}
//If local storage is empty, then image for empty cart will be shown
if (listOfItems.length <= 0) {
	emptyImage.style.display = "block";
}

//Create the list element to be updated in the Grocery List
function createListElement(itemName, quantity) {
	let listEntry = document.createElement("div");
	listEntry.innerHTML = `
  <div class="mainParaInList"><p class="itemNameInList">Item: <strong class="fullName">${itemName}</strong></p><p class="quantityInList">Quantity: <strong>${quantity}</strong></p></div>
  `;
	listEntry.classList.add("divOfList");
	let editImage = document.createElement("img");
	editImage.src = "./assets/edit.png";
	editImage.alt = "Edit";
	editImage.classList.add("image1");
	editImage.addEventListener("click", () => {
		editItemFromList(itemName, quantity);
	});

	let deleteImage = document.createElement("img");
	deleteImage.src = "./assets/delete.png";
	deleteImage.alt = "Delete";
	deleteImage.classList.add("image2");
	deleteImage.addEventListener("click", () => {
		deleteItemFromList(itemName, quantity);
	});

	let divelement = document.createElement("div");
	divelement.classList.add("divOfButtons");
	divelement.append(editImage);
	divelement.append(deleteImage);

	listEntry.append(divelement);

	return listEntry;
}

//For every element of localstorage, we will create a list entry, and append it to the main grocery list
listOfItems.forEach((data) => {
	let itemName = data["item"];
	let quantity = data["quantity"];

	let listEntry = createListElement(itemName, quantity);

	document.getElementById("groceryList").append(listEntry);
});

//HTML for the forms of "Add Grocery Item" and "Edit Grocery Item"
let addItemFormContent = `
<h2>Add Grocery Item</h2>
<form id="addItemForm">
<label for="itemName1">Item Name:</label><br>
<input type="text" id="itemName1" required autofocus size="40"><br><br>
<label for="quantity1">Quantity:</label><br>
<input type="number" id="quantity1" min="1" required><br><br>
<input type="button" id="submitButton1" value="Add To Cart" class="submitButton">
<input type="reset" class = "resetButton" value="Reset">
</form>
`;

let editItemFormContent = `
<h2>Edit Grocery Item</h2>
<form id="editItemForm">
<label for="itemName2">Item Name:</label><br>
<input type="text" id="itemName2" required autofocus size="40"><br><br>
<label for="quantity2">Quantity:</label><br>
<input type="number" id="quantity2" min="1" required><br><br>
<input type="button" id ="submitButton2" value="Edit Item" class="submitButton">
<input type="reset" id ="resetButton2" class="resetButton" value="Reset">
</form>
`;

//When the page loads, initially  we will show "Add Grocery Item" Form
document.getElementById("form").innerHTML = addItemFormContent;
document.querySelector("#submitButton1").addEventListener("click", () => {
	addItemToList();
});

//Whenever the "Add To Cart" button is pressed, this function will handle the data updation in the Grocery List
function addItemToList() {
	let itemName = document.getElementById("itemName1").value;
	let quantityValue = document.getElementById("quantity1").value;

	if (Number(quantityValue) <= 0) {
		alert("Sorry!! We can not insert negative or zero quantity.");
	} else {
		let itemIndexInArray = listOfItems.findIndex(
			(entry) => entry["item"] == itemName
		);

		//Creating the new entry in array; If there is no existing item, with the inserted name
		if (itemIndexInArray == -1) {
			if (listOfItems.length == 0) emptyImage.style.display = "none"; //Removing image from display, if this is the first item in the list.

			listOfItems.push({
				item: itemName,
				quantity: quantityValue,
			});
		} else {
			//If there is an existing item, with the inserted name, then we will update its value in the array
			let currentValue = Number(listOfItems[itemIndexInArray]["quantity"]);
			currentValue += Number(quantityValue);
			quantityValue = String(currentValue);
			listOfItems[itemIndexInArray]["quantity"] = quantityValue;
		}

		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems)); //Updating the local storage

		let listEntry = createListElement(itemName, quantityValue);

		//If there is no existing Item with the inserted item name, then we will append a new element
		if (itemIndexInArray == -1) {
			document.getElementById("groceryList").append(listEntry);
		} else {
			//Else we will replace the existing one

			let childInList =
				document.getElementsByClassName("divOfList")[itemIndexInArray];
			let parentInList = childInList.parentNode;
			parentInList.replaceChild(listEntry, childInList);
		}
	}

	document.getElementById("itemName1").value = ""; //Reseting the form values, for further use
	document.getElementById("quantity1").value = "";
}

//Whenever the "Edit Item" button is pressed in the form, this function will handle the data updation in the Grocery List
function updateItemToList(itemName, quantity) {
	if (itemName == undefined) {
		itemName = document.getElementById("itemName2").value;
	}
	if (quantity == undefined) {
		quantity = document.getElementById("quantity2").value;
	}

	let itemIndexInArray = listOfItems.findIndex(
		(entry) => entry["item"] == itemName
	);

	//If we delete the entry, after pressing the edit button in the list
	if (itemIndexInArray == -1) {
		alert("Sorry! There is no such item available in the cart");
	} else if (Number(quantity) <= 0) {
		alert("Sorry!! We can not insert negative or zero quantity.");
	} else {
		listOfItems[itemIndexInArray]["quantity"] = quantity;
		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems));

		let listEntry = createListElement(itemName, quantity);

		let childInList =
			document.getElementsByClassName("divOfList")[itemIndexInArray];
		let parentInList = childInList.parentNode;
		parentInList.replaceChild(listEntry, childInList);
	}
	document.getElementById("itemName2").value = "";
	document.getElementById("quantity2").value = "";
	document.getElementById("form").innerHTML = addItemFormContent;
	document.querySelector("#submitButton1").addEventListener("click", () => {
		addItemToList();
	});
}

//Whenever the edit button is pressed in the list, this function will be called, which in turn will call updateItemToList(), and update the form
function editItemFromList(itemName, quantity) {
	document.getElementById("form").innerHTML = editItemFormContent;
	document.getElementById("itemName2").value = itemName;
	document.getElementById("quantity2").value = quantity;
	document.querySelector("#submitButton2").addEventListener("click", () => {
		updateItemToList();
	});
	document.querySelector("#resetButton2").addEventListener("click", () => {
		document.getElementById("form").innerHTML = addItemFormContent;
		document.querySelector("#submitButton1").addEventListener("click", () => {
			addItemToList();
		});
	});
}

//This function will handle the updation, whenever we want to delete an item from the list
function deleteItemFromList(itemName, quantity) {
	let itemIndexInArray = listOfItems.findIndex(
		(entry) => entry["item"] == itemName
	);

	if (itemIndexInArray == -1) {
		alert("Sorry! There is no such item available in the cart");
	} else {
		listOfItems.splice(itemIndexInArray, 1);
		window.localStorage.setItem("listOfGrocery", JSON.stringify(listOfItems));
		document.getElementsByClassName("divOfList")[itemIndexInArray].remove();
	}

	if (listOfItems.length == 0) emptyImage.style.display = "block"; //If the list is empty, emptyImage will be shown
}
