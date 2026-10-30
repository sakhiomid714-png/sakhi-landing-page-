/* =====================================================
   PRODUCTS
===================================================== */

const products = [

    {
        id: 1,
        name: "Essential Overshirt",
        category: "Men",
        price: 89,
        rating: 4.8,

        image:
            "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80",

        description:
            "A clean everyday overshirt made from a structured cotton blend. Designed for layering and everyday wear.",

        sizes: ["S", "M", "L", "XL"],

        colors: ["Black", "Stone"]
    },


    {
        id: 2,
        name: "Minimal Leather Sneaker",
        category: "Men",
        price: 120,
        rating: 4.7,

        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",

        description:
            "A minimal low-profile sneaker with a comfortable sole and versatile silhouette.",

        sizes: ["40", "41", "42", "43", "44"],

        colors: ["White", "Black"]
    },


    {
        id: 3,
        name: "Studio Hoodie",
        category: "Men",
        price: 74,
        rating: 4.9,

        image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",

        description:
            "Heavyweight fleece hoodie with a relaxed fit, soft interior and premium finish.",

        sizes: ["S", "M", "L", "XL"],

        colors: ["Grey", "Black"]
    },


    {
        id: 4,
        name: "Relaxed Trousers",
        category: "Men",
        price: 95,
        rating: 4.6,

        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",

        description:
            "Relaxed trousers with a clean drape and comfortable everyday construction.",

        sizes: ["S", "M", "L"],

        colors: ["Black", "Beige"]
    },


    {
        id: 5,
        name: "Everyday Tote",
        category: "Women",
        price: 68,
        rating: 4.8,

        image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",

        description:
            "Spacious everyday tote designed to carry your essentials without sacrificing style.",

        sizes: ["One Size"],

        colors: ["Tan", "Black"]
    },


    {
        id: 6,
        name: "Soft Knit Cardigan",
        category: "Women",
        price: 110,
        rating: 4.9,

        image:
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",

        description:
            "Soft textured knit cardigan with a relaxed shape and understated finish.",

        sizes: ["S", "M", "L"],

        colors: ["Cream", "Grey"]
    },


    {
        id: 7,
        name: "Classic Sunglasses",
        category: "Women",
        price: 55,
        rating: 4.5,

        image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",

        description:
            "Classic sunglasses with a lightweight frame and timeless proportions.",

        sizes: ["One Size"],

        colors: ["Black", "Tortoise"]
    },


    {
        id: 8,
        name: "Daily Shoulder Bag",
        category: "Women",
        price: 92,
        rating: 4.7,

        image:
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",

        description:
            "A compact shoulder bag with enough room for your daily essentials.",

        sizes: ["One Size"],

        colors: ["Brown", "Black"]
    }

];


/* =====================================================
   STATE
===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem("novaCart")
    ) || [];


let currentFilter = "All";

let currentSearch = "";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const app =
    document.getElementById("app");


const cartCount =
    document.getElementById("cartCount");


const cartDrawer =
    document.getElementById("cartDrawer");


const overlay =
    document.getElementById("overlay");


const cartItems =
    document.getElementById("cartItems");


const cartSubtotal =
    document.getElementById("cartSubtotal");


const toast =
    document.getElementById("toast");


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function money(number) {

    return `$${number.toFixed(2)}`;

}


function getProduct(id) {

    return products.find(
        product => product.id === id
    );

}


/* =====================================================
   CART STORAGE
===================================================== */

