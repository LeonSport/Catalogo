// Catalog Products Data
    const products = [
        {
            id: 1,
            title: "Uniforme Fútbol Elite Crimson",
            category: "futbol",
            categoryLabel: "Fútbol",
            image: "./imgs/catalogo/futbol/1 (1).jpg"
        },
        {
            id: 2,
            title: "Kit Baloncesto Hoops Pro",
            category: "baloncesto",
            categoryLabel: "Baloncesto",
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1080&h=1350&q=80"
        },
        {
            id: 3,
            title: "Uniforme Voleibol Active Flex",
            category: "voleibol",
            categoryLabel: "Voleibol",
            image: "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=1080&h=1350&q=80"
        },
        {
            id: 4,
            title: "Camiseta Runner Stride Light",
            category: "Presentación",
            categoryLabel: "Presentación",
            image: "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1080&h=1350&q=80"
        },
        {
            id: 5,
            title: "Uniforme Fútbol Striker Neon",
            category: "futbol",
            categoryLabel: "Fútbol",
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1080&h=1350&q=80"
        },
        {
            id: 6,
            title: "Conjunto Voleibol Spike Pro",
            category: "voleibol",
            categoryLabel: "Voleibol",
            image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1080&h=1350&q=80"
        }
    ];

    let currentCategoryList = [];
    let currentIndex = 0;

    // Render Catalog Products
    function renderProducts(items) {
        const grid = document.getElementById('catalog-grid');
        grid.innerHTML = '';

        items.forEach(product => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col relative";
            card.onclick = () => openFullscreenImageDirect(product.id);
            
            card.innerHTML = `
                <div class="aspect-[4/5] overflow-hidden relative bg-slate-100 w-full">
                    <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm text-slate-800 font-bold text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">
                        ${product.categoryLabel}
                    </span>
                    <div class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="bg-white/90 text-slate-900 font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                            <i class="fa-solid fa-expand"></i> Ver pantalla completa
                        </span>
                    </div>
                </div>
                <div class="p-3 sm:p-4 text-center bg-white border-t border-slate-50">
                    <h3 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">${product.title}</h3>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Filter Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-brand-600', 'text-white', 'shadow-md');
                b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
            });

            btn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
            btn.classList.add('bg-brand-600', 'text-white', 'shadow-md');

            const category = btn.getAttribute('data-category');
            if (category === 'todos') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });

    // Abrir directamente en pantalla completa filtrando por categoría
    function openFullscreenImageDirect(id) {
        const targetProduct = products.find(p => p.id === id);
        if (!targetProduct) return;

        // Obtener solo los productos de la misma categoría para navegar entre ellos
        currentCategoryList = products.filter(p => p.category === targetProduct.category);
        currentIndex = currentCategoryList.findIndex(p => p.id === id);

        updateModalContent();

        // Agregar estado al historial para que el botón "Atrás" del celular cierre el visor
        history.pushState({ modalOpen: true }, '');
        document.getElementById('fullscreen-modal').classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    // Actualizar contenido visual del visor
    function updateModalContent() {
        const product = currentCategoryList[currentIndex];
        if (!product) return;

        const imgElement = document.getElementById('fullscreen-img');
        imgElement.style.opacity = '0';
        
        setTimeout(() => {
            imgElement.src = product.image;
            document.getElementById('fs-category').innerText = product.categoryLabel;
            
            const waMsg = encodeURIComponent(`Hola, me interesa obtener información y cotizar el modelo: ${product.title}`);
            document.getElementById('fs-whatsapp-btn').href = `https://wa.me/573143022180?text=${waMsg}`;
            imgElement.style.opacity = '1';
        }, 150);
    }

    // Navegar imagen anterior
    function prevImage() {
        if (currentCategoryList.length === 0) return;
        currentIndex = (currentIndex - 1 + currentCategoryList.length) % currentCategoryList.length;
        updateModalContent();
    }

    // Navegar imagen siguiente
    function nextImage() {
        if (currentCategoryList.length === 0) return;
        currentIndex = (currentIndex + 1) % currentCategoryList.length;
        updateModalContent();
    }

    // Cerrar visor
    function closeFullscreenImage() {
        const modal = document.getElementById('fullscreen-modal');
        if (!modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
            // Si el modal se abrió empujando el historial, volvemos atrás si es necesario
            if (window.history.state && window.history.state.modalOpen) {
                window.history.back();
            }
        }
    }

    // Escuchar el botón de retroceso (Back) del celular o navegador
    window.addEventListener('popstate', (event) => {
        const modal = document.getElementById('fullscreen-modal');
        if (modal && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
    });

    // Soporte para gestos táctiles (Swipe / Arrastrar) en móviles
    let touchStartX = 0;
    let touchEndX = 0;

    const fsContainer = document.getElementById('fullscreen-container');
    if (fsContainer) {
        fsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        fsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50; // Mínimo de distancia en píxeles para considerar un gesto
        if (touchEndX < touchStartX - swipeThreshold) {
            // Deslizó hacia la izquierda -> Siguiente imagen
            nextImage();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Deslizó hacia la derecha -> Imagen anterior
            prevImage();
        }
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Initialize Catalog on Load
    window.addEventListener('DOMContentLoaded', () => {
        renderProducts(products);
    });
