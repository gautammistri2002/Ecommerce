// ==========================================
// PRODUCT DATA
// ==========================================

const products = [

    {
        id: 1,
        brand: "Apple",
        name: "iPhone 15 Pro",
        category: "Mobile",
        price: 134900,
        oldPrice: 144900,
        rating: 4.8,
        storage: "8/128",
        screen: "6.5",
        icon: '<img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80" alt="iPhone" style="width:100%;height:100%;object-fit:cover;">',
        specification: "8GB RAM • 128GB Storage • 5G • Super Retina XDR"
    },

    {
        id: 2,
        brand: "HP",
        name: "HP Spectre x360",
        category: "Laptop",
        price: 114999,
        oldPrice: 134999,
        rating: 4.7,
        storage: "16/512",
        screen: "15.6",
        icon: '<img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=500&q=80" alt="HP Laptop" style="width:100%;height:100%;object-fit:cover;">',
        specification: "16GB RAM • 512GB SSD • 15.6 inch 4K Touch"
    },

    {
        id: 3,
        brand: "Samsung",
        name: "Galaxy S24 Ultra",
        category: "Mobile",
        price: 129999,
        oldPrice: 149999,
        rating: 4.9,
        storage: "16/512",
        screen: "6.5",
        icon: '<img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80" alt="Samsung Mobile" style="width:100%;height:100%;object-fit:cover;">',
        specification: "16GB RAM • 512GB Storage • 5G • Dynamic AMOLED"
    },

    {
        id: 4,
        brand: "Dell",
        name: "Dell XPS 15",
        category: "Laptop",
        price: 164999,
        oldPrice: 184999,
        rating: 4.8,
        storage: "16/1000",
        screen: "15.6",
        icon: '<img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80" alt="Dell Laptop" style="width:100%;height:100%;object-fit:cover;">',
        specification: "16GB RAM • 1TB SSD • 15.6 inch OLED"
    },

    {
        id: 5,
        brand: "Vivo",
        name: "Vivo X100 Pro",
        category: "Mobile",
        price: 89999,
        oldPrice: 94999,
        rating: 4.6,
        storage: "8/128",
        screen: "6.5",
        icon: '<img src="https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&w=500&q=80" alt="Vivo Mobile" style="width:100%;height:100%;object-fit:cover;">',
        specification: "8GB RAM • 128GB Storage • Zeiss Optics • AMOLED"
    },

    {
        id: 6,
        brand: "Lenovo",
        name: "Lenovo ThinkPad X1",
        category: "Laptop",
        price: 144999,
        oldPrice: 164999,
        rating: 4.7,
        storage: "16/1000",
        screen: "15.6",
        icon: '<img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80" alt="Lenovo Laptop" style="width:100%;height:100%;object-fit:cover;">',
        specification: "16GB RAM • 1TB SSD • Ultra Slim • 4K Display"
    },

    {
        id: 7,
        brand: "Apple",
        name: "AirPods Pro",
        category: "Audio",
        price: 24900,
        oldPrice: 26900,
        rating: 4.9,
        storage: "all",
        screen: "all",
        icon: '<img src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=500&q=80" alt="AirPods Pro" style="width:100%;height:100%;object-fit:cover;">',
        specification: "Active Noise Cancellation • Spatial Audio"
    },

    {
        id: 8,
        brand: "Asus",
        name: "Asus ROG Zephyrus",
        category: "Laptop",
        price: 154999,
        oldPrice: 179999,
        rating: 4.8,
        storage: "16/1000",
        screen: "15.6",
        icon: '<img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80" alt="Asus Laptop" style="width:100%;height:100%;object-fit:cover;">',
        specification: "16GB RAM • 1TB SSD • RTX 4080 • Mini LED"
    }

];


// ==========================================
// USER PRIVACY & DATA ISOLATION (STRICT PER ACCOUNT)
// ==========================================

function getActiveUserEmail() {
    try {
        const stored = localStorage.getItem("electromart_user");
        if (stored) {
            const user = JSON.parse(stored);
            if (user && user.email) {
                return user.email.toLowerCase().trim();
            }
        }
    } catch (e) { }
    return null;
}

function getCartStorageKey() {
    const email = getActiveUserEmail();
    return email ? `cart_user_${email}` : "cart_guest";
}

function getWishlistStorageKey() {
    const email = getActiveUserEmail();
    return email ? `wishlist_user_${email}` : "wishlist_guest";
}

let cart = [];
let wishlist = [];

function loadUserData() {
    // Purge old global shared keys so they never leak into any account
    try {
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
    } catch (e) { }

    const cartKey = getCartStorageKey();
    const wishKey = getWishlistStorageKey();

    try {
        const cartData = localStorage.getItem(cartKey);
        cart = cartData ? JSON.parse(cartData) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        cart = [];
    }

    try {
        const wishData = localStorage.getItem(wishKey);
        wishlist = wishData ? JSON.parse(wishData) : [];
        if (!Array.isArray(wishlist)) wishlist = [];
    } catch (e) {
        wishlist = [];
    }

    updateCartCount();
}

// Function alias for backward compatibility
function loadUserCart() {
    loadUserData();
}

// Initial load for active session
loadUserData();


// ==========================================
// SAVE DATA (STRICT PER-USER PRIVACY)
// ==========================================

function saveData() {
    const cartKey = getCartStorageKey();
    const wishKey = getWishlistStorageKey();

    // Save strictly to this active user's key only!
    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem(wishKey, JSON.stringify(wishlist));

    // Never save to generic 'cart' or 'wishlist' to prevent cross-account leaks
    try {
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");
    } catch (e) { }

    updateCartCount();
}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (countEl) {
        countEl.innerText = cart.length;
    }
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

let currentProductList = products;

