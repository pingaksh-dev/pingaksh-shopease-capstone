/* =========================================================
   ShopEase - E-Commerce Capstone
   Main JavaScript
========================================================= */

"use strict";

/* =========================================================
   Product Data
========================================================= */

const products = [
    {
        id: 1,
        name: "Nova Wireless Headphones",
        category: "electronics",
        price: 2999,
        icon: "🎧",
        description: "Comfortable wireless headphones with clear sound and long battery life.",
        featured: true
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "electronics",
        price: 3499,
        icon: "⌚",
        description: "Track your daily activity, workouts and essential fitness metrics.",
        featured: true
    },
    {
        id: 3,
        name: "Portable Bluetooth Speaker",
        category: "electronics",
        price: 1999,
        icon: "🔊",
        description: "Compact wireless speaker designed for music at home or outdoors.",
        featured: true
    },
    {
        id: 4,
        name: "Minimal Backpack",
        category: "fashion",
        price: 1499,
        icon: "🎒",
        description: "A lightweight everyday backpack with a clean modern design.",
        featured: true
    },
    {
        id: 5,
        name: "Classic Cotton T-Shirt",
        category: "fashion",
        price: 799,
        icon: "👕",
        description: "Soft cotton everyday T-shirt with a comfortable regular fit.",
        featured: false
    },
    {
        id: 6,
        name: "Urban Running Shoes",
        category: "fashion",
        price: 2499,
        icon: "👟",
        description: "Lightweight shoes designed for comfortable everyday movement.",
        featured: false
    },
    {
        id: 7,
        name: "Desk Organizer",
        category: "home",
        price: 699,
        icon: "🗂️",
        description: "Keep your workspace organized with this compact desk organizer.",
        featured: false
    },
    {
        id: 8,
        name: "LED Study Lamp",
        category: "home",
        price: 1299,
        icon: "💡",
        description: "Modern LED desk lamp with an adjustable and practical design.",
        featured: false
    },
    {
        id: 9,
        name: "Ceramic Coffee Mug",
        category: "home",
        price: 499,
        icon: "☕",
        description: "Simple ceramic mug suitable for coffee, tea and everyday use.",
        featured: false
    },
    {
        id: 10,
        name: "Adjustable Dumbbells",
        category: "fitness",
        price: 3999,
        icon: "🏋️",
        description: "Space-saving adjustable dumbbells for convenient home workouts.",
        featured: false
    },
    {
        id: 11,
        name: "Resistance Band Set",
        category: "fitness",
        price: 899,
        icon: "💪",
        description: "Versatile resistance bands for strength and mobility exercises.",
        featured: false
    },
    {
        id: 12,
        name: "Yoga Mat",
        category: "fitness",
        price: 999,
        icon: "🧘",
        description: "Comfortable non-slip yoga mat for stretching and floor workouts.",
        featured: false
    }
];


/* =========================================================
   Application State
========================================================= */

const STORAGE_KEY = "shopease-cart";

let cart = loadCart();

let currentCategory = "all";
let currentSearch = "";


/* =========================================================
   Utility Functions
========================================================= */

function getProduct(productId) {

    return products.find(
        product => product.id === Number(productId)
    );
}


function formatPrice(price) {

    return Number(price).toLocaleString("en-IN");
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   Local Storage
========================================================= */

function loadCart() {

    try {

        const savedCart =
            JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!Array.isArray(savedCart)) {
            return [];
        }

        return savedCart
            .filter(item =>
                getProduct(item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
            .map(item => ({
                id: Number(item.id),
                quantity: item.quantity
            }));

    } catch (error) {

        console.warn("Could not load cart:", error);

        return [];
    }
}


function saveCart() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn("Could not save cart:", error);
    }

    updateCartCount();
}


/* =========================================================
   Cart Count
========================================================= */

function getCartQuantity() {

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );
}


function updateCartCount() {

    const countElements =
        document.querySelectorAll("#cart-count");

    const totalQuantity = getCartQuantity();

    countElements.forEach(element => {

        element.textContent = totalQuantity;
    });
}


