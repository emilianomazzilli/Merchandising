// Lógica de categorías y carrito

document.addEventListener('DOMContentLoaded', function() {
    // Panel lateral carrito
    const carritoBtn = document.getElementById('carrito-btn');
    const carritoPanel = document.getElementById('carrito-panel');
    const carritoCerrar = document.getElementById('carrito-cerrar');

    if(carritoBtn && carritoPanel) {
        carritoBtn.addEventListener('click', () => {
            carritoPanel.classList.add('activo');
        });
    }
    if(carritoCerrar && carritoPanel) {
        carritoCerrar.addEventListener('click', () => {
            carritoPanel.classList.remove('activo');
        });
    }

    // Carrito básico
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Solo ejecuta la lógica de categorías y productos si existen
    const categoriaLinks = document.querySelectorAll('.categorias__enlace');
    const productosGrid = document.getElementById('productos-grid');
    if(productosGrid && categoriaLinks.length > 0) {
        const productos = Array.from(productosGrid.children).filter(el => el.classList.contains('producto'));

        categoriaLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                categoriaLinks.forEach(l => l.classList.remove('categorias__enlace--activo'));
                this.classList.add('categorias__enlace--activo');
                const cat = this.dataset.categoria;
                productos.forEach(prod => {
                    if(cat === 'ropa' && ['Camiseta Azul','Camiseta Roja','Camiseta Verde','Camiseta Rosa','Camiseta DuG','Visera GEN','Pescador GEN'].includes(prod.querySelector('.producto__nombre').textContent)) {
                        prod.style.display = '';
                    } else if(cat === 'hogar' && ['T.GEN slogan','T.GEN poema','Posavasos GEN','Posavasos GEN Alt.'].includes(prod.querySelector('.producto__nombre').textContent)) {
                        prod.style.display = '';
                    } else if(cat === 'varios' && ['Funda GEN','Funda GEN Alt.','Diario GEN'].includes(prod.querySelector('.producto__nombre').textContent)) {
                        prod.style.display = '';
                    } else if(cat === 'otros') {
                        prod.style.display = '';
                    } else if(cat !== 'otros') {
                        prod.style.display = 'none';
                    }
                });

                // Ocultar los gráficos si NO es "otros"
                const graficos = document.querySelectorAll('.grafico');
                if(cat !== 'otros') {
                    graficos.forEach(g => g.style.display = 'none');
                } else {
                    graficos.forEach(g => g.style.display = '');
                }
            });
        });

        productos.forEach(prod => {
            const btn = document.createElement('button');
            btn.textContent = 'Agregar al carrito';
            btn.className = 'producto__agregar';
            prod.querySelector('.producto__informacion').appendChild(btn);
            btn.addEventListener('click', () => {
                const nombreBase = prod.querySelector('.producto__nombre').textContent;
                const nombre = `${nombreBase} (Mediana)`; // Cambiado aquí
                const precio = prod.querySelector('.producto__precio').textContent;
                const img = prod.querySelector('img').src;
                const existente = carrito.find(p => p.nombre === nombre);
                if(existente) {
                    existente.cantidad++;
                } else {
                    carrito.push({nombre, precio, img, cantidad: 1});
                }
                renderCarrito();
            });
        });
    }

    function renderCarrito() {
        const cont = document.getElementById('carrito-contenido');
        if(carrito.length === 0) {
            cont.innerHTML = '<p>El carrito está vacío.</p>';
            return;
        }
        cont.innerHTML = carrito.map((item, idx) => `
            <div class="carrito__item">
                <img src="${item.img}" alt="${item.nombre}" style="width:50px;vertical-align:middle;">
                <span>${item.nombre}</span>
                <span>${item.precio}</span>
                <span>Cantidad: ${item.cantidad}</span>
                <button class="carrito__eliminar" data-idx="${idx}">X</button>
            </div>
        `).join('');

        // Calcular el total
        const total = carrito.reduce((acc, item) => {
            // Extrae el número del precio, soporta "$", "USD", etc.
            const num = parseFloat(item.precio.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
            return acc + num * item.cantidad;
        }, 0);

        // Mostrar el total al final
        cont.innerHTML += `<div style="margin-top:2rem;text-align:right;font-size:2rem;">
            <strong>Total: $${total.toFixed(2)}</strong>
        </div>`;

        // Agregar evento a los botones eliminar
        document.querySelectorAll('.carrito__eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                carrito.splice(idx, 1);
                guardarCarrito();
                renderCarrito();
            });
        });
        guardarCarrito();
    }

    // Lógica para agregar productos desde producto.html
    const productoForm = document.querySelector('.formulario');
    if(productoForm) {
        const submitBtn = productoForm.querySelector('.formulario__submit');
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const tallaSelect = productoForm.querySelector('select');
            const talla = tallaSelect.value;
            if (!talla || talla.startsWith('--')) {
                alert('Selecciona una talla');
                return;
            }
            const cantidadInput = productoForm.querySelector('input[type="number"]');
            const cantidad = parseInt(cantidadInput.value) || 1;
            const nombreBase = document.querySelector('h1').textContent.trim();
            const nombre = `${nombreBase} (${talla})`;
            const precio = document.querySelector('.camisa__precio') ? document.querySelector('.camisa__precio').textContent : '$25';
            const img = document.querySelector('.camisa__imagen').src;
            let existente = carrito.find(p => p.nombre === nombre);
            if(existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push({nombre, precio, img, cantidad});
            }
            renderCarrito();
            carritoPanel.classList.add('activo'); // Abre el panel del carrito
        });
    }

    // Modal compra
    const modalCompra = document.getElementById('modal-compra');
    const modalCompraCerrar = document.getElementById('modal-compra-cerrar');
    const carritoComprar = document.getElementById('carrito-comprar');
    const formCompra = document.getElementById('form-compra');

    if(carritoComprar && modalCompra) {
        carritoComprar.addEventListener('click', function() {
            modalCompra.classList.add('activo');
        });
    }
    if(modalCompraCerrar && modalCompra) {
        modalCompraCerrar.addEventListener('click', function() {
            modalCompra.classList.remove('activo');
        });
    }
    if(formCompra) {
        formCompra.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Compra realizada con éxito!\nGracias por tu pedido.');
            modalCompra.classList.remove('activo');
            carrito = [];
            guardarCarrito();
            renderCarrito();
        });
    }
    renderCarrito();
});