function displayProducts(list = currentProductList) {
    currentProductList = list;

    const container =
        document.getElementById(
            "productContainer"
        );
    if (!container) return;

    const countEl = document.getElementById("productCount");
    if (countEl) {
        countEl.innerText = list.length + " Products";
    }


    if (list.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column:1/-1;
                background:white;
                padding:50px;
                text-align:center;
                border-radius:12px;
            ">
                <h2>No Products Found</h2>

                <p>
                    Try changing your filters.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    list.forEach(product => {

        const isWishlisted =
            wishlist.includes(product.id);
        const inCart =
            cart.includes(product.id);


        container.innerHTML += `

            <div class="product">

                <button
                    class="wishlist"
                    onclick="toggleWishlist(${product.id})"
                >

                    ${isWishlisted
                ? '<i class="fa-solid fa-heart" style="color: red;"></i>'
                : '<i class="fa-regular fa-heart"></i>'
            }

                </button>


                <div class="product-image">

                    ${product.icon}

                </div>


                <div class="product-info">

                    <div class="brand">

                        ${product.brand}

                    </div>


                    <h3>

                        ${product.name}

                    </h3>


                    <div class="specification">

                        ${product.specification}

                    </div>


                    <div class="rating">

                        ★ ${product.rating}

                        • Assured Quality

                    </div>


                    <div class="price">

                        ₹${product.price.toLocaleString("en-IN")}

                        <span class="old-price">

                            ₹${product.oldPrice.toLocaleString("en-IN")}

                        </span>

                    </div>


                    <div class="product-buttons">

                        <button
                            onclick="productDetails(${product.id})"
                        >

                            Details

                        </button>


                        ${inCart
                ? `<button
                                class="buy in-cart"
                                onclick="removeFromCart(${product.id})"
                                style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5;"
                                title="Remove from cart"
                              >
                                <i class="fa-solid fa-trash-can" style="margin-right:4px;"></i> Remove
                              </button>`
                : `<button
                                class="buy"
                                onclick="addToCart(${product.id})"
                              >
                                Add To Cart
                              </button>`
            }

                    </div>

                </div>

            </div>

        `;

    });

}


// ==========================================
// ADD TO CART & CART ACTIONS
// ==========================================

function addToCart(id) {
    cart.push(id);
    saveData();
    displayProducts();
    showToast("Product added to cart!");
}

function removeFromCart(id) {
    const before = cart.length;
    cart = cart.filter(productId => productId !== id);
    saveData();
    displayProducts();
    if (cart.length < before) {
        showToast("Removed from cart");
    }
}

function removeCartItemByIndex(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveData();
        displayProducts();
        showToast("Item removed from cart");
        showCart();
    }
}

function changeCartQuantity(id, delta) {
    if (delta > 0) {
        cart.push(id);
    } else if (delta < 0) {
        const idx = cart.indexOf(id);
        if (idx !== -1) {
            cart.splice(idx, 1);
        }
    }
    saveData();
    displayProducts();
    showCart();
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    saveData();
    displayProducts();
    showToast("Cart cleared");
    showCart();
}


// ==========================================
// WISHLIST
// ==========================================

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                productId =>
                    productId !== id
            );

        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(id);

        showToast(
            "Added to wishlist"
        );
    }


    saveData();

    displayProducts();
}


// ==========================================
// SHOW WISHLIST (ACCOUNT ISOLATED)
// ==========================================

function showWishlist() {
    const user = getLoggedInUser();
    const titleText = user && user.name ? `${user.name.split(' ')[0]}'s Wishlist` : "My Wishlist";
    const items = products.filter(product => wishlist.includes(product.id));

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">
            <h2 style="margin:0; font-size:22px; color:#1e293b; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-heart" style="color:#ef4444;"></i> ${titleText}
            </h2>
            ${user && user.email
            ? `<span style="font-size:12px; color:#10b981; background:#ecfdf5; border:1px solid #a7f3d0; padding:4px 10px; border-radius:20px; font-weight:600;"><i class="fa-solid fa-circle-check"></i> ${user.email}</span>`
            : `<span style="font-size:12px; color:#64748b; background:#f1f5f9; padding:4px 10px; border-radius:20px;">Guest Wishlist</span>`
        }
        </div>
    `;

    if (items.length === 0) {
        html += `
            <div style="text-align:center; padding:45px 15px;">
                <i class="fa-regular fa-heart" style="font-size:38px; color:#94a3b8; margin-bottom:12px;"></i>
                <h3 style="color:#1e293b; margin-bottom:6px; font-size:18px;">Your wishlist is empty</h3>
                <p style="color:#94a3b8; font-size:14px;">Heart items while browsing to save them to your account.</p>
            </div>
        `;
    } else {
        html += `<div style="max-height:360px; overflow-y:auto; padding-right:6px;">`;
        items.forEach(product => {
            const inCart = cart.includes(product.id);
            html += `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; margin-bottom:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; gap:10px;">
                    <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                        <div style="width:48px; height:48px; border-radius:8px; overflow:hidden; background:white; display:flex; align-items:center; justify-content:center; border:1px solid #e2e8f0; flex-shrink:0;">
                            ${product.icon}
                        </div>
                        <div style="overflow:hidden;">
                            <div style="font-weight:700; color:#1e293b; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${product.name}</div>
                            <div style="font-size:12px; color:#64748b;">${product.brand} • <b style="color:#0f172a;">₹${product.price.toLocaleString("en-IN")}</b></div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                        <button onclick="${inCart ? `removeFromCart(${product.id})` : `addToCart(${product.id})`}; showWishlist();" style="padding:7px 12px; border-radius:6px; border:none; background:${inCart ? '#fee2e2' : '#155eef'}; color:${inCart ? '#dc2626' : 'white'}; font-weight:600; font-size:12px; cursor:pointer;">
                            ${inCart ? 'Remove from Cart' : 'Move to Cart'}
                        </button>
                        <button onclick="toggleWishlist(${product.id}); showWishlist();" style="border:none; background:#fee2e2; color:#ef4444; width:32px; height:32px; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Remove from wishlist">
                            <i class="fa-solid fa-trash-can" style="font-size:12px;"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    openModal(html);
}


// ==========================================
// SHOW CART (FULL FUNCTION WITH REMOVE & QUANTITY)
// ==========================================