/* =========================================================
   Product Card
========================================================= */

function createProductCard(product) {

    return `
        <article class="product-card">

            <div class="product-image"
                 aria-hidden="true">

                <span>
                    ${product.icon}
                </span>

            </div>

            <div class="product-content">

                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>

                <h3 class="product-title">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <strong class="product-price">
                        ₹${formatPrice(product.price)}
                    </strong>

                    <div class="product-actions">

                        <button
                            type="button"
                            class="small-button secondary-small"
                            data-action="view"
                            data-id="${product.id}">
                            View
                        </button>

                        <button
                            type="button"
                            class="small-button primary-small"
                            data-action="add"
                            data-id="${product.id}">
                            Add
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   Add Product To Cart
========================================================= */

function addToCart(productId) {

    const product = getProduct(productId);

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(item => item.id === product.id);

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();

    renderCart();

    showMessage(
        `${product.name} added to your cart.`
    );
}


/* =========================================================
   Remove Product
========================================================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== Number(productId)
    );

    saveCart();

    renderCart();
}


/* =========================================================
   Change Quantity
========================================================= */

function changeQuantity(productId, change) {

    const item = cart.find(
        cartItem => cartItem.id === Number(productId)
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(
            cartItem => cartItem.id !== Number(productId)
        );
    }

    saveCart();

    renderCart();
}


/* =========================================================
   Product Catalog
========================================================= */

function getFilteredProducts() {

    return products.filter(product => {

        const matchesCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        const searchText =
            currentSearch.trim().toLowerCase();

        const matchesSearch =
            searchText === "" ||
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });
}


function renderProducts() {

    const grid =
        document.querySelector("#products-grid");

    const emptyState =
        document.querySelector("#products-empty");

    const countElement =
        document.querySelector("#product-count");

    if (!grid) {
        return;
    }

    const filteredProducts =
        getFilteredProducts();

    grid.innerHTML =
        filteredProducts
            .map(createProductCard)
            .join("");

    if (countElement) {

        const count = filteredProducts.length;

        countElement.textContent =
            `${count} ${count === 1 ? "product" : "products"}`;
    }

    if (emptyState) {

        emptyState.classList.toggle(
            "hidden",
            filteredProducts.length !== 0
        );
    }

    updateFilterButtons();
}


function updateFilterButtons() {

    const buttons =
        document.querySelectorAll(".category-filter");

    buttons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.category === currentCategory
        );
    });
}


/* =========================================================
   Product Search
========================================================= */

function setupProductSearch() {

    const searchInput =
        document.querySelector("#product-search");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        event => {

            currentSearch =
                event.target.value;

            renderProducts();
        }
    );
}


/* =========================================================
   Category Filters
========================================================= */

function setupCategoryFilters() {

    const filterContainer =
        document.querySelector(".category-filters");

    if (!filterContainer) {
        return;
    }

    filterContainer.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(".category-filter");

            if (!button) {
                return;
            }

            currentCategory =
                button.dataset.category || "all";

            updateCategoryURL();

            renderProducts();
        }
    );
}


function updateCategoryURL() {

    const url =
        new URL(window.location.href);

    if (currentCategory === "all") {

        url.searchParams.delete("category");

    } else {

        url.searchParams.set(
            "category",
            currentCategory
        );
    }

    window.history.replaceState(
        {},
        "",
        url
    );
}


function loadCategoryFromURL() {

    const params =
        new URLSearchParams(window.location.search);

    const category =
        params.get("category");

    const validCategories = [
        "all",
        "electronics",
        "fashion",
        "home",
        "fitness"
    ];

    if (validCategories.includes(category)) {

        currentCategory = category;

    } else {

        currentCategory = "all";
    }
}


/* =========================================================
   Featured Products
========================================================= */

function renderFeaturedProducts() {

    const container =
        document.querySelector("#featured-products");

    if (!container) {
        return;
    }

    const featured =
        products
            .filter(product => product.featured)
            .slice(0, 4);

    container.innerHTML =
        featured
            .map(createProductCard)
            .join("");
}


/* =========================================================
   Product Details
========================================================= */

function renderProductDetails() {

    const container =
        document.querySelector("#product-detail");

    const notFound =
        document.querySelector("#product-not-found");

    if (!container) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("id");

    const product =
        getProduct(productId);

    if (!product) {

        container.innerHTML = "";

        if (notFound) {
            notFound.classList.remove("hidden");
        }

        return;
    }

    if (notFound) {
        notFound.classList.add("hidden");
    }

    container.innerHTML = `
        <div class="product-detail-image"
             aria-hidden="true">

            <span>
                ${product.icon}
            </span>

        </div>

        <div class="product-detail-content">

            <p class="product-detail-category">
                ${escapeHTML(product.category)}
            </p>

            <h1>
                ${escapeHTML(product.name)}
            </h1>

            <p class="product-detail-description">
                ${escapeHTML(product.description)}
            </p>

            <div class="product-detail-price">
                ₹${formatPrice(product.price)}
            </div>

            <div class="product-detail-actions">

                <button
                    type="button"
                    class="button primary"
                    data-action="add"
                    data-id="${product.id}">
                    Add to Cart
                </button>

                <a
                    href="cart.html"
                    class="button secondary">
                    View Cart
                </a>

            </div>

            <div class="product-detail-info">

                <div>
                    <strong>Category</strong>
                    <span>
                        ${escapeHTML(product.category)}
                    </span>
                </div>

                <div>
                    <strong>Availability</strong>
                    <span>In Stock</span>
                </div>

                <div>
                    <strong>Delivery</strong>
                    <span>Free Delivery</span>
                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   Cart Page
========================================================= */

function renderCart() {

    const cartContainer =
        document.querySelector("#cart-items");

    if (!cartContainer) {
        return;
    }

    const emptyCart =
        document.querySelector("#empty-cart");

    const cartItemsCount =
        document.querySelector("#cart-items-count");

    const summaryItems =
        document.querySelector("#summary-items");

    const subtotalElement =
        document.querySelector("#cart-subtotal");

    const totalElement =
        document.querySelector("#cart-total");

    const checkoutButton =
        document.querySelector("#checkout-button");


    if (cart.length === 0) {

        cartContainer.innerHTML = "";

        if (emptyCart) {
            emptyCart.classList.remove("hidden");
        }

        if (cartItemsCount) {
            cartItemsCount.textContent = "0 items";
        }

        if (summaryItems) {
            summaryItems.textContent = "0";
        }

        if (subtotalElement) {
            subtotalElement.textContent = "0";
        }

        if (totalElement) {
            totalElement.textContent = "0";
        }

        if (checkoutButton) {
            checkoutButton.disabled = true;
        }

        return;
    }


    if (emptyCart) {
        emptyCart.classList.add("hidden");
    }


    let subtotal = 0;
    let totalQuantity = 0;


    cartContainer.innerHTML =
        cart.map(item => {

            const product =
                getProduct(item.id);

            if (!product) {
                return "";
            }

            const itemTotal =
                product.price * item.quantity;

            subtotal += itemTotal;

            totalQuantity += item.quantity;


            return `
                <article class="cart-item">

                    <div class="cart-item-image"
                         aria-hidden="true">

                        <span>
                            ${product.icon}
                        </span>

                    </div>

                    <div class="cart-item-details">

                        <p class="product-category">
                            ${escapeHTML(product.category)}
                        </p>

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <p>
                            ₹${formatPrice(product.price)}
                            each
                        </p>

                    </div>

                    <div class="cart-item-controls">

                        <div class="quantity-controls">

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="decrease"
                                data-id="${product.id}"
                                aria-label="Decrease quantity">
                                −
                            </button>

                            <span class="quantity-value">
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="increase"
                                data-id="${product.id}"
                                aria-label="Increase quantity">
                                +
                            </button>

                        </div>

                        <strong class="cart-item-total">
                            ₹${formatPrice(itemTotal)}
                        </strong>

                        <button
                            type="button"
                            class="remove-button"
                            data-action="remove"
                            data-id="${product.id}">
                            Remove
                        </button>

                    </div>

                </article>
            `;

        }).join("");


    if (cartItemsCount) {

        cartItemsCount.textContent =
            `${totalQuantity} ${
                totalQuantity === 1 ? "item" : "items"
            }`;
    }


    if (summaryItems) {
        summaryItems.textContent = totalQuantity;
    }


    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }


    if (totalElement) {
        totalElement.textContent =
            formatPrice(subtotal);
    }


    if (checkoutButton) {
        checkoutButton.disabled = false;
    }
}


