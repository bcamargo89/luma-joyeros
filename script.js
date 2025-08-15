// Global Variables
let cart = [];
let wishlist = [];
let currentCurrency = 'BOB';
let exchangeRates = {
    BOB: 1,
    USD: 0.145,
    EUR: 0.134
};

// Sample Products Data
const products = [
    {
        id: 1,
        name: "Anillo de Compromiso Clásico",
        price: 8500,
        category: "compromiso",
        image: "💍",
        description: "Anillo de compromiso con diamante central de 1 quilate",
        material: "Oro blanco 18k",
        stone: "Diamante",
        inStock: true
    },
    {
        id: 2,
        name: "Alianza de Matrimonio Elegante",
        price: 3200,
        category: "matrimonio",
        image: "💒",
        description: "Alianza de matrimonio en oro amarillo con acabado pulido",
        material: "Oro amarillo 18k",
        stone: "Sin piedras",
        inStock: true
    },
    {
        id: 3,
        name: "Collar de Diamantes",
        price: 12500,
        category: "diamantes",
        image: "💎",
        description: "Collar elegante con múltiples diamantes engastados",
        material: "Oro blanco 18k",
        stone: "Diamantes",
        inStock: true
    },
    {
        id: 4,
        name: "Pendientes de Esmeraldas",
        price: 6800,
        category: "regalos",
        image: "🟢",
        description: "Pendientes con esmeraldas naturales de Colombia",
        material: "Oro rosa 18k",
        stone: "Esmeraldas",
        inStock: true
    },
    {
        id: 5,
        name: "Anillo de Compromiso Vintage",
        price: 9800,
        category: "compromiso",
        image: "💍",
        description: "Diseño vintage con diamante central y detalles art deco",
        material: "Oro blanco 18k",
        stone: "Diamante",
        inStock: false
    },
    {
        id: 6,
        name: "Brazalete de Oro",
        price: 4500,
        category: "regalos",
        image: "📿",
        description: "Brazalete elegante en oro amarillo con diseño trenzado",
        material: "Oro amarillo 18k",
        stone: "Sin piedras",
        inStock: true
    }
];

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');

const wishlistBtn = document.getElementById('wishlist-btn');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistItems = document.getElementById('wishlist-items');
const wishlistCount = document.querySelector('.wishlist-count');

const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInputField = document.getElementById('chat-input-field');
const chatSendBtn = document.getElementById('chat-send-btn');

const currencySelector = document.getElementById('currency-selector');
const productsGrid = document.getElementById('products-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    setupEventListeners();
    setupChatBot();
    setupHeroSlider();
});

function initializeApp() {
    // Load cart and wishlist from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    updateCartCount();
    updateWishlistCount();
    updateCartTotal();
}

function setupEventListeners() {
    // Cart functionality
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Wishlist functionality
    wishlistBtn.addEventListener('click', toggleWishlist);
    closeWishlist.addEventListener('click', toggleWishlist);
    
    // Chat functionality
    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Currency selector
    currencySelector.addEventListener('change', function() {
        currentCurrency = this.value;
        updateAllPrices();
        updateCartTotal();
    });
    
    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Load more products
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
    
    // Close sidebars when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
        if (!wishlistSidebar.contains(e.target) && !wishlistBtn.contains(e.target)) {
            wishlistSidebar.classList.remove('open');
        }
    });
}

// Product Management
function loadProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const price = convertCurrency(product.price, currentCurrency);
    const currencySymbol = getCurrencySymbol(currentCurrency);
    
    card.innerHTML = `
        <div class="product-image">
            <span style="font-size: 4rem;">${product.image}</span>
            ${!product.inStock ? '<div class="product-badge">Agotado</div>' : ''}
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${currencySymbol} ${price.toFixed(2)}</p>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
                ${product.material} • ${product.stone}
            </p>
            <div class="product-actions">
                ${product.inStock ? 
                    `<button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>` : 
                    '<button class="btn btn-outline" disabled>Agotado</button>'
                }
                <button class="btn btn-outline" onclick="toggleWishlistItem(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Update wishlist button state
    const wishlistBtn = card.querySelector('.btn-outline');
    if (wishlist.includes(product.id)) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart" style="color: var(--gold-primary);"></i>';
    }
    
    return card;
}

function loadMoreProducts() {
    // Simulate loading more products
    const newProducts = [
        {
            id: 7,
            name: "Anillo de Compromiso Moderno",
            price: 11200,
            category: "compromiso",
            image: "💍",
            description: "Diseño contemporáneo con diamante y zafiros",
            material: "Oro blanco 18k",
            stone: "Diamante y Zafiros",
            inStock: true
        },
        {
            id: 8,
            name: "Collar de Perlas",
            price: 3800,
            category: "regalos",
            image: "🟤",
            description: "Collar elegante con perlas naturales de agua dulce",
            material: "Oro amarillo 18k",
            stone: "Perlas",
            inStock: true
        }
    ];
    
    newProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    loadMoreBtn.style.display = 'none';
}

// Cart Functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCart();
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const price = convertCurrency(item.price, currentCurrency);
        return sum + (price * item.quantity);
    }, 0);
    
    const currencySymbol = getCurrencySymbol(currentCurrency);
    cartTotal.textContent = `${currentCurrency} ${total.toFixed(2)}`;
}

function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
        return;
    }
    
    cart.forEach(item => {
        const price = convertCurrency(item.price, currentCurrency);
        const currencySymbol = getCurrencySymbol(currentCurrency);
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #eee;';
        
        cartItem.innerHTML = `
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold-light), var(--gold-primary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                ${item.image}
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-dark);">${item.name}</h4>
                <p style="margin: 0; color: var(--gold-primary); font-weight: 600;">${currencySymbol} ${price.toFixed(2)}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">-</button>
                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" style="background: #f0f0f0; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: #ff4444; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
}

