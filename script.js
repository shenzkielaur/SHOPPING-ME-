        // Products by category
const categories = {
    shoes: [
        { name: "Running Shoes", price: 10000, image: "Images/Running_Shoes.jpg" },
        { name: "Casual Sneakers", price: 5000, image: "Images/Casual Shoes.jpg" },
        { name: "Formal Shoes", price: 7000, image: "Images/Formal shoes.jpg" }
    ],
    electronics: [
        { name: "Smartphone", price: 699, image: "Images/Smartphone.jpg" },
        { name: "Laptop", price: 1200, image: "Images/Laptop.jpg" },
        { name: "Smartwatch", price: 199, image: "Images/Smartwatch.jpg" }
    ],
    clothing: [
        { name: "T-Shirt", price: 20, image: "Images/T-shirt.jpg" },
        { name: "Jeans", price: 40, image: "Images/Jeans.jpg" },
        { name: "Jacket", price: 100, image: "Images/Jacket.jpg" }
    ]
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const renderCategoryProducts = (categoryId, products) => {
    const categoryContainer = document.querySelector(`#${categoryId} .products`);
    categoryContainer.innerHTML = products.map((product, index) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>P${product.price.toFixed(2)}</p>
            <button onclick="viewDetails('${categoryId}', ${index})">View Details</button>
        </div>
    `).join("");
};

const viewDetails = (categoryId, index) => {
    const product = categories[categoryId][index];
    document.getElementById("details-image").src = product.image;
    document.getElementById("details-name").textContent = product.name;
    document.getElementById("details-price").textContent = `P${product.price.toFixed(2)}`;
    document.getElementById("product-details").style.display = "flex";
};

// Render products for each category
Object.entries(categories).forEach(([categoryId, products]) => {
    renderCategoryProducts(categoryId, products);
});

const closeDetails = () => {
    document.getElementById("product-details").style.display = "none";
};

// Product Variations
const addToCart = () => {
    const productImage = document.getElementById("details-image").src;
    const productName = document.getElementById("details-name").textContent;
    const productPrice = parseFloat(document.getElementById("details-price").textContent.replace("P", ""));
    const quantity = parseInt(document.getElementById("quantity").value);
    const size = document.getElementById("size").value;
    const color = document.getElementById("color").value;

    if (quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    const existingItem = cart.find(item => item.image == productImage && item.name === productName && item.size === size && item.color === color);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({image: productImage, name: productName, price: productPrice, size, color, quantity });
    }

    saveCartToLocalStorage();
    updateCartCount();
    closeDetails();
};

const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
};

const openCart = () => {
    const cartItems = document.getElementById("cart-items");
    if (cart.length === 0) {
        cartItems.innerHTML = "<li>Your cart is empty.</li>";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <li> ${item.name}, (${item.size}, ${item.color}) - P${item.price.toFixed(2)} x ${item.quantity} = P${(item.price * item.quantity).toFixed(2)}
                <button onclick="removeFromCart('${item.name}', '${item.size}', '${item.color}')">Remove</button>
            </li>
        `).join("");
    }
    document.getElementById("cart-total").textContent = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    document.getElementById("cart-page").style.display = "flex";
};



const removeFromCart = (name, size, color) => {
    cart = cart.filter(item => !(item.name === name && item.size === size && item.color === color));
    saveCartToLocalStorage();
    openCart();
    updateCartCount();
};



// Initialize cart count on page load
window.onload = () => {
    updateCartCount();  // Ensure cart count is updated on page load
};


        const searchProducts = () => {
            const query = document.getElementById('search-bar').value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            let found = false;

            products.forEach(product => {
                const name = product.querySelector('h3').innerText.toLowerCase();
                if (name.includes(query)) {
                    product.style.display = 'block';
                    found = true;
                } else {
                    product.style.display = 'none';
                }
            });

            const productContainer = document.getElementById('products');
            const noResultsMessageId = 'no-results-message';
            let noResultsMessage = document.getElementById(noResultsMessageId);

            if (!found) {
                if (!noResultsMessage) {
                    noResultsMessage = document.createElement('div');
                    noResultsMessage.id = noResultsMessageId;
                    noResultsMessage.style.textAlign = 'center';
                    noResultsMessage.style.marginTop = '20px';
                    noResultsMessage.style.color = '#888';
                    noResultsMessage.innerText = 'No products match your search.';
                    productContainer.appendChild(noResultsMessage);
                }
                // Hide all category labels if no products found
        categories.forEach(category => {
            category.style.display = 'none';
        });
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }
        };
        
        let isLoggedIn = false; // Flag to check if the user is logged in
let username = ''; // Store the username

// Open the login modal
const openLogin = () => {
    document.getElementById("login-modal").style.display = "flex";
};

// Close the login modal
const closeLogin = () => {
    document.getElementById("login-modal").style.display = "none";
    
};

