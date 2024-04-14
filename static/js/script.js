var vendors = [];
var products = [];

document.addEventListener("DOMContentLoaded", function () {
    addShoppingPanel();
    addVendorPanel();
    addProductPanel();
    addNewVendor();
    addNewProduct();
    addSelectedProducts();
});

document.addEventListener("DOMContentLoaded", function () {
    // Other functions and event listeners
    
    document.getElementById('fetch-shopping-list').addEventListener('click', function () {
        fetchShoppingList();
    });
});

function fetchShoppingList() {
    fetch('/shopping_list/view')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayShoppingList(data);
        })
        .catch(error => {
            console.error('Error fetching shopping list:', error);
        });
}

function displayShoppingList(shoppingList) {
    const shoppingListContainer = document.getElementById('shopping-list');
    shoppingListContainer.innerHTML = ''; // Clear previous content
    
    shoppingList.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.product_name} - ${item.brand_name} - ${item.vendor} - $${item.price}`;
        shoppingListContainer.appendChild(listItem);
    });

    // Show the modal dialog with the shopping list
    $('#modal-shopping-list').modal('show');
}


function addShoppingPanel() {
    document.getElementById('add-shop').addEventListener('click', function () {
        var productListing = document.getElementById("productListing");
        productListing.innerHTML = "";
    
        for (i = 0; i < products.length; i++) {
            var li = document.createElement("li");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "selectedProducts";
            checkbox.value = i; // Set the value to the index of the product in the array
            var label = document.createElement("label");
            label.textContent = " " + products[i].productname + "/" + products[i].brandname + " from " + products[i].vendor + " -$" + products[i].price;
            
            li.appendChild(checkbox);
            li.appendChild(label);
            productListing.appendChild(li);
        }    
        $('#modal-pr').modal('show');
    });
}

// Until here I made some change to code.rest below code is the same.


function addVendorPanel() {
    document.getElementById('add-vendor').addEventListener('click', function () {
        $('#modal-vn').modal('show');
    });
}

function addProductPanel() {
    document.getElementById('add-product').addEventListener('click', function () {
        var vendorSelectionList = document.getElementById("vendorSelection");
        vendorSelectionList.innerHTML = "";
        for (i = 0; i < vendors.length; i++) {
            vendorSelectionList.appendChild(new Option(vendors[i], i)); 
        }
        $('#modal-p').modal('show');
    });
}

function addNewVendor() {
    var vname = document.getElementById("vendorNameInput").value;
    if (vname != undefined) {
        for (i = 0; i < vendors.length; i++) {
            if (vendors[i] == vname) {
                return;
            }
        }
        vendors.push(vname);
        $('#modal-vn').modal('hide');
    }
}

function addNewProduct() {
    var form = document.getElementById('productform')
    console.log(form);
    var details = {
        productname: form.elements["productName"].value,
        brandname: form.elements["brandName"].value,
        vendor: vendors[form.elements["vendorSelection"].value],
        price: form.elements["price"].value
    }

    products.push(details);
    $('#modal-p').modal('hide');

    console.log(details);
}

function addSelectedProducts() {
    var selectedProducts = document.querySelectorAll('input[name="selectedProducts"]:checked');
    
    var cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "col-3", "dsc-ca");
    
    var ul = document.createElement("ul");
    ul.classList.add("list-group", "list-group-flush");

    selectedProducts.forEach(function (checkbox) {
        var index = checkbox.value;
        var product = products[index];
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = product.productname + "/" + product.brandname + " from " + product.vendor + " - $" + product.price;
        ul.appendChild(li);
    });

    cardDiv.appendChild(ul);
    document.getElementById("selectedProductsContainer").appendChild(cardDiv);
    $('#modal-pr').modal('hide');
}

document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.card').remove(); // Remove the closest parent card
    });
});