function showCart() {
    const user = getLoggedInUser();
    const titleText = user && user.name ? `${user.name.split(' ')[0]}'s Cart` : "Shopping Cart";

    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">
            <h2 style="margin:0; font-size:22px; color:#1e293b; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-cart-shopping" style="color:#155eef;"></i> ${titleText}
            </h2>
            ${user && user.email
            ? `<span style="font-size:12px; color:#10b981; background:#ecfdf5; border:1px solid #a7f3d0; padding:4px 10px; border-radius:20px; font-weight:600;"><i class="fa-solid fa-circle-check"></i> ${user.email}</span>`
            : `<span style="font-size:12px; color:#64748b; background:#f1f5f9; padding:4px 10px; border-radius:20px;">Guest Cart</span>`
        }
        </div>
    `;

    if (cart.length === 0) {
        html += `
            <div style="text-align:center; padding:45px 15px;">
                <div style="width:70px; height:70px; background:#eff6ff; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:15px;">
                    <i class="fa-solid fa-cart-arrow-down" style="font-size:32px; color:#155eef;"></i>
                </div>
                <h3 style="color:#1e293b; margin-bottom:6px; font-size:18px;">Your cart is empty</h3>
                <p style="color:#94a3b8; font-size:14px; margin-bottom:22px;">Add items to your cart to see them here.</p>
                <button onclick="closeModal()" style="background:#155eef; color:white; border:none; padding:12px 28px; border-radius:8px; font-weight:600; cursor:pointer; font-size:14px; box-shadow:0 4px 12px rgba(21,94,239,0.25);">
                    Continue Shopping
                </button>
            </div>
        `;
        openModal(html);
        return;
    }

    // Group items by ID
    const counts = {};
    cart.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });

    let total = 0;
    html += `<div style="max-height:360px; overflow-y:auto; padding-right:6px;">`;

    Object.keys(counts).forEach(idStr => {
        const id = parseInt(idStr, 10);
        const qty = counts[id];
        const product = products.find(p => p.id === id);
        if (!product) return;

        const subtotal = product.price * qty;
        total += subtotal;

        html += `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:14px; margin-bottom:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; gap:12px;">
                <div style="display:flex; align-items:center; gap:14px; flex:1; min-width:0;">
                    <div style="width:52px; height:52px; border-radius:8px; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #e2e8f0; flex-shrink:0;">
                        ${product.icon}
                    </div>
                    <div style="overflow:hidden;">
                        <div style="font-weight:700; color:#1e293b; font-size:15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${product.name}</div>
                        <div style="font-size:12px; color:#64748b; margin-top:2px;">
                            ${product.brand} • <b style="color:#0f172a;">₹${product.price.toLocaleString("en-IN")}</b> each
                        </div>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap:14px; flex-shrink:0;">
                    <!-- Quantity controls -->
                    <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:8px; background:white; overflow:hidden;">
                        <button onclick="changeCartQuantity(${product.id}, -1)" style="border:none; background:transparent; padding:6px 10px; cursor:pointer; font-weight:bold; color:#475569; font-size:14px;" title="Decrease">−</button>
                        <span style="padding:4px 8px; font-size:13px; font-weight:700; min-width:24px; text-align:center; color:#0f172a;">${qty}</span>
                        <button onclick="changeCartQuantity(${product.id}, 1)" style="border:none; background:transparent; padding:6px 10px; cursor:pointer; font-weight:bold; color:#475569; font-size:14px;" title="Increase">+</button>
                    </div>

                    <!-- Subtotal -->
                    <div style="min-width:90px; text-align:right; font-weight:800; color:#0f172a; font-size:15px;">
                        ₹${subtotal.toLocaleString("en-IN")}
                    </div>

                    <!-- Remove Item Button -->
                    <button onclick="removeFromCart(${product.id}); showCart();" style="border:none; background:#fee2e2; color:#ef4444; width:34px; height:34px; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s;" title="Remove ${product.name} from cart">
                        <i class="fa-solid fa-trash-can" style="font-size:14px;"></i>
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;

    html += `
        <div style="margin-top:16px; border-top:2px solid #e2e8f0; padding-top:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px; color:#64748b;">
                <span>Total Items in Cart:</span>
                <b style="color:#1e293b;">${cart.length}</b>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:14px; color:#64748b;">
                <span>Delivery Charges:</span>
                <span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-truck-fast"></i> FREE Delivery</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; padding-top:10px; border-top:1px dashed #cbd5e1;">
                <span style="font-weight:700; color:#1e293b; font-size:16px;">Total Payable:</span>
                <span style="font-weight:800; color:#155eef; font-size:22px;">₹${total.toLocaleString("en-IN")}</span>
            </div>

            <div style="display:flex; gap:12px;">
                <button onclick="clearCart()" style="flex:1; padding:13px; background:#f8fafc; color:#ef4444; border:1px solid #fecaca; border-radius:8px; font-weight:600; cursor:pointer; font-size:14px;">
                    <i class="fa-solid fa-trash-can" style="margin-right:6px;"></i> Clear Cart
                </button>
                <button onclick="checkout()" style="flex:2; padding:13px; background:#155eef; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer; font-size:15px; box-shadow:0 4px 14px rgba(21,94,239,0.3);">
                    Proceed To Checkout <i class="fa-solid fa-arrow-right" style="margin-left:6px;"></i>
                </button>
            </div>
        </div>
    `;

    openModal(html);
}


// ==========================================
// PRODUCT DETAILS
// ==========================================

function showMainContent() {
    document.getElementById("productPageView").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    window.scrollTo(0, 0);
}