function saveCart() {

    localStorage.setItem(
        "novaCart",
        JSON.stringify(cart)
    );

    renderCart();

    updateCartCount();

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent =
        totalItems;

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(product) {

    return `

        <article class="product-card">

            <a
                href="#product/${product.id}"
                class="product-image"
            >

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </a>


            <div class="product-info">

                <a
                    href="#product/${product.id}"
                    class="product-name"
                >
                    ${product.name}
                </a>


                <div class="product-meta">

                    <span>
                        ${money(product.price)}
                    </span>

                    <span class="rating">
                        ★ ${product.rating}
                    </span>

                </div>


                <div class="product-actions">

                    <button
                        class="small-button dark"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>


                    <a
                        href="#product/${product.id}"
                        class="small-button"
                    >
                        View
                    </a>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   HOME PAGE
===================================================== */

function renderHome() {

    const featuredProducts =
        products.slice(0, 4);


    app.innerHTML = `

        <!-- HERO -->

        <section class="hero">

            <div class="hero-content">

                <div class="eyebrow">
                    New Season / 2026
                </div>

                <h1>
                    Less noise.
                    <br>
                    Better things.
                </h1>

                <p>
                    A modern essentials store built
                    around clean design, useful products
                    and everyday quality.
                </p>

                <a
                    href="#shop"
                    class="primary-button"
                >
                    Shop Collection
                </a>

            </div>

        </section>


        <!-- CATEGORIES -->

        <section class="section container">

            <div class="section-header">

                <div>

                    <div class="eyebrow">
                        Explore
                    </div>

                    <h2>
                        Shop by category
                    </h2>

                </div>

            </div>


            <div class="category-grid">

                <a
                    href="#shop?category=Men"
                    class="category-card"
                >
                    <span>
                        Men
                    </span>
                </a>


                <a
                    href="#shop?category=Women"
                    class="category-card"
                >
                    <span>
                        Women
                    </span>
                </a>


                <a
                    href="#shop"
                    class="category-card"
                >
                    <span>
                        All Products
                    </span>
                </a>

            </div>

        </section>


        <!-- FEATURED PRODUCTS -->

        <section class="section container">

            <div class="section-header">

                <div>

                    <div class="eyebrow">
                        Featured
                    </div>

                    <h2>
                        Best Sellers
                    </h2>

                </div>


                <a
                    href="#shop"
                    class="secondary-button"
                >
                    View All
                </a>

            </div>


            <div class="product-grid">

                ${featuredProducts
                    .map(createProductCard)
                    .join("")}

            </div>

        </section>


        <!-- OFFER -->

        <section class="offer">

            <div class="container offer-content">

                <div>

                    <div class="eyebrow">
                        Limited Offer
                    </div>

                    <h2>
                        15% off your first order.
                    </h2>

                    <p>
                        Use code NOVA15 at checkout.
                    </p>

                </div>


                <a
                    href="#shop"
                    class="secondary-button"
                >
                    Start Shopping
                </a>

            </div>

        </section>


        ${footer()}

    `;

}


/* =====================================================
   FOOTER
===================================================== */

function footer() {

    return `

        <footer class="footer">

            <div class="container footer-grid">

                <div>

                    <h3>
                        NovaStore
                    </h3>

                    <p>
                        Thoughtful essentials
                        for everyday life.
                    </p>

                </div>


                <div>

                    <strong>
                        Shop
                    </strong>

                    <a href="#shop">
                        All Products
                    </a>

                    <a href="#shop?category=Men">
                        Men
                    </a>

                    <a href="#shop?category=Women">
                        Women
                    </a>

                </div>


                <div>

                    <strong>
                        Support
                    </strong>

                    <a href="#">
                        Shipping
                    </a>

                    <a href="#">
                        Returns
                    </a>

                    <a href="#">
                        Contact
                    </a>

                </div>

            </div>

        </footer>

    `;

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function getFilteredProducts() {

    return products.filter(product => {

        const categoryMatch =
            currentFilter === "All" ||
            product.category === currentFilter;


        const searchMatch =
            product.name
                .toLowerCase()
                .includes(
                    currentSearch.toLowerCase()
                );


        return (
            categoryMatch &&
            searchMatch
        );

    });

}


/* =====================================================
   SHOP PAGE
===================================================== */

function renderShop() {

    app.innerHTML = `

        <section class="shop-page container">

            <div class="shop-header">

                <div>

                    <div class="eyebrow">
                        Collection
                    </div>

                    <h1>
                        All Products
                    </h1>

                </div>


                <select
                    class="sort-select"
                    id="sortSelect"
                >

                    <option value="featured">
                        Sort: Featured
                    </option>

                    <option value="low">
                        Price: Low to High
                    </option>

                    <option value="high">
                        Price: High to Low
                    </option>

                    <option value="rating">
                        Rating
                    </option>

                </select>

            </div>


            <div class="filters">

                ${["All", "Men", "Women"]
                    .map(category => `

                        <button
                            class="filter-button
                            ${
                                currentFilter === category
                                    ? "active"
                                    : ""
                            }"
                            onclick="setFilter('${category}')"
                        >
                            ${category}
                        </button>

                    `)
                    .join("")}

            </div>


            <div
                class="product-grid"
                id="shopGrid"
            ></div>

        </section>


        ${footer()}

    `;


    renderShopGrid();


    document
        .getElementById("sortSelect")
        .addEventListener(
            "change",
            renderShopGrid
        );

}


/* =====================================================
   SHOP GRID
===================================================== */

function renderShopGrid() {

    let productList =
        getFilteredProducts();


    const sortValue =
        document.getElementById(
            "sortSelect"
        )?.value;


    if (sortValue === "low") {

        productList.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sortValue === "high") {

        productList.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sortValue === "rating") {

        productList.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    const grid =
        document.getElementById(
            "shopGrid"
        );


    if (!productList.length) {

        grid.innerHTML = `

            <div
                class="empty-state"
                style="grid-column: 1 / -1"
            >

                <h2>
                    No products found
                </h2>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        productList
            .map(createProductCard)
            .join("");

}


/* =====================================================
   SET FILTER
===================================================== */

function setFilter(filter) {

    currentFilter =
        filter;

    renderShop();

}


/* =====================================================
   PRODUCT DETAIL PAGE
===================================================== */

function renderProduct(productId) {

    const product =
        getProduct(
            Number(productId)
        );


    if (!product) {

        location.hash =
            "#shop";

        return;

    }


    let selectedSize =
        product.sizes[0];


    let selectedColor =
        product.colors[0];


    let quantity = 1;


    app.innerHTML = `

        <section class="product-detail">

            <div class="container detail-grid">


                <!-- IMAGE -->

                <div class="detail-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <!-- DETAILS -->

                <div class="detail-content">

                    <div class="eyebrow">
                        ${product.category}
                        / New
                    </div>


                    <h1>
                        ${product.name}
                    </h1>


                    <div class="detail-price">
                        ${money(product.price)}
                    </div>


                    <p class="detail-description">
                        ${product.description}
                    </p>


                    <!-- SIZE -->

                    <div class="option-label">
                        Size
                    </div>


                    <div
                        class="options"
                        id="sizes"
                    >

                        ${product.sizes
                            .map(
                                (size, index) => `

                                <button
                                    class="option
                                    ${
                                        index === 0
                                            ? "selected"
                                            : ""
                                    }"
                                    data-value="${size}"
                                >
                                    ${size}
                                </button>

                            `
                            )
                            .join("")}

                    </div>


                    <!-- COLOR -->

                    <div class="option-label">
                        Color
                    </div>


                    <div
                        class="options"
                        id="colors"
                    >

                        ${product.colors
                            .map(
                                (color, index) => `

                                <button
                                    class="option
                                    ${
                                        index === 0
                                            ? "selected"
                                            : ""
                                    }"
                                    data-value="${color}"
                                >
                                    ${color}
                                </button>

                            `
                            )
                            .join("")}

                    </div>


                    <!-- QUANTITY -->

                    <div class="option-label">
                        Quantity
                    </div>


                    <div class="quantity">

                        <button
                            id="quantityMinus"
                        >
                            −
                        </button>

                        <span id="quantityValue">
                            1
                        </span>

                        <button
                            id="quantityPlus"
                        >
                            +
                        </button>

                    </div>


                    <button
                        class="primary-button full-width"
                        id="detailAdd"
                    >
                        Add to Cart —
                        ${money(product.price)}
                    </button>

                </div>

            </div>

        </section>

    `;


    /* SIZE SELECTION */

    document
        .querySelectorAll(
            "#sizes .option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#sizes .option"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    button.classList
                        .add("selected");


                    selectedSize =
                        button.dataset.value;

                }
            );

        });


    /* COLOR SELECTION */

    document
        .querySelectorAll(
            "#colors .option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#colors .option"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    button.classList
                        .add("selected");


                    selectedColor =
                        button.dataset.value;

                }
            );

        });


    /* QUANTITY MINUS */

    document
        .getElementById(
            "quantityMinus"
        )
        .addEventListener(
            "click",
            () => {

                quantity =
                    Math.max(
                        1,
                        quantity - 1
                    );


                document
                    .getElementById(
                        "quantityValue"
                    )
                    .textContent =
                    quantity;

            }
        );


    /* QUANTITY PLUS */

    document
        .getElementById(
            "quantityPlus"
        )
        .addEventListener(
            "click",
            () => {

                quantity++;


                document
                    .getElementById(
                        "quantityValue"
                    )
                    .textContent =
                    quantity;

            }
        );


    /* ADD TO CART */

    document
        .getElementById(
            "detailAdd"
        )
        .addEventListener(
            "click",
            () => {

                addToCart(
                    product.id,
                    quantity,
                    selectedSize,
                    selectedColor
                );

            }
        );

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    productId,
    quantity = 1,
    size = "Default",
    color = "Default"
) {

    const product =
        getProduct(productId);


    const cartKey =
        `${productId}-${size}-${color}`;


    const existingItem =
        cart.find(
            item =>
                item.key === cartKey
        );


    if (existingItem) {

        existingItem.quantity +=
            quantity;

    } else {

        cart.push({

            key: cartKey,

            productId:
                product.id,

            quantity,

            size,

            color

        });

    }


    saveCart();


    showToast(
        `${product.name} added to cart`
    );


    openCart();

}