// Wishlist Functionality
function toggleWishlistItem(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Producto removido de la lista de deseos', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Producto agregado a la lista de deseos', 'success');
    }
    
    updateWishlist();
    updateWishlistCount();
    renderWishlistItems();
    
    // Update product card wishlist button
    const productCard = document.querySelector(`[onclick*="${productId}"]`).closest('.product-card');
    const wishlistBtn = productCard.querySelector('.btn-outline');
    
    if (wishlist.includes(productId)) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart" style="color: var(--gold-primary);"></i>';
    } else {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }
}

function updateWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

function renderWishlistItems() {
    wishlistItems.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p style="text-align: center; color: #666;">Tu lista de deseos está vacía</p>';
        return;
    }
    
    wishlist.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const price = convertCurrency(product.price, currentCurrency);
        const currencySymbol = getCurrencySymbol(currentCurrency);
        
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #eee;';
        
        wishlistItem.innerHTML = `
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--gold-light), var(--gold-primary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                ${product.image}
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-dark);">${product.name}</h4>
                <p style="margin: 0; color: var(--gold-primary); font-weight: 600;">${currencySymbol} ${price.toFixed(2)}</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="addToCart(${product.id})" style="background: var(--gold-primary); color: var(--white-clean); border: none; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 0.9rem;">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button onclick="toggleWishlistItem(${product.id})" style="background: #ff4444; color: var(--white-clean); border: none; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 0.9rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        wishlistItems.appendChild(wishlistItem);
    });
}

// Sidebar Toggles
function toggleCart() {
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
}

function toggleWishlist() {
    wishlistSidebar.classList.toggle('open');
    if (wishlistSidebar.classList.contains('open')) {
        renderWishlistItems();
    }
}

function toggleChat() {
    chatContainer.classList.toggle('open');
}

function toggleMobileMenu() {
    navMenu.classList.toggle('open');
}

// Currency Conversion
function convertCurrency(amount, targetCurrency) {
    return amount * exchangeRates[targetCurrency];
}

function getCurrencySymbol(currency) {
    const symbols = {
        BOB: 'Bs',
        USD: '$',
        EUR: '€'
    };
    return symbols[currency] || currency;
}

function updateAllPrices() {
    // Update product prices
    const priceElements = document.querySelectorAll('.product-price');
    priceElements.forEach((element, index) => {
        if (products[index]) {
            const price = convertCurrency(products[index].price, currentCurrency);
            const currencySymbol = getCurrencySymbol(currentCurrency);
            element.textContent = `${currencySymbol} ${price.toFixed(2)}`;
        }
    });
    
    // Update cart and wishlist if open
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
    if (wishlistSidebar.classList.contains('open')) {
        renderWishlistItems();
    }
}

// Chat Bot
function setupChatBot() {
    const responses = {
        'hola': '¡Hola! ¿En qué puedo ayudarte hoy?',
        'precio': 'Nuestros precios varían según el tipo de joya y materiales. ¿Te gustaría que te ayude a encontrar algo específico?',
        'entrega': 'Realizamos entregas en toda Bolivia. Los tiempos de entrega varían de 2-5 días hábiles.',
        'garantia': 'Todas nuestras joyas tienen garantía de por vida en defectos de fabricación.',
        'talla': 'Te podemos ayudar a medir tu talla. Tenemos un medidor digital en la tienda.',
        'pago': 'Aceptamos efectivo, tarjetas de crédito/débito y transferencias bancarias.',
        'descuento': 'Tenemos descuentos especiales para nuevos clientes. ¡Suscríbete a nuestro newsletter!'
    };
    
    window.chatResponses = responses;
}

function sendChatMessage() {
    const message = chatInputField.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInputField.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas')) {
        return '¡Hola! ¿En qué puedo ayudarte hoy?';
    } else if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('valor')) {
        return 'Nuestros precios varían según el tipo de joya y materiales. ¿Te gustaría que te ayude a encontrar algo específico?';
    } else if (lowerMessage.includes('entrega') || lowerMessage.includes('envío') || lowerMessage.includes('delivery')) {
        return 'Realizamos entregas en toda Bolivia. Los tiempos de entrega varían de 2-5 días hábiles.';
    } else if (lowerMessage.includes('garantía') || lowerMessage.includes('garantia')) {
        return 'Todas nuestras joyas tienen garantía de por vida en defectos de fabricación.';
    } else if (lowerMessage.includes('talla') || lowerMessage.includes('medida')) {
        return 'Te podemos ayudar a medir tu talla. Tenemos un medidor digital en la tienda.';
    } else if (lowerMessage.includes('pago') || lowerMessage.includes('tarjeta') || lowerMessage.includes('efectivo')) {
        return 'Aceptamos efectivo, tarjetas de crédito/débito y transferencias bancarias.';
    } else if (lowerMessage.includes('descuento') || lowerMessage.includes('oferta') || lowerMessage.includes('promoción')) {
        return 'Tenemos descuentos especiales para nuevos clientes. ¡Suscríbete a nuestro newsletter!';
    } else {
        return 'Gracias por tu mensaje. Un asesor te contactará pronto para ayudarte mejor.';
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    
    if (!searchTerm) {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.material.toLowerCase().includes(searchTerm) ||
        product.stone.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Newsletter Subscription
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = newsletterInput.value.trim();
        if (email && isValidEmail(email)) {
            showNotification('¡Gracias por suscribirte! Recibirás nuestras ofertas especiales.', 'success');
            newsletterInput.value = '';
        } else {
            showNotification('Por favor, ingresa un email válido.', 'error');
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize additional functionality
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    setupNewsletter();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .service-card, .blog-card, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Hero Slider Functionality
function setupHeroSlider() {
    const slider = document.getElementById('hero-slider');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const playPauseBtn = document.getElementById('play-pause');
    const fullscreenBtn = document.getElementById('fullscreen');
    
    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;
    let progressInterval;
    const slideDuration = 3000; // 3 seconds
    
    // Initialize slider
    function initSlider() {
        showSlide(currentSlide);
        startAutoPlay();
        setupEventListeners();
    }
    
    // Show specific slide
    function showSlide(slideIndex) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[slideIndex].classList.add('active');
        indicators[slideIndex].classList.add('active');
        
        currentSlide = slideIndex;
        
        // Add visual feedback for auto-play
        const currentIndicator = indicators[slideIndex];
        currentIndicator.style.transform = 'scale(1.5)';
        setTimeout(() => {
            currentIndicator.style.transform = 'scale(1.3)';
        }, 200);
        
        // Restart progress bar if auto-play is active
        if (isPlaying) {
            startProgressBar();
        }
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        showSlide(currentSlide);
    }
    
    // Start auto-play
    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        if (progressInterval) clearInterval(progressInterval);
        
        // Start slide timer
        slideInterval = setInterval(() => {
            if (isPlaying) {
                nextSlide();
            }
        }, slideDuration);
        
        // Start progress bar
        startProgressBar();
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        resetProgressBar();
    }
    
    // Start progress bar animation
    function startProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        progressBar.style.width = '0%';
        let progress = 0;
        
        progressInterval = setInterval(() => {
            if (isPlaying) {
                progress += (100 / (slideDuration / 50)); // Update every 50ms for smooth animation
                progressBar.style.width = Math.min(progress, 100) + '%';
                
                if (progress >= 100) {
                    progress = 0;
                }
            }
        }, 50);
    }
    
    // Reset progress bar
    function resetProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            startAutoPlay();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            stopAutoPlay();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // Toggle fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            slider.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Reset timer
        });
        
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer
        });
        
        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                startAutoPlay(); // Reset timer
            });
        });
        
        // Play/Pause button
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
        
        // Fullscreen button
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoPlay();
            } else if (e.key === ' ') {
                e.preventDefault();
                togglePlayPause();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
                startAutoPlay(); // Reset timer
            }
        }
        
        // Pause on hover (optional)
        slider.addEventListener('mouseenter', () => {
            if (isPlaying) {
                stopAutoPlay();
            }
        });
        
        slider.addEventListener('mouseleave', () => {
            if (isPlaying) {
                startAutoPlay();
            }
        });
    }
    
    // Initialize the slider
    initSlider();
}