function productDetails(id) {
    const product = products.find(p => p.id === id);
    const inCart = cart.includes(product.id);

    const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

    const html = `
        <div class="product-page">
            
            <div class="product-page-back">
                <button onclick="showMainContent()">
                    <i class="fa-solid fa-arrow-left"></i> Back to Products
                </button>
            </div>

            <div class="product-page-layout">
                
                <div class="product-page-image">
                    ${product.icon}
                </div>

                <div class="product-page-info">
                    
                    <div class="brand-badge">${product.brand}</div>
                    
                    <h1>${product.name}</h1>
                    
                    <div class="rating-badge">
                        ★ ${product.rating} <span>(1,245 Ratings) & 134 Reviews</span>
                    </div>

                    <hr>

                    <div class="price-section">
                        <h2>₹${product.price.toLocaleString("en-IN")}</h2>
                        <span class="old-price">₹${product.oldPrice.toLocaleString("en-IN")}</span>
                        <span class="discount">${discountPercentage}% OFF</span>
                    </div>
                    
                    <p class="inclusive-taxes">Inclusive of all taxes</p>

                    <div class="interactive-offers">
                        <div class="offer-card-mini">
                            <div class="offer-icon"><i class="fa-solid fa-tags"></i></div>
                            <div class="offer-content">
                                <h4>Bank Offer</h4>
                                <p>5% Instant Discount up to ₹5,000 on full swipe. <a href="#">T&C</a></p>
                            </div>
                        </div>
                        
                        <div class="offer-card-mini">
                            <div class="offer-icon"><i class="fa-solid fa-credit-card"></i></div>
                            <div class="offer-content">
                                <h4>No Cost EMI</h4>
                                <p>5% Cashback up to ₹5,000 on EMI transactions. <a href="#">View Plans</a></p>
                            </div>
                        </div>

                        <div class="offer-card-mini">
                            <div class="offer-icon"><i class="fa-solid fa-shield-halved"></i></div>
                            <div class="offer-content">
                                <h4>Extra Warranty</h4>
                                <p>Get 1 Year Extended Warranty for just ₹999. <a href="#">Know More</a></p>
                            </div>
                        </div>
                    </div>

                    <div class="specifications-section">
                        <h3>Key Specifications</h3>
                        <p>${product.specification}</p>
                    </div>

                    <div class="delivery-check">
                        <h3>Check Delivery Options</h3>
                        <div class="delivery-input-group">
                            <input id="pincode" type="text" maxlength="6" placeholder="Enter Pincode">
                            <button onclick="checkDelivery()">Check</button>
                        </div>
                    </div>

                    <div class="product-page-actions">
                        ${inCart
            ? `<button class="add-to-cart-btn" onclick="removeFromCart(${product.id}); productDetails(${product.id});" style="background:#ef4444; color:white;">
                                <i class="fa-solid fa-trash-can" style="margin-right:6px;"></i> Remove from Cart
                               </button>`
            : `<button class="add-to-cart-btn" onclick="addToCart(${product.id}); productDetails(${product.id});">
                                <i class="fa-solid fa-cart-plus" style="margin-right:6px;"></i> Add To Cart
                               </button>`
        }
                        <button class="buy-now-btn" onclick="checkout()">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>

                </div>

            </div>
        </div>
    `;

    document.getElementById("productPageView").innerHTML = html;
    document.getElementById("mainContent").style.display = "none";
    document.getElementById("productPageView").style.display = "block";
    window.scrollTo(0, 0);
}


// ==========================================
// DELIVERY CHECK
// ==========================================

function checkDelivery() {

    const pincode =
        document.getElementById(
            "pincode"
        ).value;


    if (
        /^[0-9]{6}$/.test(pincode)
    ) {

        showToast(
            "Delivery available! Estimated 2-5 days."
        );

    } else {

        showToast(
            "Please enter a valid 6 digit pincode."
        );

    }

}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {
    const user = getLoggedInUser();
    const prefillName = user && user.name ? user.name : "";
    const prefillEmail = user && user.email ? user.email : "";

    const html = `

        <h2>
            Checkout
        </h2>


        <div class="form">

            <input
                type="text"
                placeholder="Full Name"
                value="${prefillName}"
            >

            <input
                type="text"
                placeholder="Mobile Number"
            >

            <input
                type="text"
                placeholder="Email Address"
                value="${prefillEmail}"
            >

            <input
                type="text"
                placeholder="Delivery Address"
            >

            <input
                type="text"
                placeholder="Pincode"
            >


            <input
                type="text"
                placeholder="Coupon Code"
            >


            <select>

                <option>
                    Online Payment
                </option>

                <option>
                    Credit / Debit Card
                </option>

                <option>
                    UPI
                </option>

                <option>
                    EMI
                </option>

                <option>
                    Cash On Delivery
                </option>

            </select>


            <p>

                <i class="fa-regular fa-credit-card"></i> Bank Offer:
                Get additional discount
                with selected bank cards.

            </p>


            <button
                onclick="placeOrder()"
            >

                Place Order

            </button>

        </div>

    `;


    openModal(html);
}


// ==========================================
// PLACE ORDER
// ==========================================

function placeOrder() {

    cart = [];

    saveData();

    const html = `

        <div style="
            text-align:center;
            padding:30px;
        ">

            <h1>
                <i class="fa-solid fa-circle-check" style="color: #10b981;"></i>
            </h1>

            <h2>
                Order Confirmed!
            </h2>

            <p>
                Your order has been placed successfully.
            </p>

            <p>
                Order ID:
                <b>#EM${Date.now()}</b>
            </p>

            <p>
                Expected Delivery:
                <b>2-5 Business Days</b>
            </p>

            <button
                onclick="closeModal()"
                style="
                    padding:12px 25px;
                    background:#155eef;
                    color:white;
                    border:none;
                    border-radius:7px;
                "
            >

                Continue Shopping

            </button>

        </div>

    `;


    openModal(html);
}


// ==========================================
// LOGIN
// ==========================================
// BACKEND API & AUTHENTICATION
// ==========================================

const API_AUTH_URL = "http://localhost:8080/api/auth";

let otpTimerInterval = null;