/* =====================================================
   CHANGE CART QUANTITY
===================================================== */

function changeCartQuantity(
    key,
    amount
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.key === key
        );


    if (!item) return;


    item.quantity +=
        amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                cartItem =>
                    cartItem.key !== key
            );

    }


    saveCart();

}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

function removeCartItem(key) {

    cart =
        cart.filter(
            item =>
                item.key !== key
        );


    saveCart();

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    if (!cart.length) {

        cartItems.innerHTML = `

            <div class="empty-state">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add something you actually want.
                </p>

            </div>

        `;

    } else {

        cartItems.innerHTML =
            cart
                .map(item => {

                    const product =
                        getProduct(
                            item.productId
                        );


                    return `

                        <div class="cart-row">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >


                            <div>

                                <h4>
                                    ${product.name}
                                </h4>

                                <p>
                                    ${money(product.price)}
                                    · ${item.size}
                                    · ${item.color}
                                </p>


                                <div class="mini-controls">

                                    <button
                                        onclick="
                                            changeCartQuantity(
                                                '${item.key}',
                                                -1
                                            )
                                        "
                                    >
                                        −
                                    </button>


                                    <strong>
                                        ${item.quantity}
                                    </strong>


                                    <button
                                        onclick="
                                            changeCartQuantity(
                                                '${item.key}',
                                                1
                                            )
                                        "
                                    >
                                        +
                                    </button>

                                </div>


                                <button
                                    class="remove-button"
                                    onclick="
                                        removeCartItem(
                                            '${item.key}'
                                        )
                                    "
                                >
                                    Remove
                                </button>

                            </div>


                            <strong>

                                ${money(
                                    product.price *
                                    item.quantity
                                )}

                            </strong>

                        </div>

                    `;

                })
                .join("");

    }


    const subtotal =
        cart.reduce(
            (total, item) => {

                const product =
                    getProduct(
                        item.productId
                    );


                return (
                    total +
                    product.price *
                    item.quantity
                );

            },
            0
        );


    cartSubtotal.textContent =
        money(subtotal);

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    cartDrawer.classList
        .add("open");

    overlay.classList
        .add("open");

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    cartDrawer.classList
        .remove("open");

    overlay.classList
        .remove("open");

}