/* =========================================================
   Checkout
========================================================= */

function setupCheckout() {

    const checkoutButton =
        document.querySelector("#checkout-button");

    if (!checkoutButton) {
        return;
    }

    checkoutButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showMessage(
                    "Your cart is empty."
                );

                return;
            }

            alert(
                "Checkout demonstration successful! " +
                "No real payment will be processed."
            );
        }
    );
}


/* =========================================================
   Product Navigation
========================================================= */

function viewProduct(productId) {

    const product =
        getProduct(productId);

    if (!product) {
        return;
    }

    window.location.href =
        `product.html?id=${product.id}`;
}


/* =========================================================
   Global Event Delegation
========================================================= */

function setupGlobalActions() {

    document.addEventListener(
        "click",
        event => {

            const actionElement =
                event.target.closest("[data-action]");

            if (!actionElement) {
                return;
            }

            const action =
                actionElement.dataset.action;

            const productId =
                Number(actionElement.dataset.id);


            switch (action) {

                case "add":

                    addToCart(productId);
                    break;


                case "view":

                    viewProduct(productId);
                    break;


                case "increase":

                    changeQuantity(productId, 1);
                    break;


                case "decrease":

                    changeQuantity(productId, -1);
                    break;


                case "remove":

                    removeFromCart(productId);
                    break;
            }
        }
    );
}


