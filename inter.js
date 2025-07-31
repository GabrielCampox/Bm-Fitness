// TOAST SYSTEM
function showToast(title, description, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// SCROLL FUNCTIONS
function scrollToForm() {
    const formSection = document.getElementById('inscricao');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToInfo() {
    const infoSection = document.getElementById('como-funciona');
    if (infoSection) {
        infoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// PRELOAD IMAGES
function preloadImages() {
    const imageUrls = [
        'src/assets/hero-image.jpg',
        'src/assets/community-image.jpg',
        'src/assets/nutritionist-photo.jpg',
        'src/assets/bm-fitness-logo.png'
    ];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// DOM READY
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');
    const phoneInput = document.getElementById('telefone');

    const grupoLinks = {
        emagrecimento: 'https://chat.whatsapp.com/H0vg4nHrM8c7yAwUt5zj7W',
        'ganho-massa': 'https://chat.whatsapp.com/EYISNjwEyaEBK0mRaTMG3E?mode=ac_t'
    };

    // PHONE FORMAT
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 2) {
                value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // FORM SUBMISSION
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const rawFormData = new FormData(form);
            const data = {
                nome: rawFormData.get('nome'),
                telefone: rawFormData.get('telefone'),
                email: rawFormData.get('email'),
                objetivo: rawFormData.get('objetivo'),
                timestamp: new Date().toISOString(),
                source: 'BM Fitness - Desafio 90 Dias'
            };

            const termsCheckbox = document.getElementById('terms');
            if (!termsCheckbox.checked) {
                showToast('Termos não aceitos', 'Você precisa aceitar os termos.', 'error');
                return;
            }

            if (!data.nome || !data.telefone || !data.objetivo) {
                showToast('Campos obrigatórios', 'Preencha todos os campos.', 'error');
                return;
            }

            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <span>Enviando...</span>
                </div>
            `;

            try {
                // ✅ Envia dados para o Google Sheets via Web App
                const payload = new FormData();
                payload.append('nome', data.nome);
                payload.append('email', data.email);
                payload.append('telefone', data.telefone);
                payload.append('objetivo', data.objetivo);

                await fetch('https://script.google.com/macros/s/AKfycbzAew5jAli3BqlZILKwTL1RlRYvhIO43_6GD0Y2h7u0esEijNPmzXxyS9FhRX1N5IHb/exec', {
                    method: 'POST',
                    body: payload
                });

                showToast(
                    'Inscrição realizada! 🎉',
                    'Você será redirecionado para o grupo agora mesmo.',
                    'success'
                );

                setTimeout(() => {
                    const linkDestino = grupoLinks[data.objetivo];
                    if (linkDestino) {
                        window.location.href = linkDestino;
                    } else {
                        showToast('Erro', 'Objetivo não encontrado para redirecionamento.', 'error');
                    }
                }, 2000);

                form.reset();
            } catch (error) {
                console.error('Erro ao enviar:', error);
                showToast('Erro no envio', 'Tente novamente.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // ANIMAÇÃO NOS CARDS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card, .benefit-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    preloadImages();
});

// GLOBAL
window.scrollToForm = scrollToForm;
window.scrollToInfo = scrollToInfo;