/* =====================================================
   CHECKOUT PAGE
===================================================== */

function renderCheckout() {

    if (!cart.length) {

        location.hash =
            "#shop";

        showToast(
            "Your cart is empty"
        );

        return;

    }


    const total =
        cart.reduce(
            (sum, item) => {

                const product =
                    getProduct(
                        item.productId
                    );


                return (
                    sum +
                    product.price *
                    item.quantity
                );

            },
            0
        );


    app.innerHTML = `

        <section class="checkout">

            <div class="container checkout-grid">


                <!-- FORM -->

                <div>

                    <div class="eyebrow">
                        Secure Checkout
                    </div>

                    <h1>
                        Complete your order
                    </h1>


                    <form
                        class="form"
                        id="checkoutForm"
                    >

                        <div class="field">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Alex Morgan"
                                required
                            >

                        </div>


                        <div class="field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="alex@example.com"
                                required
                            >

                        </div>


                        <div class="field">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                placeholder="123 Main Street"
                                required
                            >

                        </div>


                        <div class="form two-columns">

                            <div class="field">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    placeholder="New York"
                                    required
                                >

                            </div>


                            <div class="field">

                                <label>
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    placeholder="10001"
                                    required
                                >

                            </div>

                        </div>


                        <div class="field">

                            <label>
                                Payment Method
                            </label>

                            <select>

                                <option>
                                    Credit / Debit Card
                                </option>

                                <option>
                                    Cash on Delivery
                                </option>

                                <option>
                                    PayPal
                                </option>

                            </select>

                        </div>


                        <div class="form two-columns">

                            <div class="field">

                                <label>
                                    Card Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                >

                            </div>


                            <div class="field">

                                <label>
                                    CVV
                                </label>

                                <input
                                    type="text"
                                    placeholder="123"
                                >

                            </div>

                        </div>


                        <button
                            type="submit"
                            class="primary-button full-width"
                        >
                            Place Order —
                            ${money(total)}
                        </button>

                    </form>

                </div>


                <!-- ORDER SUMMARY -->

                <aside class="order-summary">

                    <h2>
                        Order Summary
                    </h2>


                    ${cart
                        .map(item => {

                            const product =
                                getProduct(
                                    item.productId
                                );


                            return `

                                <div class="summary-item">

                                    <span>
                                        ${product.name}
                                        ×
                                        ${item.quantity}
                                    </span>

                                    <strong>
                                        ${money(
                                            product.price *
                                            item.quantity
                                        )}
                                    </strong>

                                </div>

                            `;

                        })
                        .join("")}


                    <div class="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${money(total)}
                        </strong>

                    </div>

                </aside>

            </div>

        </section>

    `;


    /* FORM SUBMIT */

    document
        .getElementById(
            "checkoutForm"
        )
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                cart = [];


                saveCart();


                app.innerHTML = `

                    <section class="checkout">

                        <div class="container">

                            <div class="empty-state">

                                <div class="eyebrow">
                                    Order Confirmed
                                </div>

                                <h2>
                                    Thank you for your order!
                                </h2>

                                <p>
                                    Your demo order
                                    has been placed successfully.
                                </p>

                                <br>

                                <a
                                    href="#shop"
                                    class="primary-button"
                                >
                                    Continue Shopping
                                </a>

                            </div>

                        </div>

                    </section>

                `;

            }
        );

}


