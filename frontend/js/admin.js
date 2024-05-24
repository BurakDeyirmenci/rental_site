function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğundan 1 eklenir
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}


function fetchBrand() {
    return fetch(`${API_URL}/brands/`, {
        headers: {
            'Authorization': `Token ${TOKEN}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let brandSelect = $('#product-brand');
        brandSelect.empty();
        data.forEach(brand => {
            brandSelect.append(`<option value="${brand.id}">${brand.name}</option>`);
        });
    })
    .catch(error => console.error('Error fetching brands:', error));
}

function fetchCategory() {
    return fetch(`${API_URL}/categories/`, {
        headers: {
            'Authorization': `Token ${TOKEN}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let categorySelect = $('#product-category');
        categorySelect.empty();
        data.forEach(category => {
            categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));
}

function fetchProductModel() {
    return fetch(`${API_URL}/product_models/`, {
        headers: {
            'Authorization': `Token ${TOKEN}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let modelSelect = $('#product-model');
        modelSelect.empty();
        data.forEach(model => {
            modelSelect.append(`<option value="${model.id}">${model.name}</option>`);
        });
    })
    .catch(error => console.error('Error fetching product models:', error));
}


$(document).ready(function() {
    let brands = [];
    let categories = [];
    let productModels = [];
    let productfilter=[];
    let userfilter=[];
    function fetchBrands() {
        fetch(`${API_URL}/brands/`, {
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            brands = data;
            let brandSelect = $('#product-brand');
            let brandFilterSelect = $('#brand-filter');
            brandSelect.empty();
            brandFilterSelect.empty();
            brandSelect.append(`<option value="">Select Brand</option>`);
            brandFilterSelect.append(`<option value="">All</option>`);
            data.forEach(brand => {
                brandSelect.append(`<option value="${brand.id}">${brand.name}</option>`);
                brandFilterSelect.append(`<option value="${brand.name}">${brand.name}</option>`);
            });
        })
        .catch(error => console.error('Error fetching brands:', error));
    }

    function fetchCategories() {
        fetch(`${API_URL}/categories/`, {
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            categories = data;
            let categorySelect = $('#product-category');
            let categoryFilterSelect = $('#category-filter');
            categorySelect.empty();
            categoryFilterSelect.empty();
            categorySelect.append(`<option value="">Select Category</option>`);
            categoryFilterSelect.append(`<option value="">All</option>`);
            data.forEach(category => {
                categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
                categoryFilterSelect.append(`<option value="${category.name}">${category.name}</option>`);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
    }

    function fetchProductModels() {
        fetch(`${API_URL}/product_models/`, {
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            productModels = data;
            let modelSelect = $('#product-model');
            let modelFilterSelect = $('#model-filter');
            modelSelect.empty();
            modelFilterSelect.empty();
            modelSelect.append(`<option value="">Select Model</option>`);
            modelFilterSelect.append(`<option value="">All</option>`);
            data.forEach(model => {
                modelSelect.append(`<option value="${model.id}">${model.name}</option>`);
                modelFilterSelect.append(`<option value="${model.name}">${model.name}</option>`);
            });
        })
        .catch(error => console.error('Error fetching product models:', error));
    }
    function fetchUsers() {
        fetch(`${API_URL}/users/`, {
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            userfilter = data;
            let userFilterSelect = $('#user-filter');
            userFilterSelect.empty();
            userFilterSelect.append(`<option value="">All</option>`);
            data.forEach(user => {
                userFilterSelect.append(`<option value="${user.username}">${user.username}</option>`);
            });
        })
        .catch(error => console.error('Error fetching product models:', error));
    }
    // Function to fetch and display products
    function fetchProducts() {
        fetch(`${API_URL}/products/`, {
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            productfilter=data;
            let productFilterSelect = $('#product-filter');
            productFilterSelect.empty();
            productFilterSelect.append(`<option value="">All</option>`);
            data.forEach(product => {
                productFilterSelect.append(`<option value="${product.name}">${product.name}</option>`);
            });
            if ($.fn.DataTable.isDataTable('#product-table')) {
                $('#product-table').DataTable().clear().destroy();
            }
    
            let productTable = $('#product-table').DataTable({
                ajax: {
                    url: `${API_URL}/products/`,
                    type: 'GET',
                    dataSrc: ''
                },
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'description' },
                    { data: 'price' },
                    { data: 'brand.name' },
                    { data: 'product_model.name' },
                    { data: 'weight' },
                    { data: 'category.name' },
                    { data: 'image_url', render: function(data) {
                        return `<img src="${data}" style="max-height:15em" class="img-fluid">`;
                    }},
                    { data: null, render: function(data, type, row) {
                        return `
                            <button class="btn btn-info update-product" data-id="${row.id}" data-name="${row.name}" data-description="${row.description}" data-price="${row.price}" data-brand="${row.brand.id}" data-model="${row.product_model.id}" data-weight="${row.weight}" data-category="${row.category.id}" data-image_url="${row.image_url}">Update</button>
                            <button class="btn btn-danger delete-product" data-id="${row.id}">Delete</button>
                        `;
                    }}
                ]
            });
    
            // Filter functionality
            $('#brand-filter').on('change', function() {
                let selectedBrand = $(this).val();
                if (selectedBrand) {
                    productTable.column(4).search(selectedBrand).draw();
                } else {
                    productTable.column(4).search('').draw();
                }
            });
    
            $('#model-filter').on('change', function() {
                let selectedModel = $(this).val();
                if (selectedModel) {
                    productTable.column(5).search(selectedModel).draw();
                } else {
                    productTable.column(5).search('').draw();
                }
            });
    
            $('#category-filter').on('change', function() {
                let selectedCategory = $(this).val();
                if (selectedCategory) {
                    productTable.column(7).search(selectedCategory).draw();
                } else {
                    productTable.column(7).search('').draw();
                }
            });
        })
        .catch(error => console.error('Error fetching products:', error));
    }
    

    // Function to fetch and display rentals
    function fetchRentals() {
        fetch(`${API_URL}/rentals/`, {
            headers: {
                'Authorization': `Token ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let rentalTable = $('#rental-table').DataTable({
                data: data,
                columns: [
                    { data: 'id' },
                    { data: 'product.name' },
                    { data: 'user.username' },
                    { data: 'start_date', render: formatDate },
                    { data: 'end_date', render: formatDate },
                    { data: null, render: function(data, type, row) {
                        return `
                            <button class="btn btn-info update-rental" data-id="${row.id}" data-rental_date="${row.start_date}" data-return_date="${row.end_date}">Update</button>
                            <button class="btn btn-danger delete-rental" data-id="${row.id}">Delete</button>
                        `;
                    }}
                ]
            });
            // Filter functionality
            $('#user-filter').on('change', function() {
                let selectedUser = $(this).val();
                if (selectedUser) {
                    rentalTable.column(2).search(selectedUser).draw();
                } else {
                    rentalTable.column(2).search('').draw();
                }
            });
    
            $('#product-filter').on('change', function() {
                let selectedProduct = $(this).val();
                if (selectedProduct) {
                    rentalTable.column(1).search(selectedProduct).draw();
                } else {
                    rentalTable.column(1).search('').draw();
                }
            });
        })
        .catch(error => console.error('Error fetching rentals:', error));
    }

    // Event listener for creating a product
    $('#create-product').on('click', function() {
        $('#productModal').modal('show');
        $('#product-form')[0].reset();
        $('#product-id').val('');
        fetchBrands();
        fetchCategories();
        fetchProductModels();
    });

    // Event listener for saving a product (create/update)
    $('#product-form').on('submit', function(event) {
        event.preventDefault();
        let productId = $('#product-id').val();
        let productName = $('#product-name').val();
        let productDescription = $('#product-description').val();
        let productPrice = $('#product-price').val();
        let productBrandId = $('#product-brand').val();
        let productBrandName = $('#product-brand option:selected').text();
        let productModelId = $('#product-model').val();
        let productModelName = $('#product-model option:selected').text();
        let productWeight = $('#product-weight').val();
        let productCategoryId = $('#product-category').val();
        let productCategoryName = $('#product-category option:selected').text();
        let productImageUrl = $('#product-image').val();
    
        let method = productId ? 'PATCH' : 'POST';
        let url = productId ? `${API_URL}/products/${productId}/` : `${API_URL}/products/`;
    
        // Nested serializer için uygun formatta veri gönder
        let productData = {
            name: productName,
            description: productDescription,
            price: productPrice,
            weight: productWeight,
            image_url: productImageUrl,
            brand: { id: productBrandId, name: productBrandName },
            product_model: { id: productModelId, name: productModelName },
            category: { id: productCategoryId, name: productCategoryName }
        };
    
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${TOKEN}`
            },
            body: JSON.stringify(productData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            $('#productModal').modal('hide');
            fetchProducts(); // DataTable'ı yeniden yükleyin
        })
        .catch(error => console.error('Error saving product:', error));
    });

    // Event listener for updating a product
    $('#product-table').on('click', '.update-product', function() {
        let productId = $(this).data('id');
        let productName = $(this).data('name');
        let productDescription = $(this).data('description');
        let productPrice = $(this).data('price');
        let productBrand = $(this).data('brand').toString();
        let productModel = $(this).data('model').toString();
        let productWeight = $(this).data('weight');
        let productCategory = $(this).data('category').toString();
        let productImageUrl = $(this).data('image_url');
    
        $('#productModal').modal('show');
    
        // Verileri set etmeden önce tüm fetch işlemlerinin tamamlanmasını bekle
        Promise.all([fetchBrand(), fetchCategory(), fetchProductModel()])
            .then(() => {
                $('#product-id').val(productId);
                $('#product-name').val(productName);
                $('#product-description').val(productDescription);
                $('#product-price').val(productPrice);
                $('#product-brand').val(productBrand);
                $('#product-model').val(productModel);
                $('#product-weight').val(productWeight);
                $('#product-category').val(productCategory);
                $('#product-image').val(productImageUrl);
            })
            .catch(error => console.error('Error initializing form:', error));
    });

    // Event listener for deleting a product
    $('#product-table').on('click', '.delete-product', function() {
        let productId = $(this).data('id');
        if (confirm("Are you sure you want to delete this product?")) {
            fetch(`${API_URL}/products/${productId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${TOKEN}`
                }
            })
            .then(response => response.json())
            .then(() => {
                $('#product-table').DataTable().ajax.reload();
            })
            .catch(error => console.error('Error deleting product:', error));
        }
    });

    // Event listener for updating a rental
    $('#rental-table').on('click', '.update-rental', function() {
        let rentalId = $(this).data('id');
        let rentalDate = $(this).data('rental_date');
        let returnDate = $(this).data('return_date');

        $('#rental-id').val(rentalId);
        $('#rental-date').val(rentalDate);
        $('#return-date').val(returnDate);

        $('#rentalModal').modal('show');
    });

    // Event listener for saving a rental (update)
    $('#rental-form').on('submit', function(event) {
        event.preventDefault();
        let rentalId = $('#rental-id').val();
        let rentalDate = $('#rental-date').val();
        let returnDate = $('#return-date').val();

        fetch(`${API_URL}/rentals/${rentalId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${TOKEN}`
            },
            body: JSON.stringify({
                start_date: rentalDate,
                end_date: returnDate
            })
        })
        .then(response => response.json())
        .then(() => {
            $('#rentalModal').modal('hide');
            $('#rental-table').DataTable().ajax.reload();
        })
        .catch(error => console.error('Error updating rental:', error));
    });

    // Event listener for deleting a rental
    $('#rental-table').on('click', '.delete-rental', function() {
        let rentalId = $(this).data('id');
        if (confirm("Are you sure you want to delete this rental?")) {
            fetch(`${API_URL}/rentals/${rentalId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${TOKEN}`
                }
            })
            .then(response => response.json())
            .then(() => {
                $('#rental-table').DataTable().ajax.reload();
            })
            .catch(error => console.error('Error deleting rental:', error));
        }
    });

    // Initial fetch of products and rentals
    fetchBrands();
    fetchCategories();
    fetchProductModels();
    fetchProducts();
    fetchRentals();
    fetchUsers();
});
