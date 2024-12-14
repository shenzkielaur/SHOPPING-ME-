let couponApplied = false;

const checkout = () => {
    const checkoutItems = document.getElementById("checkout-items");
    const totalElement = document.getElementById("checkout-total");
    let cart = [];

    try {
        // Retrieve cart from localStorage
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Error retrieving cart:", e);
    }

    // Calculate totalPrice
    let totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Save totalPrice to localStorage
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));

    // Display cart items
    if (cart.length > 0) {
        checkoutItems.innerHTML = cart.map(item => `
            <li>${item.name} - P${item.price.toFixed(2)} x ${item.quantity} = P${(item.price * item.quantity).toFixed(2)}</li>
        `).join("");
    } else {
        checkoutItems.innerHTML = "<li>Your cart is empty.</li>";
    }

    // Display total price
    totalElement.textContent = `P${totalPrice.toFixed(2)}`;

    // Open checkout modal
    document.getElementById("checkout-modal").style.display = "flex";
};

// Close Checkout Modal
const closeCheckout = () => {
    document.getElementById("checkout-modal").style.display = "none";
};

// Complete Checkout
const completeCheckout = () => {
    const paymentMethod = document.getElementById("payment-method").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const streetAddress = document.getElementById("street-address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const postalCode = document.getElementById("postal-code").value;
    const country = document.getElementById("country").value;
    const contactNumber = document.getElementById("contact-number").value;

    // Validate required fields
    if (!firstName || !lastName || !streetAddress || !city || !state || !postalCode || !country || !contactNumber) {
        alert("Please fill out all required fields.");
        return;
    }

    // Validate contact number (basic validation)
    const contactNumberRegex = /^[0-9]{10}$/;
    if (!contactNumberRegex.test(contactNumber)) {
        alert("Please enter a valid contact number.");
        return;
    }

    const fullName = `${firstName} ${lastName}`;
    const fullAddress = `${streetAddress}, ${city}, ${state}, ${postalCode}, ${country}`;

    alert(`Order confirmed!\nName: ${fullName}\nAddress: ${fullAddress}\nPayment via: ${paymentMethod}`);

    // Clear the cart and update localStorage
    try {
        localStorage.setItem('cart', JSON.stringify([]));
        localStorage.setItem('totalPrice', '0.00');
    } catch (e) {
        console.error("Error clearing cart data:", e);
    }
    checkout();
    updateCartCount();
    closeCheckout();
};

// Discounts and Coupons
function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim();
    const totalElement = document.getElementById("checkout-total");
    let originalTotal = parseFloat(localStorage.getItem('totalPrice')) || 0.0;

    // Validate the original total
    if (isNaN(originalTotal) || originalTotal <= 0) {
        alert("Unable to apply coupon. Please check your cart.");
        return;
    }

    if (couponCode === 'DISCOUNT10' && !couponApplied) {
        couponApplied = true;

        const discountedTotal = (originalTotal * 0.9).toFixed(2); // 10% off
        totalElement.textContent = `P${discountedTotal}`;

        try {
            localStorage.setItem('totalPrice', discountedTotal);
        } catch (e) {
            console.error("Error saving discounted total to localStorage:", e);
        }

        alert('Coupon applied! You get 10% off.');
    } else if (couponApplied) {
        alert('Coupon already applied!');
    } else {
        alert('Invalid coupon code.');
    }
}

// Update Cart Count
function updateCartCount() {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Error retrieving cart for count:", e);
    }
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}



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
};

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

window.onload = () => {
    // Retrieve total price from localStorage
    const totalPrice = localStorage.getItem('totalPrice') || '0.00';
    document.getElementById("checkout-total").textContent = `P${parseFloat(totalPrice).toFixed(2)}`;

    // Optional: Retrieve cart items if needed
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart items at checkout:", cart);
};


