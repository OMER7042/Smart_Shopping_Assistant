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
    fetchShoppingList(); // Fetch shopping list when the page loads
    addShoppingPanel();
    fetchVendors(); // Fetch vendors when the page loads
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
    const allProductsList = document.getElementById('all-products-list');
    allProductsList.innerHTML = ''; // Clear previous content
    
    shoppingList.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.product_name} - ${item.brand_name} - ${item.vendor} - $${item.price}`;
        allProductsList.appendChild(listItem);
    });
}

function addShoppingPanel() {
    var addButton = document.getElementById('add-shop');
    if (addButton) {
        addButton.addEventListener('click', function () {
            fetchProducts(); // Call the function to fetch products when the button is clicked
        });
    }
}

function fetchVendors() {
    fetch('/vendors/view')
        .then(response => response.json())
        .then(data => {
            if (data.vendors) {
                displayVendors(data.vendors); // Call a function to display vendors if the response contains the expected data
            } else {
                console.error('Error fetching vendors: Response format is invalid');
            }
        })
        .catch(error => {
            console.error('Error fetching vendors:', error);
        });
}

function displayVendors(vendors) {
    var vendorList = document.getElementById("vendorList");
    if (vendorList) {
        vendorList.innerHTML = ""; // Clear previous content
        vendors.forEach(vendor => {
            var listItem = document.createElement("li");
            listItem.textContent = vendor.name;
            vendorList.appendChild(listItem);
        });
    }
}


//Old code

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