// Check user state on startup
function getLoggedInUser() {
    try {
        const stored = localStorage.getItem("electromart_user");
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

function updateAuthUI() {
    loadUserCart();
    displayProducts();
    const user = getLoggedInUser();
    const btnText = document.getElementById("accountBtnText");
    const accountBtn = document.getElementById("accountBtn");

    if (btnText && accountBtn) {
        if (user && user.name) {
            const firstName = user.name.split(" ")[0];
            btnText.innerHTML = `Hi, ${firstName} <span style="display:inline-block;width:8px;height:8px;background:#10b981;border-radius:50%;margin-left:4px;" title="Active"></span>`;
            accountBtn.title = `Logged in as ${user.email}`;
            accountBtn.style.borderColor = "#10b981";
        } else {
            btnText.innerText = "Account";
            accountBtn.title = "Sign In / Register";
            accountBtn.style.borderColor = "";
        }
    }
}

// Auto-sync login status across tabs and page focus
window.addEventListener("storage", updateAuthUI);
window.addEventListener("focus", updateAuthUI);
document.addEventListener("DOMContentLoaded", updateAuthUI);

function handleAccountClick() {
    const user = getLoggedInUser();
    if (user) {
        openProfileModal(user);
    } else {
        // Direct to dedicated full login & register portal
        window.location.href = "login.html";
    }
}

function openProfileModal(user) {
    const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Member";

    const html = `
        <div class="profile-card">
            <div class="profile-avatar">${initials}</div>
            <div class="profile-info">
                <h3>${user.name}</h3>
                <p style="color:#64748b; font-size:14px; margin-bottom:6px;">${user.email}</p>
                <span class="auth-badge"><i class="fa-solid fa-circle-check" style="color:#10b981; margin-right:5px;"></i> Verified Account</span>
                <p style="font-size:12px; color:#94a3b8; margin-top:8px;">Member Since: ${memberSince}</p>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; max-width:320px; margin:0 auto;">
                <button onclick="showWishlist(); closeModal();" class="secondary" style="height:44px; font-size:14px;">
                    <i class="fa-regular fa-heart"></i> My Wishlist
                </button>
                <button onclick="showCart(); closeModal();" class="secondary" style="height:44px; font-size:14px;">
                    <i class="fa-solid fa-cart-shopping"></i> My Cart
                </button>
                <button onclick="logout()" style="height:44px; font-size:14px; background:#ef4444; color:white; border:none; margin-top:10px;">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
            </div>
        </div>
    `;

    openModal(html);
}

function logout() {
    localStorage.removeItem("electromart_user");
    loadUserCart();
    displayProducts();
    updateAuthUI();
    closeModal();
    showToast("Signed out successfully!");
}

// ==========================================
// LOGIN MODAL
// ==========================================

function openLogin() {
    const html = `
        <div class="auth-container">
            <div class="auth-banner">
                <div>
                    <h2 style="color:white; font-size:32px; margin-bottom:15px; text-align:left;">Welcome to ElectroMart</h2>
                    <p style="color:#bfdbfe; font-size:16px; line-height:1.6;">Discover the best electronics, gadgets, and unbeatable deals today.</p>
                </div>
            </div>
            <div class="auth-form-wrapper">
                <h2 style="font-size:28px; text-align:left; margin-bottom:8px; color:#1e293b;">Sign In</h2>
                <p class="auth-subtitle">Welcome back! Please enter your details.</p>
                
                <div class="form" style="gap:14px;" onkeydown="if(event.key==='Enter') login()">
                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="loginEmail" placeholder="Enter your email" required autofocus>
                    </div>
                    
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" placeholder="••••••••" required>
                    </div>

                    <div class="auth-options">
                        <label><input type="checkbox" id="rememberMe" style="width:auto; height:auto; margin-right:8px;"> Remember me</label>
                        <a href="#" class="forgot-password" onclick="openForgotPassword()">Forgot Password?</a>
                    </div>

                    <button id="loginSubmitBtn" onclick="login()">Sign In</button>
                    
                    <button class="secondary" onclick="register()" style="display:flex; align-items:center; justify-content:center; gap:10px;">
                        Create New Account
                    </button>

                    <p class="auth-switch">Don't have an account? <a href="#" onclick="register()">Sign up for free</a></p>
                    <p style="text-align:center; font-size:12px; margin-top:5px;">
                        <a href="login.html" style="color:#2563eb; text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Full Login Portal</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    openModal(html);
}

async function login() {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const submitBtn = document.getElementById("loginSubmitBtn");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        showToast("Please enter your email address.");
        emailInput.focus();
        return;
    }

    if (!password) {
        showToast("Please enter your password.");
        passwordInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Signing in...";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const response = await fetch(`${API_AUTH_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem("electromart_user", JSON.stringify(result.data));
            updateAuthUI();
            closeModal();
            showToast(`Welcome back, ${result.data.name}!`);
        } else {
            showToast(result.message || "Invalid email or password.");
        }
    } catch (error) {
        console.warn("Backend offline, signing in locally:", error);
        const userName = email.split('@')[0] || "ElectroMart User";
        const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        const userObj = {
            id: Date.now(),
            name: capitalizedName,
            email: email,
            role: "Customer",
            createdAt: new Date().toISOString()
        };
        localStorage.setItem("electromart_user", JSON.stringify(userObj));
        updateAuthUI();
        closeModal();
        showToast(`Welcome back, ${capitalizedName}! (Offline Mode)`);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Sign In";
        }
    }
}

// ==========================================
// REGISTER MODAL
// ==========================================

function register() {
    const html = `
        <div class="auth-container">
            <div class="auth-banner signup-banner">
                <div>
                    <h2 style="color:white; font-size:32px; margin-bottom:15px; text-align:left;">Join ElectroMart</h2>
                    <p style="color:#bfdbfe; font-size:16px; line-height:1.6;">Sign up now to get exclusive access to sales and new products.</p>
                </div>
            </div>
            <div class="auth-form-wrapper">
                <h2 style="font-size:28px; text-align:left; margin-bottom:8px; color:#1e293b;">Create Account</h2>
                <p class="auth-subtitle">Enter your details to get started with OTP verification.</p>
                
                <div class="form" style="gap:14px;" onkeydown="if(event.key==='Enter') sendRegistrationOTP()">
                    <div class="input-group">
                        <label>Full Name</label>
                        <input type="text" id="regName" placeholder="John Doe" required autofocus>
                    </div>

                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="regEmail" placeholder="Enter your email" required>
                    </div>
                    
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="regPassword" placeholder="Create a password (min 6 characters)" required>
                    </div>

                    <button id="regSubmitBtn" onclick="sendRegistrationOTP()" style="margin-top:10px;">
                        <i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i> Register & Send OTP
                    </button>

                    <p class="auth-switch">Already have an account? <a href="#" onclick="openLogin()">Sign in</a></p>
                </div>
            </div>
        </div>
    `;

    openModal(html);
}