/* =====================================================
   ROUTER
===================================================== */

function router() {

    const hash =
        location.hash || "#home";


    /* PRODUCT */

    if (
        hash.startsWith(
            "#product/"
        )
    ) {

        const productId =
            hash.split("/")[1];


        renderProduct(
            productId
        );

    }


    /* CHECKOUT */

    else if (
        hash.startsWith(
            "#checkout"
        )
    ) {

        renderCheckout();

    }


    /* SHOP */

    else if (
        hash.startsWith(
            "#shop"
        )
    ) {

        const query =
            hash.split("?")[1];


        if (query) {

            const params =
                new URLSearchParams(
                    query
                );


            currentFilter =
                params.get(
                    "category"
                ) || "All";

        }


        renderShop();

    }


    /* HOME */

    else {

        renderHome();

    }


    updateCartCount();

}


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(
        "[data-page]"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const filter =
                    link.dataset.filter;


                if (filter) {

                    location.hash =
                        `#shop?category=${filter}`;

                } else {

                    location.hash =
                        `#${link.dataset.page}`;

                }

            }
        );

    });


/* =====================================================
   CART BUTTON
===================================================== */

document
    .getElementById(
        "cartOpen"
    )
    .addEventListener(
        "click",
        openCart
    );


/* =====================================================
   CLOSE CART
===================================================== */

document
    .getElementById(
        "cartClose"
    )
    .addEventListener(
        "click",
        closeCart
    );


document
    .getElementById(
        "overlay"
    )
    .addEventListener(
        "click",
        closeCart
    );


/* =====================================================
   CHECKOUT BUTTON
===================================================== */

document
    .getElementById(
        "checkoutButton"
    )
    .addEventListener(
        "click",
        () => {

            closeCart();

            location.hash =
                "#checkout";

        }
    );


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById(
        "searchToggle"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "searchPanel"
                )
                .classList
                .toggle("open");

        }
    );


document
    .getElementById(
        "globalSearch"
    )
    .addEventListener(
        "input",
        event => {

            currentSearch =
                event.target.value;


            if (
                !location.hash
                    .startsWith("#shop")
            ) {

                location.hash =
                    "#shop";

            } else {

                renderShopGrid();

            }

        }
    );


/* =====================================================
   MOBILE MENU
===================================================== */

document
    .getElementById(
        "menuToggle"
    )
    .addEventListener(
        "click",
        () => {

            const nav =
                document.querySelector(
                    ".nav-links"
                );


            nav.style.display =
                nav.style.display === "flex"
                    ? "none"
                    : "flex";

        }
    );


/* =====================================================
   HASH CHANGE
===================================================== */

window.addEventListener(
    "hashchange",
    router
);


/* =====================================================
   INITIALIZE
===================================================== */

renderCart();

updateCartCount();

router();