// Handle login form submission
const handleLogin = () => {
    const usernameInput = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!usernameInput || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Check for valid login credentials
    if (usernameInput === "admin" && password === "1234") {
        username = usernameInput;
        isLoggedIn = true;
        alert(`Welcome, ${username}!`);
        document.getElementById("login-modal").style.display = "none";
        document.getElementById("user-name").innerText = username;
    } else {
        alert("Invalid username or password.");
    }
};

// Toggle user options modal
const toggleUserOptions = () => {
    if (isLoggedIn) {
        // Show logout options if the user is logged in
        document.getElementById("user-options-modal").style.display = "flex";
    } else {
        // Show login modal if the user is not logged in
        openLogin();
    }
};

// Logout the user
const logout = () => {
    isLoggedIn = false;
    username = '';
    alert("You have logged out.");
    document.getElementById("user-options-modal").style.display = "none";
};

// Close user options modal
const closeUserOptions = () => {
    document.getElementById("user-options-modal").style.display = "none";
};

const notifications = [
    "Your order #12345 has been shipped!",
    "Your order #12346 is out for delivery!",
    "Your order #12347 has been delivered!",
];

const orders = {
    "12345": "Shipped - Estimated Delivery: Nov 22, 2024",
    "12346": "Out for Delivery - Expected Today",
    "12347": "Delivered on Nov 19, 2024",
};

// Open the notification modal
const openNotification = () => {
    const notificationList = document.getElementById("notification-list");
    notificationList.innerHTML = notifications.map(notification => `<li>${notification}</li>`).join("");
    document.getElementById("notification-modal").style.display = "flex";
};

// Close the notification modal
const closeNotification = () => {
    document.getElementById("notification-modal").style.display = "none";
    closeCart();
};

// Handle order tracking
const trackOrder = (event) => {
    event.preventDefault();
    const orderId = document.getElementById("order-id").value.trim();
    const trackingResult = document.getElementById("tracking-result");

    if (orders[orderId]) {
        trackingResult.style.color = "#333";
        trackingResult.textContent = `Order Status: ${orders[orderId]}`;
    } else {
        trackingResult.style.color = "#ff0000";
        trackingResult.textContent = "Order ID not found. Please check and try again.";
    }
};
function togglePassword() {
    const passwordInput = document.getElementById('login-password');
    const toggleCheckbox = document.getElementById('toggle-password');
    passwordInput.type = toggleCheckbox.checked ? 'text' : 'password';
}


//Dark mode
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');

    // Toggle dark mode for product cards, header, modal content, and review container
    document.querySelectorAll('.product-card, .modal-content, header, .reviews-container, .review-form').forEach(el => {
        el.classList.toggle('dark-mode', isDarkMode);
    });

    // Persist dark mode state in localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Apply dark mode on page load if enabled
window.onload = () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');

        // Apply dark mode to various components
        document.querySelectorAll('.product-card, .modal-content, header, .reviews-container, .review-form').forEach(el => {
            el.classList.add('dark-mode');
        });
    }
};

function applyDarkModeToNewElements() {
    if (document.body.classList.contains('dark-mode')) {
        document.querySelectorAll('.product-card').forEach(el => {
            el.classList.add('dark-mode');
        });
    }
}

// Sort and Filter Products
function updateStatusMessage(message) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
}

function sortProducts() {
    const sortBy = document.getElementById('sort-by').value;

    // Collect all products from all categories with their original index
    const allProducts = [];
    Object.entries(categories).forEach(([categoryId, products]) => {
        products.forEach((product, index) => {
            allProducts.push({ ...product, category: categoryId, originalIndex: index });
        });
    });

    // Sort products based on user selection
    allProducts.sort((a, b) => {
        if (sortBy === 'price-low') {
            return a.price - b.price;
        } else if (sortBy === 'price-high') {
            return b.price - a.price;
        } else if (sortBy === 'popularity') {
            // Assume popularity is a property; you can replace this with a real metric
            return (b.popularity || 0) - (a.popularity || 0);
        } else {
            return 0; // Default order if no valid option is selected
        }
    });

    // Re-render the products
    renderProducts(allProducts);

    // Update status message
    const sortMessage =
        sortBy === 'price-low'
            ? "Price: Low to High"
            : sortBy === 'price-high'
            ? "Price: High to Low"
            : sortBy === 'popularity'
            ? "Popularity"
            : "Default";
            applyDarkModeToNewElements();
}



function filterProducts() {
    const filterBy = document.getElementById('filter-by').value;

    // Get all category sections
    const allSections = document.querySelectorAll('.category');
    if (filterBy === 'all') {
        // Show all sections and all products
        allSections.forEach(section => {
            section.style.display = 'block';
            const products = section.querySelectorAll('.product-card');
            products.forEach(product => product.style.display = 'block');
        });
    } else {
        // Hide all sections initially
        allSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show only the selected section and its products
        const selectedSection = document.getElementById(filterBy);
        if (selectedSection) {
            selectedSection.style.display = 'block';
            const products = selectedSection.querySelectorAll('.product-card');
            products.forEach(product => {
                if (product.dataset.category === filterBy) {
                    product.style.display = 'block';
                } 
            });
        }
    }
    applyDarkModeToNewElements();
}