/* =========================================================
   Simple Notification
========================================================= */

function showMessage(message) {

    const oldMessage =
        document.querySelector(".site-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageElement =
        document.createElement("div");

    messageElement.className =
        "site-message";

    messageElement.setAttribute(
        "role",
        "status"
    );

    messageElement.textContent =
        message;

    document.body.appendChild(
        messageElement
    );

    setTimeout(() => {

        messageElement.classList.add(
            "hide"
        );

        setTimeout(() => {
            messageElement.remove();
        }, 250);

    }, 2200);
}


/* =========================================================
   Client-Side Route Detection
========================================================= */

function getCurrentPage() {

    const path =
        window.location.pathname.toLowerCase();

    if (
        path.endsWith("/") ||
        path.endsWith("/index.html")
    ) {
        return "home";
    }

    if (path.endsWith("/products.html")) {
        return "products";
    }

    if (path.endsWith("/product.html")) {
        return "product";
    }

    if (path.endsWith("/cart.html")) {
        return "cart";
    }

    return "home";
}


/* =========================================================
   Application Initialization
========================================================= */

function initializeApp() {

    const currentPage =
        getCurrentPage();


    /* Update cart number on every page */

    updateCartCount();


    /* Global product/cart actions */

    setupGlobalActions();


    /* Home page */

    if (currentPage === "home") {

        renderFeaturedProducts();
    }


    /* Products page */

    if (currentPage === "products") {

        loadCategoryFromURL();

        renderProducts();

        setupProductSearch();

        setupCategoryFilters();
    }


    /* Product details page */

    if (currentPage === "product") {

        renderProductDetails();
    }


    /* Cart page */

    if (currentPage === "cart") {

        renderCart();

        setupCheckout();
    }
}


/* =========================================================
   Start Application
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);