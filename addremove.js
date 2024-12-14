// Retrieve cart data from localStorage
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (e) {
    console.error("Error parsing cart data:", e);
    cart = []; // Fallback to an empty array
    localStorage.setItem('cart', JSON.stringify(cart)); // Reset cart in localStorage
}

// Function to escape HTML to avoid XSS vulnerabilities
const escapeHTML = str => str.replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[tag] || tag));

// Function to display the cart and its items
const displayCart = () => {
    const cartItems = document.getElementById("cart-items");
    if (cart.length === 0) {
        cartItems.innerHTML = "<li>Your cart is empty.</li>";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <li class="cart-item">
                <input type="checkbox" class="cart-checkbox" data-name="${item.name}" data-image="${item.image}" data-size="${item.size}" data-color="${item.color}">
                <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">
                <div>
                    ${escapeHTML(item.name)} (${escapeHTML(item.size)}, ${escapeHTML(item.color)}) - 
                    P${item.price.toFixed(2)} x ${item.quantity} = 
                    P${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-image="${item.image}" data-name="${item.name}" data-size="${item.size}" data-color="${item.color}">Remove</button>
            </li>
        `).join("");
    }
    
    // Initialize total price based on all items
    updateTotalPrice();
};

// Function to update the total price based on selected items
const updateTotalPrice = () => {
    const selectedItems = document.querySelectorAll('.cart-checkbox:checked');
    let total = 0;

    selectedItems.forEach(checkbox => {
        const item = cart.find(item => item.image === checkbox.dataset.image && item.name === checkbox.dataset.name && item.size === checkbox.dataset.size && item.color === checkbox.dataset.color);
        if (item) {
            total += item.price * item.quantity;
        }
    });

    document.getElementById("cart-total").textContent = total.toFixed(2);
    localStorage.setItem('totalPrice', total.toFixed(2)); // Save the updated total price to localStorage
};

// Event listener for checkbox selection change
document.getElementById("cart-items").addEventListener("change", e => {
    if (e.target.classList.contains("cart-checkbox")) {
        updateTotalPrice();
    }
});

// Event listener to remove items from the cart
document.getElementById("cart-items").addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
        const { image, name, size, color } = e.target.dataset;
        cart = cart.filter(item => !(item.image === image && item.name === name && item.size === size && item.color === color));
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
});

// Proceed to checkout function to handle selected items
const proceedToCheckout = () => {
    // Get the selected items from checkboxes
    const selectedItems = [];
    const checkboxes = document.querySelectorAll('.cart-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const item = {
            name: checkbox.dataset.name,
            image: checkbox.dataset.image,
            size: checkbox.dataset.size,
            color: checkbox.dataset.color
        };
        selectedItems.push(item);
    });

    // Save the selected items and total price before navigation
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems)); 
    localStorage.setItem('totalPrice', document.getElementById("cart-total").textContent);

    // Navigate to checkout page
    window.location.href = "checkout.html";
};

// Dark mode toggle
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');

    document.querySelectorAll('.product-card, .modal-content, header, .reviews-container, .review-form').forEach(el => {
        el.classList.toggle('dark-mode', isDarkMode);
    });

    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Apply dark mode on page load if enabled
window.onload = () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('.product-card, .modal-content, header, .reviews-container, .review-form').forEach(el => {
            el.classList.add('dark-mode');
        });
    }

    // Apply total price from localStorage if it exists
    const totalPrice = localStorage.getItem('totalPrice');
    if (totalPrice) {
        document.getElementById("cart-total").textContent = totalPrice;
    }

    // Display the cart initially
    displayCart();
};
// Language Selector
function changeLanguage() {
    const language = document.getElementById('language').value;
    alert(`Language changed to: ${language}`);
    // Implement further logic to load content in the selected language
}
displayCart();



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
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (username === "admin" && password === "1234") {
        alert(`Welcome, ${username}!`);
        closeLogin();
    } else {
        alert("Invalid username or password.");
        
    }
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

displayCart();