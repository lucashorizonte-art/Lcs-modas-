
const products = [
    {
        id: 1,
        name: "Oversized Basic Black",
        category: "Camisetas",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },
    {
        id: 2,
        name: "Streetwear Graphic Tee",
        category: "Camisetas",
        price: 109.90,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600"
    },
    {
        id: 3,
        name: "Baggy Jeans Blue",
        category: "Calças",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
    },
    {
        id: 4,
        name: "Cargo Pants Urban",
        category: "Calças",
        price: 219.90,
        image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600"
    },
    {
        id: 5,
        name: "Hoodie Essential",
        category: "Moletons",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
    },
    {
        id: 6,
        name: "Moletom Skate Club",
        category: "Moletons",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600"
    },
    {
        id: 7,
        name: "Street Cap",
        category: "Acessórios",
        price: 69.90,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600"
    },
    {
        id: 8,
        name: "Skate Backpack",
        category: "Acessórios",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    }
];

let cart = JSON.parse(localStorage.getItem("dropCart")) || [];
let currentCategory = "Todos";

const formatPrice = value =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

// MOSTRAR PRODUTOS

function renderProducts() {
    const grid = document.getElementById("products-grid");
    const search = document.getElementById("search").value.toLowerCase();

    const filtered = products.filter(product => {
        const categoryMatch =
            currentCategory === "Todos" ||
            product.category === currentCategory;

        const searchMatch =
            product.name.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    if (!filtered.length) {
        grid.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">
            </div>

            <div class="product-info">
                <small>${product.category}</small>
                <h3>${product.name}</h3>

                <div class="price">
                    ${formatPrice(product.price)}
                </div>

                <div class="product-actions">
                    <select id="size-${product.id}" aria-label="Tamanho">
                        <option value="P">P</option>
                        <option value="M" selected>M</option>
                        <option value="G">G</option>
                        <option value="GG">GG</option>
                    </select>

                    <button class="add-button"
                        onclick="addToCart(${product.id})">
                        ADICIONAR +
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// FILTROS

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(item =>
            item.classList.remove("active")
        );

        button.classList.add("active");
        currentCategory = button.dataset.category;

        renderProducts();
    });
});

// BUSCA

document.getElementById("search").addEventListener("input", renderProducts);

// ADICIONAR AO CARRINHO

function addToCart(id) {
    const product = products.find(item => item.id === id);
    const size = document.getElementById(`size-${id}`).value;

    const existing = cart.find(item =>
        item.id === id && item.size === size
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            size,
            quantity: 1
        });
    }

    saveCart();
    showToast("Produto adicionado à sacola!");
}

// SALVAR CARRINHO

function saveCart() {
    localStorage.setItem("dropCart", JSON.stringify(cart));
    renderCart();
}

// EXIBIR CARRINHO

function renderCart() {
    const container = document.getElementById("cart-items");
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-total").textContent = formatPrice(total);

    if (cart.length === 0) {
        container.innerHTML = "<p style='padding:30px 0'>Sua sacola está vazia.</p>";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>Tamanho: ${item.size}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p><strong>${formatPrice(item.price * item.quantity)}</strong></p>
            </div>

            <button class="remove-item"
                onclick="removeItem(${item.id}, '${item.size}')">
                REMOVER
            </button>
        </div>
    `).join("");
}

// REMOVER ITEM

function removeItem(id, size) {
    cart = cart.filter(item =>
        !(item.id === id && item.size === size)
    );

    saveCart();
}

// ABRIR E FECHAR CARRINHO

function toggleCart() {
    document.getElementById("cart").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("open");
}

// MENU MOBILE

function toggleMenu() {
    document.getElementById("nav").classList.toggle("open");
}

// NOTIFICAÇÃO

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// FINALIZAR PEDIDO PELO WHATSAPP

function checkout() {
    if (cart.length === 0) {
        showToast("Sua sacola está vazia!");
        return;
    }

    // SUBSTITUA PELO SEU NÚMERO COM DDI E DDD
    const whatsapp = "5541999999999";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    let message = "Olá! Quero fazer um pedido na DROP STREET:\n\n";

    cart.forEach(item => {
        message +=
            `${item.name}\n` +
            `Tamanho: ${item.size}\n` +
            `Quantidade: ${item.quantity}\n` +
            `Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    message += `TOTAL: ${formatPrice(total)}`;

    const url =
        `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// NEWSLETTER

document.getElementById("newsletter-form").addEventListener("submit", event => {
    event.preventDefault();

    showToast("Obrigado por se inscrever!");

    event.target.reset();
});

// INICIALIZAÇÃO

renderProducts();
renderCart();

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