function updateStatusMessage(message) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
}


//Ratings and reviews
let reviews = {};

function addReview(productId) {
    const reviewInput = document.getElementById(`review-input-${productId}`);
    const ratingInput = document.getElementById(`rating-input-${productId}`);
    const reviewText = reviewInput.value.trim();
    const rating = parseInt(ratingInput.value);

    if (!reviewText || isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please provide a valid rating (1-5) and a review.');
        return;
    }

    if (!reviews[productId]) reviews[productId] = [];
    reviews[productId].push({ reviewText, rating });
    alert('Your review has been submitted!');
    displayReviews(productId);

    // Clear the input fields after submission
    reviewInput.value = '';
    ratingInput.value = '';
}

function displayReviews(productId) {
    const reviewsContainer = document.getElementById(`reviews-container-${productId}`);
    reviewsContainer.innerHTML = reviews[productId] && reviews[productId].length > 0
        ? reviews[productId]
              .map(
                  r =>
                      `<div class="review-item">
                           <span class="rating">${r.rating}/5</span> 
                           <p>${r.reviewText}</p>
                       </div>`
              )
              .join('')
        : '<p class="no-reviews">No reviews yet.</p>';
}
// Chat Support
function toggleChat() {
    const chatModal = document.getElementById('chat-modal');
    chatModal.style.display = chatModal.style.display === 'block' ? 'none' : 'block';
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const messageText = chatInput.value.trim();

    if (messageText) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.textContent = messageText;
        chatMessages.appendChild(messageElement);
        
        // Simulate response from chat support
        setTimeout(() => {
            const response = document.createElement('div');
            response.className = 'message support';
            response.textContent = 'Thank you for your message. We’ll get back to you shortly!';
            chatMessages.appendChild(response);
        }, 1000);

        chatInput.value = '';
    }
}

function closeChat() {
    document.getElementById('chat-support').style.display = 'none';
}
// Order History (Example Data)
const orderHistory = [
    { id: 1, item: 'Running Shoes', date: '2024-12-01', price: '$59.99' },
    { id: 2, item: 'Smartwatch', date: '2024-11-20', price: '$99.99' },
    { id: 3, item: 'Headphones', date: '2024-11-15', price: '$29.99' },
];

function loadOrderHistory() {
    const orderList = document.getElementById('order-list');
    orderHistory.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `${order.item} - ${order.date} - ${order.price}`;
        orderList.appendChild(li);
    });
}
// Discounts and Coupons
function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value;
    if (couponCode === 'DISCOUNT10') {
        alert('Coupon applied! You get 10% off.');
    } else {
        alert('Invalid coupon code.');
    }
}
// Language Selector
function changeLanguage() {
    const language = document.getElementById('language').value;
    alert(`Language changed to: ${language}`);
    // Implement further logic to load content in the selected language
}

//SignUp

function showSignupForm(event) {
    closeLogin();
    // Open the sign-up modal
    const signupModal = document.getElementById('signup-modal');
    signupModal.style.display = 'block';
    event.preventDefault(); // Prevent form submission
    
    // Get form values
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorDiv = document.getElementById('signup-error');
    
    // Reset error message
    errorDiv.textContent = '';
    
    // Validate username
    if (username === '') {
        errorDiv.textContent = 'Username is required.';
        return;
    }
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorDiv.textContent = 'Please enter a valid email address.';
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long.';
        return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        return;
    }
    
    // If all validations pass, simulate successful registration
    alert(`Sign-Up Successful! Welcome, ${username}!`);
    
    // Clear the form
    document.getElementById('signup-form').reset();
    
    // Close the sign-up modal
    closeSignup();
}


function closeSignup() {
    document.getElementById('signup-modal').style.display = 'none';
}

function renderProducts(productsToDisplay) {
    const productSections = {
        shoes: document.querySelector("#shoes .products"),
        electronics: document.querySelector("#electronics .products"),
        clothing: document.querySelector("#clothing .products"),
    };

    // Clear existing products in each category
    Object.values(productSections).forEach(section => (section.innerHTML = ""));

    // Group sorted products back into their categories
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-card");
        productDiv.dataset.price = product.price;
        productDiv.dataset.popularity = product.popularity || 0; // Handle undefined popularity
        productDiv.dataset.index = product.originalIndex; // Save the original index
        productDiv.dataset.category = product.category; // Save the category

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>P${product.price.toFixed(2)}</p>
            <button onclick="viewDetails('${product.category}', ${product.originalIndex})">View Details</button>
        `;
        productSections[product.category].appendChild(productDiv);
    });
}

        // Render products
        Object.entries(categories).forEach(([categoryId, products]) => {
            renderCategoryProducts(categoryId, products);
        });

        // Save cart to localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Initialize page
window.onload = loadProducts;



