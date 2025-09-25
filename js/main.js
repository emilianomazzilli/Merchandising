// Lógica de categorías y carrito

document.addEventListener('DOMContentLoaded', function() {
    // Panel lateral carrito
    const carritoBtn = document.getElementById('carrito-btn');
    const carritoPanel = document.getElementById('carrito-panel');
    const carritoCerrar = document.getElementById('carrito-cerrar');

    carritoBtn.addEventListener('click', () => {
        carritoPanel.classList.add('activo');
    });
    carritoCerrar.addEventListener('click', () => {
        carritoPanel.classList.remove('activo');
    });

    // Filtrado por categorías
    const categoriaLinks = document.querySelectorAll('.categorias__enlace');
    const productosGrid = document.getElementById('productos-grid');
    const productos = Array.from(productosGrid.children).filter(el => el.classList.contains('producto'));

    categoriaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoriaLinks.forEach(l => l.classList.remove('categorias__enlace--activo'));
            this.classList.add('categorias__enlace--activo');
            const cat = this.dataset.categoria;
            productos.forEach(prod => {
                if(cat === 'frontend' && ['VueJS','AngularJs','ReactJS','Redux','SASS','HTML5','BulmaCSS','JavaScript','GraphQL','WordPress'].includes(prod.querySelector('.producto__nombre').textContent)) {
                    prod.style.display = '';
                } else if(cat === 'backend' && ['Node.JS','Drupal'].includes(prod.querySelector('.producto__nombre').textContent)) {
                    prod.style.display = '';
                } else if(cat === 'herramientas' && ['Github','TypeScript'].includes(prod.querySelector('.producto__nombre').textContent)) {
                    prod.style.display = '';
                } else if(cat === 'otros') {
                    prod.style.display = '';
                } else if(cat !== 'otros') {
                    prod.style.display = 'none';
                }
            });
        });
    });

    // Carrito básico
    let carrito = [];
    productos.forEach(prod => {
        const btn = document.createElement('button');
        btn.textContent = 'Agregar al carrito';
        btn.className = 'producto__agregar';
        prod.querySelector('.producto__informacion').appendChild(btn);
        btn.addEventListener('click', () => {
            const nombre = prod.querySelector('.producto__nombre').textContent;
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

    function renderCarrito() {
        const cont = document.getElementById('carrito-contenido');
        if(carrito.length === 0) {
            cont.innerHTML = '<p>El carrito está vacío.</p>';
            return;
        }
        cont.innerHTML = carrito.map(item => `
            <div class="carrito__item">
                <img src="${item.img}" alt="${item.nombre}" style="width:50px;vertical-align:middle;">
                <span>${item.nombre}</span>
                <span>${item.precio}</span>
                <span>Cantidad: ${item.cantidad}</span>
            </div>
        `).join('');
    }
});
