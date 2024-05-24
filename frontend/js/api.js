function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğundan 1 eklenir
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

function fetchAndRenderUAVs(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${API_URL}/products/?${params}` : `${API_URL}/products/`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load UAVs!');
        }
        return response.json();
    })
    .then(data => {
        $('#uavs').empty();
        if (data.length > 0) {
            data.forEach(product => {
                $('#uavs').append(`
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text">${product.price} &#8378;</p>
                                <button class="btn btn-primary rent-button" data-id="${product.id}">Rent</button>
                            </div>
                        </div>
                    </div>
                `);
            });

            $('.rent-button').on('click', function() {
                const productId = $(this).data('id');
                if (localStorage.getItem('token')) {
                    $('#rental-form').data('product-id', productId);
                    $('#rentalModal').modal('show');
                } else {
                    alert('You need to log in to rent a product.');
                    window.location.href = 'login.html';
                }
            });
        } else {
            $('#uavs').append('<p>No products found.</p>');
        }
    })
    .catch(error => {
        alert(error.message);
        console.error('Error:', error);
    });
}

function fetchAndRenderRentals(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${API_URL}/my-rentals/?${params}` : `${API_URL}/my-rentals/`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load rentals!');
        }
        return response.json();
    })
    .then(data => {
        $('#my-rentals').empty();
        if (data.length > 0) {
            data.forEach(rental => {
                const startDate = formatDate(rental.start_date);
                const endDate = formatDate(rental.end_date);
                $('#my-rentals').append(`
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <img src="${rental.product.image_url}" class="card-img-top" alt="${rental.product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${rental.product.name}</h5>
                                <p class="card-text">${rental.product.description}</p>
                                <p class="card-text">Start Date: ${startDate}</p>
                                <p class="card-text">End Date: ${endDate}</p>
                                <button class="btn btn-primary extend-rental-button" data-id="${rental.id}" data-end-date="${rental.end_date}">Extend Rental</button>
                            </div>
                        </div>
                    </div>
                `);
            });

            $('.extend-rental-button').on('click', function() {
                const rentalId = $(this).data('id');
                const endDate = $(this).data('end-date');

                $('#extend-rental-id').val(rentalId);
                $('#extend-end-date').val(endDate);

                $('#extendRentalModal').modal('show');
            });
        } else {
            $('#my-rentals').append('<p>No rentals found.</p>');
        }
    })
    .catch(error => {
        alert(error.message);
        console.error('Error:', error);
    });
}

