// Carrinho armazenado em localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualizar contador do carrinho na navbar
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.textContent = count;
}

// Função para exibir o Toast (Mensagens Curtas)
function showToast(message) {
    const toastEl = document.getElementById('custom-toast');
    const toastBody = document.getElementById('toast-message');
    if (toastBody) toastBody.textContent = message;

    if (toastEl) {
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    }
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
        showToast(`${product} adicionado ao carrinho!`);
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
            showToast('Seu carrinho está vazio!');
        } else {
            showToast('Compra realizada com sucesso! Obrigado por escolher a Banca 113.');
            
            // Fechar modal
            const cartModalEl = document.getElementById('cartModal');
            const cartModal = bootstrap.Modal.getInstance(cartModalEl);
            if (cartModal) {
                cartModal.hide();
            }

            cart = [];
            renderCart();
        }
    });
}

// ##########################################
// Modo Escuro (Dark Mode) - COM ÍCONES
// ##########################################
const darkModeToggleDesktop = document.getElementById('dark-mode-toggle-desktop');
const darkModeToggleFab = document.getElementById('dark-mode-toggle-fab');

const htmlEl = document.documentElement; 

function setDarkMode(isDark) {
    if (isDark) htmlEl.classList.add('dark-mode'); else htmlEl.classList.remove('dark-mode');
    
    try {
        localStorage.setItem('darkMode', isDark);
    } catch (e) {
        console.warn('Erro ao salvar modo escuro no localStorage:', e);
    }
    
    // Atualizar o botão Desktop (Navbar)
    if (darkModeToggleDesktop) {
        const iconDesktop = darkModeToggleDesktop.querySelector('i'); // Pega o <i> dentro do botão
        if (iconDesktop) {
            iconDesktop.classList.toggle('fa-moon', isDark);
            iconDesktop.classList.toggle('fa-sun', !isDark);
        }
        darkModeToggleDesktop.childNodes[1].nodeValue = isDark ? ' Modo Claro' : ' Modo Escuro'; // Atualiza o texto
        darkModeToggleDesktop.setAttribute('aria-pressed', isDark);
    }
    
    // Atualizar o FAB (Mobile)
    if (darkModeToggleFab) {
        const iconFab = darkModeToggleFab.querySelector('i'); // Pega o <i> dentro do FAB
        if (iconFab) {
            iconFab.classList.toggle('fa-moon', isDark);
            iconFab.classList.toggle('fa-sun', !isDark);
        }
        darkModeToggleFab.setAttribute('aria-pressed', isDark);
    }
}

function toggleDarkMode() {
    const isDark = !htmlEl.classList.contains('dark-mode');
    setDarkMode(isDark);
}

// Inicializar estado do tema e ícones
try {
    const saved = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // A lógica de inicialização precisa chamar setDarkMode para configurar os ícones corretamente
    if (saved === 'true') {
        setDarkMode(true);
    } else if (saved === 'false') {
        setDarkMode(false);
    } else { // Nenhum salvo, usa preferência do sistema
        setDarkMode(systemPrefersDark);
    }
} catch (e) {
    console.warn('Erro ao acessar localStorage para modo escuro:', e);
}

// Adicionar listener de evento aos dois botões
if (darkModeToggleDesktop) {
    darkModeToggleDesktop.addEventListener('click', toggleDarkMode);
}
if (darkModeToggleFab) {
    darkModeToggleFab.addEventListener('click', toggleDarkMode);
}

// ##########################################
// Sombra da Navbar ao Rolar
// ##########################################
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) { 
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});


// ##########################################
// Sistema de Avaliação por Estrelas
// ##########################################

document.querySelectorAll('.rating').forEach(ratingContainer => {
    const stars = ratingContainer.querySelectorAll('.star');
    const ratingText = ratingContainer.querySelector('.rating-value');
    const product = ratingContainer.getAttribute('data-product');

    // Carregar avaliação salva
    let currentRating = localStorage.getItem(`rating-${product}`) ? parseInt(localStorage.getItem(`rating-${product}`)) : 0;
    
    function updateStars(rating) {
        stars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));
            if (value <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        ratingText.textContent = rating;
    }

    // Inicializar estrelas
    updateStars(currentRating);

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const newRating = parseInt(this.getAttribute('data-value'));
            currentRating = newRating;
            updateStars(newRating);
            localStorage.setItem(`rating-${product}`, newRating);
            showToast(`Você avaliou ${product} com ${newRating} estrelas!`);
        });

        // Efeito de hover 
        star.addEventListener('mouseover', function() {
            if (window.matchMedia('(hover: hover)').matches) { 
                const value = parseInt(this.getAttribute('data-value'));
                stars.forEach(s => {
                    const sValue = parseInt(s.getAttribute('data-value'));
                    if (sValue <= value) {
                        s.style.color = '#ffc107'; 
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            }
        });

        star.addEventListener('mouseout', function() {
            if (window.matchMedia('(hover: hover)').matches) { 
                updateStars(currentRating);
            }
        });
    });
});

// ##########################################
// Animações Fade-In (Otimizadas)
// ##########################################
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.2 }); 

document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
});

// ##########################################
// Formulário e Scroll
// ##########################################
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            showToast(`Obrigado, ${name}! Sua mensagem foi enviada. Entraremos em contato em breve.`);
            this.reset();
        } else {
            showToast('Por favor, preencha todos os campos.');
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