// ==========================================
// SEND REGISTRATION OTP
// ==========================================

async function sendRegistrationOTP() {
    const nameInput = document.getElementById("regName");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const submitBtn = document.getElementById("regSubmitBtn");

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!name) {
        showToast("Please enter your full name.");
        nameInput.focus();
        return;
    }

    if (!email || !email.includes("@")) {
        showToast("Please enter a valid email address.");
        emailInput.focus();
        return;
    }

    if (!password || password.length < 6) {
        showToast("Password must be at least 6 characters long.");
        passwordInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending OTP...";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const response = await fetch(`${API_AUTH_URL}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, purpose: "REGISTRATION" }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const result = await response.json();

        if (response.ok && result.success) {
            showToast("OTP sent successfully to " + email);
            openOtpModal(name, email, password, result.data?.debugOtp);
        } else {
            showToast(result.message || "Failed to send OTP.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Register & Send OTP";
        }
    } catch (error) {
        console.warn("Backend offline, generating local OTP:", error);
        showToast("Backend offline: Generated Demo OTP 123456");
        openOtpModal(name, email, password, "123456");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Register & Send OTP";
    }
}

// ==========================================
// OTP VERIFICATION MODAL
// ==========================================

function openOtpModal(name, email, password, debugOtp) {
    if (otpTimerInterval) clearInterval(otpTimerInterval);

    let timeLeft = 60;

    const html = `
        <div class="auth-container">
            <div class="auth-banner signup-banner">
                <div>
                    <h2 style="color:white; font-size:32px; margin-bottom:15px; text-align:left;">Security Verification</h2>
                    <p style="color:#bfdbfe; font-size:16px; line-height:1.6;">We've sent a 6-digit code to protect your ElectroMart account.</p>
                </div>
            </div>
            <div class="auth-form-wrapper">
                <h2 style="font-size:26px; text-align:left; margin-bottom:6px; color:#1e293b;">Enter OTP Code</h2>
                <div class="auth-badge">
                    <i class="fa-regular fa-envelope" style="margin-right:6px;"></i> ${email}
                </div>
                <p class="auth-subtitle" style="margin-bottom:20px;">Please enter the 6-digit verification code sent to your email.</p>
                
                <div class="form" style="gap:16px;" onkeydown="if(event.key==='Enter') submitRegistration('${escapeQuotes(name)}', '${escapeQuotes(email)}', '${escapeQuotes(password)}')">
                    <div class="input-group">
                        <label>6-Digit OTP</label>
                        <input type="text" id="otpCodeInput" class="otp-display-input" maxlength="6" placeholder="------" autofocus>
                        <div class="otp-timer">
                            <span id="timerText">Resend code in <b id="countdown">60</b>s</span>
                            <a id="resendLink" style="display:none;" onclick="resendRegistrationOtp('${escapeQuotes(email)}')">Resend OTP</a>
                        </div>
                    </div>

                    ${debugOtp ? `<div style="padding:8px 12px; background:#fef3c7; border:1px solid #fde68a; border-radius:8px; font-size:12px; color:#92400e;"><b>Dev Hint:</b> OTP code is <b>${debugOtp}</b> (Enter this code above)</div>` : ''}

                    <button id="verifySubmitBtn" onclick="submitRegistration('${escapeQuotes(name)}', '${escapeQuotes(email)}', '${escapeQuotes(password)}')">
                        Verify & Create Account
                    </button>

                    <button class="secondary" onclick="register()">
                        Change Details
                    </button>
                </div>
            </div>
        </div>
    `;

    openModal(html);

    // Focus input
    setTimeout(() => {
        const inp = document.getElementById("otpCodeInput");
        if (inp) inp.focus();
    }, 100);

    // Countdown Timer
    otpTimerInterval = setInterval(() => {
        timeLeft--;
        const countdownEl = document.getElementById("countdown");
        if (countdownEl) countdownEl.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(otpTimerInterval);
            const timerText = document.getElementById("timerText");
            const resendLink = document.getElementById("resendLink");
            if (timerText) timerText.style.display = "none";
            if (resendLink) resendLink.style.display = "inline";
        }
    }, 1000);
}