function fetchFilters() {
    // Fetch brands
    fetch(`${API_URL}/brands/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const brandFilter = $('#uav-brand-filter');
        brandFilter.empty();
        brandFilter.append(`<option value="">All</option>`);
        data.forEach(brand => {
            brandFilter.append(`<option value="${brand.id}">${brand.name}</option>`);
        });

        const rentalBrandFilter = $('#rental-brand-filter');
        rentalBrandFilter.empty();
        rentalBrandFilter.append(`<option value="">All</option>`);
        data.forEach(brand => {
            rentalBrandFilter.append(`<option value="${brand.id}">${brand.name}</option>`);
        });
    })
    .catch(error => {
        console.error('Error fetching brands:', error);
    });

    // Fetch product models
    fetch(`${API_URL}/product_models/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const modelFilter = $('#uav-model-filter');
        modelFilter.empty();
        modelFilter.append(`<option value="">All</option>`);
        data.forEach(model => {
            modelFilter.append(`<option value="${model.id}">${model.name}</option>`);
        });

        const rentalModelFilter = $('#rental-model-filter');
        rentalModelFilter.empty();
        rentalModelFilter.append(`<option value="">All</option>`);
        data.forEach(model => {
            rentalModelFilter.append(`<option value="${model.id}">${model.name}</option>`);
        });
    })
    .catch(error => {
        console.error('Error fetching models:', error);
    });

    // Fetch categories
    fetch(`${API_URL}/categories/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const categoryFilter = $('#uav-category-filter');
        categoryFilter.empty();
        categoryFilter.append(`<option value="">All</option>`);
        data.forEach(category => {
            categoryFilter.append(`<option value="${category.id}">${category.name}</option>`);
        });

        const rentalCategoryFilter = $('#rental-category-filter');
        rentalCategoryFilter.empty();
        rentalCategoryFilter.append(`<option value="">All</option>`);
        data.forEach(category => {
            rentalCategoryFilter.append(`<option value="${category.id}">${category.name}</option>`);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
}

document.addEventListener("DOMContentLoaded", function(e) {
    const searchUAV = document.getElementById('searchuav');
    const searchRental = document.getElementById('searchrental');
    const brandFilter = document.getElementById('uav-brand-filter');
    const modelFilter = document.getElementById('uav-model-filter');
    const categoryFilter = document.getElementById('uav-category-filter');
    const rentalBrandFilter = document.getElementById('rental-brand-filter');
    const rentalModelFilter = document.getElementById('rental-model-filter');
    const rentalCategoryFilter = document.getElementById('rental-category-filter');

    function applyFilters() {
        const filters = {};
        if (brandFilter.value) filters.brand = brandFilter.value;
        if (modelFilter.value) filters.product_model = modelFilter.value;
        if (categoryFilter.value) filters.category = categoryFilter.value;
        fetchAndRenderUAVs(filters);
    }

    function applyRentalFilters() {
        const filters = {};
        if (rentalBrandFilter.value) filters.brand = rentalBrandFilter.value;
        if (rentalModelFilter.value) filters.product_model = rentalModelFilter.value;
        if (rentalCategoryFilter.value) filters.category = rentalCategoryFilter.value;
        console.log(filters);
        fetchAndRenderRentals(filters);
    }

    if (searchUAV) {
        searchUAV.addEventListener('input', function() {
            const query = this.value;
            if (query.length > 0) {
                fetch(`${API_URL}/search/?query=${encodeURIComponent(query)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    $('#uavs').empty();
                    if (data.length > 0) {
                        data.forEach(product => {
                            $('#uavs').append(`
                                <div class="col-md-4">
                                    <div class="card mb-4">
                                        <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                                        <div class="card-body">
                                            <h5 class="card-title">${product.name}</h5>
                                            <p class="card-text">${product.description}</p>
                                            <p class="card-text">${product.price} &#8378;</p>
                                            <button class="btn btn-primary rent-button" data-id="${product.id}">Rent</button>
                                        </div>
                                    </div>
                                </div>
                            `);
                        });

                        $('.rent-button').on('click', function() {
                            const productId = $(this).data('id');
                            if (localStorage.getItem('token')) {
                                $('#rental-form').data('product-id', productId);
                                $('#rentalModal').modal('show');
                            } else {
                                alert('You need to log in to rent a product.');
                                window.location.href = 'login.html';
                            }
                        });
                    } else {
                        $('#uavs').append('<p>No products found.</p>');
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
            } else {
                fetchAndRenderUAVs();
            }
        });
    }

    if (searchRental) {
        searchRental.addEventListener('input', function() {
            const query = this.value;
            if (query.length > 0) {
                fetch(`${API_URL}/search/?query=${encodeURIComponent(query)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    $('#my-rentals').empty();
                    if (data.length > 0) {
                        data.forEach(rental => {
                            const startDate = formatDate(rental.start_date);
                            const endDate = formatDate(rental.end_date);
                            $('#my-rentals').append(`
                                <div class="col-md-4">
                                    <div class="card mb-4">
                                        <img src="${rental.product.image_url}" class="card-img-top" alt="${rental.product.name}">
                                        <div class="card-body">
                                            <h5 class="card-title">${rental.product.name}</h5>
                                            <p class="card-text">${rental.product.description}</p>
                                            <p class="card-text">Start Date: ${startDate}</p>
                                            <p class="card-text">End Date: ${endDate}</p>
                                            <button class="btn btn-primary extend-rental-button" data-id="${rental.id}" data-end-date="${rental.end_date}">Extend Rental</button>
                                        </div>
                                    </div>
                                </div>
                            `);
                        });

                        $('.extend-rental-button').on('click', function() {
                            const rentalId = $(this).data('id');
                            const endDate = $(this).data('end-date');

                            $('#extend-rental-id').val(rentalId);
                            $('#extend-end-date').val(endDate);

                            $('#extendRentalModal').modal('show');
                        });
                    } else {
                        $('#my-rentals').append('<p>No rentals found.</p>');
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
            } else {
                fetchAndRenderRentals();
            }
        });
    }

    if (brandFilter) {
        brandFilter.addEventListener('change', applyFilters);
    }
    if (modelFilter) {
        modelFilter.addEventListener('change', applyFilters);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (rentalBrandFilter) {
        rentalBrandFilter.addEventListener('change', applyRentalFilters);
    }
    if (rentalModelFilter) {
        rentalModelFilter.addEventListener('change', applyRentalFilters);
    }
    if (rentalCategoryFilter) {
        rentalCategoryFilter.addEventListener('change', applyRentalFilters);
    }

    if ($('#my-rentals').length) {
        $('#extend-rental-form').on('submit', function(event) {
            event.preventDefault();
            const rentalId = $('#extend-rental-id').val();
            const newEndDate = $('#extend-end-date').val();

            fetch(`${API_URL}/rentals/${rentalId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    end_date: newEndDate
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to extend rental!');
                }
                return response.json();
            })
            .then(data => {
                $('#extendRentalModal').modal('hide');
                fetchAndRenderRentals();
            })
            .catch(error => {
                alert(error.message);
                console.error('Error:', error);
            });
        });
        fetchFilters();
        fetchAndRenderRentals();
    }

    if ($('#uavs').length) {
        fetchFilters();
        fetchAndRenderUAVs();
    }
});
