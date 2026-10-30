
const products = [
    {
        id: 1,
        name: "Camiseta Premium Preta",
        price: 89.90,
        category: "camisetas",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },
    {
        id: 2,
        name: "Camiseta Casual Branca",
        price: 79.90,
        category: "camisetas",
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600"
    },
    {
        id: 3,
        name: "Calça Jeans Masculina",
        price: 159.90,
        category: "calcas",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
    },
    {
        id: 4,
        name: "Jaqueta Streetwear",
        price: 249.90,
        category: "jaquetas",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
    },
    {
        id: 5,
        name: "Tênis Casual Urban",
        price: 199.90,
        category: "tenis",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 6,
        name: "Camiseta Oversized",
        price: 99.90,
        category: "camisetas",
        image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600"
    },
    {
        id: 7,
        name: "Calça Casual Masculina",
        price: 139.90,
        category: "calcas",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600"
    },
    {
        id: 8,
        name: "Jaqueta Masculina",
        price: 279.90,
        category: "jaquetas",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"
    }
];

let cart = JSON.parse(localStorage.getItem("urbanCart")) || [];

const productsContainer = document.getElementById("products");
const cartItems = document.getElementById("cart-items");

function formatPrice(price) {
    return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function renderProducts(list = products) {
    productsContainer.innerHTML = "";

    if (list.length === 0) {
        productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    list.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}"
                         alt="${product.name}"
                         loading="lazy">
                </div>

                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${formatPrice(product.price)}</p>

                    <button onclick="addToCart(${product.id})">
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    toggleCart(true);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("urbanCart", JSON.stringify(cart));
}

function renderCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let quantity = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        quantity += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">

                <div>
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>

                    <button onclick="changeQuantity(${item.id}, -1)">−</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">+</button>

                    <br>

                    <button onclick="removeFromCart(${item.id})">
                        Remover
                    </button>
                </div>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='padding:25px 0'>Seu carrinho está vazio.</p>";
    }

    document.getElementById("cart-total").textContent = formatPrice(total);
    document.getElementById("cart-count").textContent = quantity;
}

function toggleCart(forceOpen = false) {
    const cartElement = document.getElementById("cart");
    const overlay = document.getElementById("cart-overlay");

    if (forceOpen || !cartElement.classList.contains("active")) {
        cartElement.classList.add("active");
        overlay.classList.add("active");
    } else {
        closeCart();
    }
}

function closeCart() {
    document.getElementById("cart").classList.remove("active");
    document.getElementById("cart-overlay").classList.remove("active");
}

function toggleMenu() {
    document.getElementById("nav").classList.toggle("active");
}

document.getElementById("search").addEventListener("input", filterProducts);
document.getElementById("category").addEventListener("change", filterProducts);

function filterProducts() {
    const search = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category").value;

    const filtered = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(search);
        const matchesCategory = category === "todos" || product.category === category;

        return matchesName && matchesCategory;
    });

    renderProducts(filtered);
}

function checkout() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const phone = "5541999999999"; // TROQUE PELO SEU WHATSAPP

    let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";

    let total = 0;

    cart.forEach(item => {
        message += `${item.name}\n`;
        message += `Quantidade: ${item.quantity}\n`;
        message += `Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;

        total += item.price * item.quantity;
    });

    message += `TOTAL: ${formatPrice(total)}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

document.getElementById("newsletter-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    document.getElementById("newsletter-message").textContent =
        "Obrigado! Seu cadastro foi recebido nesta demonstração.";

    this.reset();
});

renderProducts();
renderCart();
