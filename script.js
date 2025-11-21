// Carrinho armazenado em localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualizar contador do carrinho na navbar
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.textContent = count;
}

// Renderizar itens do carrinho no modal
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItems.innerHTML += `
                <div class="item">
                    <div>
                        <strong>${item.product}</strong> - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}
                    </div>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remover</button>
                </div>
            `;
        });
    }

    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
    updateCartCount();
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Erro ao salvar carrinho no localStorage:', e);
    }
}

// Adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        const price = parseFloat(this.getAttribute('data-price'));
        const existingItem = cart.find(item => item.product === product);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ product, price, quantity: 1 });
        }

        renderCart();
        alert(`${product} adicionado ao carrinho!`);
    });
});

// Remover item do carrinho
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
        const index = e.target.getAttribute('data-index');
        cart.splice(index, 1);
        renderCart();
    }
});

// Simular compra
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
        } else {
            alert('Compra realizada com sucesso! Obrigado por escolher a Banca 113.');
            cart = [];
            renderCart();
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (cartModal) {
                cartModal.hide();
            }
        }
    });
}

// Modo Escuro
const darkModeToggle = document.getElementById('dark-mode-toggle');
// Referência correta ao elemento raiz <html>
const htmlEl = document.documentElement;

function setDarkMode(isDark) {
    if (isDark) htmlEl.classList.add('dark-mode'); else htmlEl.classList.remove('dark-mode');
    try {
        localStorage.setItem('darkMode', isDark);
    } catch (e) {
        console.warn('Erro ao salvar modo escuro no localStorage:', e);
    }
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
        darkModeToggle.setAttribute('aria-pressed', isDark);
    }
}

function toggleDarkMode() {
    const isDark = htmlEl.classList.toggle('dark-mode');
    try {
        localStorage.setItem('darkMode', isDark);
    } catch (e) {
        console.warn('Erro ao salvar modo escuro no localStorage:', e);
    }
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
        darkModeToggle.setAttribute('aria-pressed', isDark);
    }
}

// Inicializar estado do tema (garantir texto correto no botão)
try {
    const isDark = htmlEl.classList.contains('dark-mode');
    setDarkMode(isDark);
} catch (e) {
    console.warn('Erro ao inicializar modo escuro:', e);
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

// ANIMAÇÕES: Fade-In com Intersection Observer e Atraso Escalado
const observer = new IntersectionObserver((entries) => {
    let staggeredDelay = 0;
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, staggeredDelay); 
            
            staggeredDelay += 200; // Incrementa o atraso para o próximo elemento
            
            // Parar de observar depois de visível (para não re-animar)
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.2 }); 

document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
});


// Formulário de Contato
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert(`Obrigado, ${name}! Sua mensagem foi enviada. Entraremos em contato em breve.`);
            this.reset();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
}

// Smooth scroll para links da navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Inicializar carrinho ao carregar a página
renderCart();