function escapeQuotes(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

async function resendRegistrationOtp(email) {
    try {
        const res = await fetch(`${API_AUTH_URL}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, purpose: "REGISTRATION" })
        });
        const result = await res.json();
        if (result.success) {
            showToast("New OTP sent to " + email);
            const timerText = document.getElementById("timerText");
            const resendLink = document.getElementById("resendLink");
            if (timerText) {
                timerText.style.display = "inline";
                timerText.innerHTML = `Resend code in <b id="countdown">60</b>s`;
            }
            if (resendLink) resendLink.style.display = "none";
        } else {
            showToast(result.message || "Failed to resend OTP.");
        }
    } catch (e) {
        showToast("New Offline OTP: 123456");
    }
}

async function submitRegistration(name, email, password) {
    const otpInput = document.getElementById("otpCodeInput");
    const submitBtn = document.getElementById("verifySubmitBtn");

    if (!otpInput) return;
    const otp = otpInput.value.trim();

    if (!otp || otp.length !== 6) {
        showToast("Please enter the complete 6-digit OTP code.");
        otpInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Verifying & Creating Account...";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const response = await fetch(`${API_AUTH_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, otp }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const result = await response.json();

        if (response.ok && result.success) {
            if (otpTimerInterval) clearInterval(otpTimerInterval);
            localStorage.setItem("electromart_user", JSON.stringify(result.data));
            updateAuthUI();
            closeModal();
            showToast("Registration successful! Welcome to ElectroMart!");
        } else {
            showToast(result.message || "OTP verification failed.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Verify & Create Account";
        }
    } catch (error) {
        console.warn("Backend offline, completing local registration:", error);
        if (otpTimerInterval) clearInterval(otpTimerInterval);
        const userObj = {
            id: Date.now(),
            name: name,
            email: email,
            role: "Customer",
            createdAt: new Date().toISOString()
        };
        localStorage.setItem("electromart_user", JSON.stringify(userObj));
        updateAuthUI();
        closeModal();
        showToast(`Registration successful! Welcome, ${name}!`);
    }
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

function openForgotPassword() {
    const html = `
        <div class="auth-container">
            <div class="auth-banner">
                <div>
                    <h2 style="color:white; font-size:32px; margin-bottom:15px; text-align:left;">Reset Password</h2>
                    <p style="color:#bfdbfe; font-size:16px; line-height:1.6;">Don't worry, we'll help you securely recover access to your account.</p>
                </div>
            </div>
            <div class="auth-form-wrapper">
                <h2 style="font-size:28px; text-align:left; margin-bottom:8px; color:#1e293b;">Forgot Password</h2>
                <p class="auth-subtitle">Enter your registered email address to receive an OTP.</p>
                
                <div class="form" style="gap:14px;" onkeydown="if(event.key==='Enter') sendForgotOtp()">
                    <div class="input-group">
                        <label>Registered Email Address</label>
                        <input type="email" id="forgotEmail" placeholder="Enter your email" required autofocus>
                    </div>

                    <button id="forgotSubmitBtn" onclick="sendForgotOtp()">
                        <i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i> Send Reset OTP
                    </button>

                    <p class="auth-switch">Remembered password? <a href="#" onclick="openLogin()">Sign in</a></p>
                </div>
            </div>
        </div>
    `;

    openModal(html);
}

async function sendForgotOtp() {
    const emailInput = document.getElementById("forgotEmail");
    const submitBtn = document.getElementById("forgotSubmitBtn");

    if (!emailInput) return;
    const email = emailInput.value.trim();

    if (!email) {
        showToast("Please enter your email.");
        emailInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending Reset OTP...";

    try {
        const response = await fetch(`${API_AUTH_URL}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, purpose: "PASSWORD_RESET" })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast("Reset OTP sent to " + email);
            openResetPasswordModal(email, result.data?.debugOtp);
        } else {
            showToast(result.message || "Email not registered.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Reset OTP";
        }
    } catch (e) {
        showToast("Backend connection error.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Reset OTP";
    }
}

function openResetPasswordModal(email, debugOtp) {
    const html = `
        <div class="auth-container">
            <div class="auth-banner">
                <div>
                    <h2 style="color:white; font-size:32px; margin-bottom:15px; text-align:left;">Set New Password</h2>
                    <p style="color:#bfdbfe; font-size:16px; line-height:1.6;">Enter the OTP code received and choose your new password.</p>
                </div>
            </div>
            <div class="auth-form-wrapper">
                <h2 style="font-size:28px; text-align:left; margin-bottom:8px; color:#1e293b;">Reset Password</h2>
                <div class="auth-badge">${email}</div>
                
                <div class="form" style="gap:14px;">
                    <div class="input-group">
                        <label>6-Digit OTP</label>
                        <input type="text" id="resetOtpInput" class="otp-display-input" maxlength="6" placeholder="------" autofocus>
                    </div>

                    <div class="input-group">
                        <label>New Password</label>
                        <input type="password" id="resetNewPassword" placeholder="Minimum 6 characters" required>
                    </div>

                    ${debugOtp ? `<div style="padding:8px 12px; background:#fef3c7; border:1px solid #fde68a; border-radius:8px; font-size:12px; color:#92400e;"><b>Dev Hint:</b> Reset OTP is <b>${debugOtp}</b></div>` : ''}

                    <button id="resetSubmitBtn" onclick="submitPasswordReset('${escapeQuotes(email)}')">
                        Confirm & Reset Password
                    </button>

                    <p class="auth-switch"><a href="#" onclick="openLogin()">Back to Sign In</a></p>
                </div>
            </div>
        </div>
    `;

    openModal(html);
}

async function submitPasswordReset(email) {
    const otpInput = document.getElementById("resetOtpInput");
    const newPassInput = document.getElementById("resetNewPassword");
    const submitBtn = document.getElementById("resetSubmitBtn");

    if (!otpInput || !newPassInput) return;
    const otp = otpInput.value.trim();
    const newPassword = newPassInput.value;

    if (!otp || otp.length !== 6) {
        showToast("Please enter the 6-digit OTP code.");
        otpInput.focus();
        return;
    }

    if (!newPassword || newPassword.length < 6) {
        showToast("New password must be at least 6 characters.");
        newPassInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Resetting Password...";

    try {
        const response = await fetch(`${API_AUTH_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, newPassword })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast("Password reset successfully! Please sign in.");
            openLogin();
        } else {
            showToast(result.message || "Failed to reset password.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Confirm & Reset Password";
        }
    } catch (e) {
        showToast("Backend connection error.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Confirm & Reset Password";
    }
}



// ==========================================
// SEARCH
// ==========================================

function searchProduct() {

    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const results =
        products.filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.brand
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

        );


    displayProducts(results);
}


// ==========================================
// SEARCH SUGGESTION
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function () {

            const value =
                this.value.toLowerCase();

            const box =
                document.getElementById(
                    "suggestions"
                );


            if (!value) {

                box.style.display =
                    "none";

                return;
            }


            const results =
                products
                    .filter(product =>

                        product.name
                            .toLowerCase()
                            .includes(value)

                    )
                    .slice(0, 5);


            box.innerHTML = "";


            results.forEach(product => {

                box.innerHTML += `

                    <div
                        onclick="
                            selectSuggestion(
                                '${product.name}'
                            )
                        "
                    >

                        ${product.icon}

                        ${product.name}

                    </div>

                `;

            });


            box.style.display =
                results.length
                    ? "block"
                    : "none";

        }
    );


// ==========================================
// SELECT SEARCH SUGGESTION
// ==========================================

function selectSuggestion(name) {

    document.getElementById(
        "searchInput"
    ).value = name;


    document.getElementById(
        "suggestions"
    ).style.display = "none";


    searchProduct();
}


// ==========================================
// FILTER BY CATEGORY
// ==========================================

let currentCategory = 'all';

function filterByCategory(category) {
    currentCategory = category;

    document.getElementById("priceFilter").value = "all";
    document.getElementById("ratingFilter").value = "0";
    document.getElementById("storageFilter").value = "all";
    document.getElementById("screenFilter").value = "all";
    document.querySelectorAll(".brandFilter").forEach(cb => cb.checked = false);
    document.getElementById("searchInput").value = "";

    document.getElementById("products").scrollIntoView({ behavior: 'smooth' });

    filterProducts();
}


// ==========================================
// FILTER PRODUCTS
// ==========================================

function filterProducts() {

    const maxPrice =
        document.getElementById(
            "priceFilter"
        ).value;


    const minRating =
        Number(
            document.getElementById(
                "ratingFilter"
            ).value
        );


    const storage =
        document.getElementById(
            "storageFilter"
        ).value;


    const screen =
        document.getElementById(
            "screenFilter"
        ).value;


    const selectedBrands =
        [...document.querySelectorAll(
            ".brandFilter:checked"
        )]
            .map(
                checkbox =>
                    checkbox.value
            );


    const filtered =
        products.filter(product => {

            const priceOK =
                maxPrice === "all"
                ||
                product.price <=
                Number(maxPrice);


            const ratingOK =
                product.rating >=
                minRating;


            const brandOK =
                selectedBrands.length === 0
                ||
                selectedBrands.includes(
                    product.brand
                );


            const storageOK =
                storage === "all"
                ||
                product.storage === storage;


            const screenOK =
                screen === "all"
                ||
                product.screen === screen;


            const categoryOK =
                currentCategory === "all"
                ||
                product.category.toLowerCase() === currentCategory.toLowerCase();


            return (
                priceOK &&
                ratingOK &&
                brandOK &&
                storageOK &&
                screenOK &&
                categoryOK
            );

        });


    displayProducts(filtered);
}


// ==========================================
// CLEAR FILTERS
// ==========================================

function clearFilters() {

    currentCategory = 'all';

    document.getElementById(
        "priceFilter"
    ).value = "all";


    document.getElementById(
        "ratingFilter"
    ).value = "0";


    document.getElementById(
        "storageFilter"
    ).value = "all";


    document.getElementById(
        "screenFilter"
    ).value = "all";


    document.querySelectorAll(
        ".brandFilter"
    ).forEach(
        checkbox =>
            checkbox.checked = false
    );


    document.getElementById(
        "searchInput"
    ).value = "";


    displayProducts();
}


// ==========================================
// SCROLL PRODUCTS
// ==========================================

function scrollToProducts() {

    document
        .getElementById("products")
        .scrollIntoView();

}


// ==========================================
// MODAL
// ==========================================

function openModal(content) {

    document.getElementById(
        "modalBody"
    ).innerHTML = content;


    document.getElementById(
        "modal"
    ).style.display = "flex";
}


function closeModal() {

    document.getElementById(
        "modal"
    ).style.display = "none";
}


function closeOutside(event) {

    if (
        event.target.id === "modal"
    ) {

        closeModal();

    }

}


// ==========================================
// TOAST
// ==========================================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.innerText = message;

    toast.style.display = "block";


    setTimeout(
        () => {

            toast.style.display =
                "none";

        },
        2500
    );

}


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

displayProducts();

updateCartCount();
updateAuthUI();


// ==========================================
// AD SLIDER (BUYBACK + STUDENT OFFER)
// ==========================================

(function () {

    const slides = document.querySelectorAll('.ad-slide');
    const dots = document.querySelectorAll('.ad-dot');
    const wrapper = document.getElementById('ad-slider');

    let current = 0;
    let direction = 1;   // 1 = forward, -1 = backward
    let timer = null;
    let progress = null;

    function goTo(index, dir) {

        // Remove active from current
        slides[current].classList.remove('active-slide', 'slide-enter', 'slide-enter-left');
        dots[current].classList.remove('active-dot');

        current = (index + slides.length) % slides.length;
        direction = (dir !== undefined) ? dir : 1;

        // Add entry animation class based on direction
        const enterClass = direction >= 0 ? 'slide-enter' : 'slide-enter-left';

        slides[current].classList.add('active-slide', enterClass);
        dots[current].classList.add('active-dot');

        // Remove animation class after it finishes so it can retrigger
        setTimeout(() => {
            slides[current].classList.remove('slide-enter', 'slide-enter-left');
        }, 650);

        // Restart progress bar
        restartProgress();
    }

    function restartProgress() {
        // Remove old bar if any
        const old = document.querySelector('.ad-slider-progress');
        if (old) old.remove();

        const bar = document.createElement('div');
        bar.className = 'ad-slider-progress';
        slides[current].appendChild(bar);
    }

    function startAuto() {
        clearInterval(timer);
        timer = setInterval(() => {
            goTo(current + 1, 1);
        }, 5000);
    }

    function stopAuto() {
        clearInterval(timer);
    }

    // Initialize
    slides[current].classList.add('active-slide');
    dots[current].classList.add('active-dot');
    restartProgress();
    startAuto();

    // Pause on hover
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAuto);
        wrapper.addEventListener('mouseleave', startAuto);
    }

    // Expose for onclick attributes
    window.adSliderMove = function (dir) {
        goTo(current + dir, dir);
        startAuto();
    };

    window.adSliderGoTo = function (index) {
        const dir = index >= current ? 1 : -1;
        goTo(index, dir);
        startAuto();
    };

})();
