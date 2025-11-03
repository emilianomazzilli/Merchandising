// Asegurar carrito global y función de guardado (evita ReferenceError desde otras funciones)
var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Asegurar referencias al panel/carrito en ámbito global (evita ReferenceError)
var carritoPanel = document.getElementById("carrito-panel");
var carritoBtn = document.getElementById("carrito-btn");
var carritoCerrar = document.getElementById("carrito-cerrar");

document.addEventListener("DOMContentLoaded", function () {
  // Panel lateral carrito (usa las referencias globales)
  if (carritoBtn && carritoPanel) {
    carritoBtn.addEventListener("click", () => {
      carritoPanel.classList.add("activo");
    });
  }
  if (carritoCerrar && carritoPanel) {
    carritoCerrar.addEventListener("click", () => {
      carritoPanel.classList.remove("activo");
    });
  }

  // asegurar mínimo 1 en todos los inputs numéricos existentes
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.min = 1;
  });
});

// Observer para inputs añadidos dinamicamente (ej: plantillas, inserciones)
const numberInputObserver = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    m.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      // si el nodo es directamente un input[type=number]
      if (node.matches && node.matches('input[type="number"]')) node.min = 1;
      // buscar dentro del subtree
      node.querySelectorAll &&
        node.querySelectorAll('input[type="number"]').forEach((inp) => {
          inp.min = 1;
        });
    });
  });
});
numberInputObserver.observe(document.body, { childList: true, subtree: true });

// Menú desplegable de categorías
const categoriasToggle = document.getElementById("categorias-toggle");
const categoriasMenu = document.getElementById("categorias-menu");

if (categoriasToggle && categoriasMenu) {
  categoriasToggle.addEventListener("click", function () {
    this.classList.toggle("activo");
    categoriasMenu.classList.toggle("activo");
  });

  // Cerrar el menú al hacer click fuera
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".categorias__contenedor")) {
      categoriasToggle.classList.remove("activo");
      categoriasMenu.classList.remove("activo");
    }
  });
}

// Solo ejecuta la lógica de categorías y productos si existen
const categoriaLinks = document.querySelectorAll(".categorias__enlace");
const productosGrid = document.getElementById("productos-grid");

if (productosGrid && categoriaLinks.length > 0) {
  const productos = Array.from(productosGrid.children).filter((el) =>
    el.classList.contains("producto")
  );

  categoriaLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      categoriaLinks.forEach((l) =>
        l.classList.remove("categorias__enlace--activo")
      );
      this.classList.add("categorias__enlace--activo");
      const cat = this.dataset.categoria;
      productos.forEach((prod) => {
        if (
          cat === "ropa" &&
          [
            "Camiseta Azul",
            "Camiseta Roja",
            "Camiseta Verde",
            "Camiseta Rosa",
            "Camiseta DuG",
            "Visera GEN",
            "Pescador GEN",
          ].includes(prod.querySelector(".producto__nombre").textContent)
        ) {
          prod.style.display = "";
        } else if (
          cat === "hogar" &&
          [
            "T.GEN slogan",
            "T.GEN poema",
            "Posavasos GEN",
            "Posavasos GEN Alt.",
          ].includes(prod.querySelector(".producto__nombre").textContent)
        ) {
          prod.style.display = "";
        } else if (
          cat === "varios" &&
          ["Funda GEN", "Funda GEN Alt.", "Diario GEN"].includes(
            prod.querySelector(".producto__nombre").textContent
          )
        ) {
          prod.style.display = "";
        } else if (cat === "otros") {
          prod.style.display = "";
        } else if (cat !== "otros") {
          prod.style.display = "none";
        }
      });

      // Ocultar los gráficos si NO es "otros"
      const graficos = document.querySelectorAll(".grafico");
      if (cat !== "otros") {
        graficos.forEach((g) => (g.style.display = "none"));
      } else {
        graficos.forEach((g) => (g.style.display = ""));
      }
    });
  });

  // NO agregar botones de "Agregar al carrito" en index.html
  // Los productos solo se pueden agregar desde producto.html
}

function renderCarrito() {
  const cont = document.getElementById("carrito-contenido");
  if (carrito.length === 0) {
    cont.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  cont.innerHTML = carrito
    .map(
      (item, idx) => `
            <div class="carrito__item">
                <img src="${item.img}" alt="${item.nombre}">
                <div class="carrito__item-info">
                <span class="carrito__item-nombre">${item.nombre}</span>
                <span class="carrito__item-precio">${item.precio}</span>
                    <span class="carrito__item-cantidad">Cantidad: ${item.cantidad}</span>
                </div>
                <button class="carrito__eliminar" data-idx="${idx}">✕</button>
            </div>
        `
    )
    .join("");

  // Calcular el total
  const total = carrito.reduce((acc, item) => {
    const num =
      parseFloat(item.precio.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
    return acc + num * item.cantidad;
  }, 0);

  // Mostrar el total
  cont.innerHTML += `<div class="carrito__total">
            <strong>Total: $${total.toFixed(2)}</strong>
        </div>`;

  // Agregar evento a los botones eliminar
  document.querySelectorAll(".carrito__eliminar").forEach((btn) => {
    btn.addEventListener("click", function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      carrito.splice(idx, 1);
      guardarCarrito();
      renderCarrito();
    });
  });
  guardarCarrito();
}

// Lógica para agregar productos desde producto.html
const productoForm = document.querySelector(".formulario");
if (productoForm) {
  // aseguro que siempre exista min=1 en el input de cantidad
  const cantidadInputEl = productoForm.querySelector('input[type="number"]');
  if (cantidadInputEl) cantidadInputEl.min = 1;

  productoForm.addEventListener("click", function (e) {
    // este listener no es adecuado para clicks generales; lo dejamos como estaba si es botón,
    // pero mejor detectar el botón de submit específico:
  });

  const submitBtn = productoForm.querySelector(".formulario__submit");
  if (submitBtn) {
    // <-- añadido chequeo para evitar errores si no existe
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // determinar categoria (primero intentar dataset, si no, leer de URL)
      const categoriaForm =
        productoForm.dataset.categoria ||
        new URLSearchParams(window.location.search).get("categoria") ||
        "otros";

      const tallaSelect = productoForm.querySelector("select");
      const cantidadInput = productoForm.querySelector('input[type="number"]');
      const cantidad = parseInt(cantidadInput.value) || 1;

      if (cantidad < 1) {
        alert("La cantidad debe ser al menos 1");
        return;
      }

      // Si es ropa, validar talla; si no, saltar la validación de talla
      let talla = "";
      if (categoriaForm === "ropa") {
        if (!tallaSelect) {
          alert("Selecciona una talla");
          return;
        }
        talla = tallaSelect.value;
        if (!talla || talla.startsWith("--")) {
          alert("Selecciona una talla");
          return;
        }
      }

      const nombreBase = document.querySelector("h1").textContent.trim();
      const nombre =
        categoriaForm === "ropa" ? `${nombreBase} (${talla})` : nombreBase;
      const img = document.querySelector(".camisa__imagen").src;
      let existente = carrito.find((p) => p.nombre === nombre);
      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ nombre, precio, img, cantidad });
      }
      renderCarrito();
      carritoPanel.classList.add("activo");

      // Mensaje de confirmación
      const mensaje = document.createElement("div");
      mensaje.className = "mensaje-agregado";
      mensaje.textContent = `✓ ${cantidad} ${nombreBase} agregado al carrito`;
      document.body.appendChild(mensaje);

      setTimeout(() => {
        mensaje.classList.add("mostrar");
      }, 10);

      setTimeout(() => {
        mensaje.classList.remove("mostrar");
        setTimeout(() => mensaje.remove(), 300);
      }, 2000);
    });
  }
}

// Producto.html - configurar página según params y ocultar select si no es ropa
(function () {
  const params = new URLSearchParams(window.location.search);
  const nombre =
    params.get("nombre") ||
    document.querySelector("h1")?.textContent?.trim() ||
    "Producto";
  const img =
    params.get("img") ||
    document.querySelector(".camisa__imagen")?.src ||
    "img/3.jpeg";
  const categoria = params.get("categoria") || "otros";

  // título
  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = nombre;

  // imagen
  const imgTag = document.querySelector(".camisa__imagen");
  if (imgTag) {
    imgTag.src = img;
    imgTag.alt = nombre;
  }

  // precio (crear si no existe) — obtener directamente desde params al asignar
  let precioP = document.querySelector(".camisa__precio");
  if (!precioP) {
    precioP = document.createElement("p");
    precioP.className = "camisa__precio";
    const cont =
      document.querySelector(".camisa__contenido") ||
      imgTag?.parentElement ||
      document.querySelector("main.contenedor");

    // insertar antes del formulario si existe, sino al inicio del contenedor, sino append
    const formularioLocalTemp = cont ? cont.querySelector(".formulario") : document.querySelector(".formulario");
    if (cont && formularioLocalTemp) {
      cont.insertBefore(precioP, formularioLocalTemp);
    } else if (cont) {
      cont.insertBefore(precioP, cont.firstChild);
    } else {
      document.body.appendChild(precioP);
    }
  }
  // usar el parámetro "precio" si existe, sino fallback
  const precioParam = params.get("precio");
  if (precioP) precioP.textContent = precioParam ? precioParam : "";

  // formulario: categoria, talles y min cantidad
  const formularioLocal = document.querySelector(".formulario");
  if (formularioLocal) {
    formularioLocal.dataset.categoria = categoria;

    const selectTalla = formularioLocal.querySelector("select");
    if (categoria !== "ropa") {
      if (selectTalla) selectTalla.style.display = "none";
    } else {
      if (selectTalla) {
        selectTalla.style.display = "";
        // asegurar opciones S, M, L, XL
        selectTalla.innerHTML =
          "<option disabled selected>-- Seleccionar Talla --</option>" +
          '<option value="S">S</option>' +
          '<option value="M">M</option>' +
          '<option value="L">L</option>' +
          '<option value="XL">XL</option>';
      }
    }

    const cantidadInput = formularioLocal.querySelector('input[type="number"]');
    if (cantidadInput) cantidadInput.min = 1;
  }
})();

// Validaciones del formulario de compra
function validarNombre(nombre) {
  const regex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]{4,}$/;
  const palabras = nombre.trim().split(/\s+/);
  return (
    regex.test(nombre) &&
    palabras.length >= 2 &&
    palabras.every((p) => p.length >= 2)
  );
}

function validarDireccion(direccion) {
  const tieneLetras = /[a-zA-Z]/.test(direccion);
  const tieneNumeros = /[0-9]/.test(direccion);
  return tieneLetras && tieneNumeros && direccion.length >= 10;
}

function validarCodigoPostal(cp) {
  const regex = /^[0-9]{5}$/;
  return regex.test(cp);
}

function validarTelefono(tel) {
  const regex = /^(\+?598)?[0-9]{8,9}$/;
  const numeros = tel.replace(/[\s\-\(\)]/g, "");
  return regex.test(numeros) && numeros.length >= 8;
}

function validarTarjeta(numero) {
  const num = numero.replace(/\s/g, "");
  if (!/^[0-9]{13,19}$/.test(num)) return false;

  let suma = 0;
  let alternar = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digito = parseInt(num.charAt(i));

    if (alternar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }

    suma += digito;
    alternar = !alternar;
  }

  return suma % 10 === 0;
}

function validarVencimiento(venc) {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(venc)) return false;

  const [mes, año] = venc.split("/");
  const mesNum = parseInt(mes);
  const añoNum = parseInt("20" + año);

  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const añoActual = hoy.getFullYear();

  if (añoNum < añoActual) return false;
  if (añoNum === añoActual && mesNum < mesActual) return false;
  if (añoNum > añoActual + 10) return false;

  return true;
}

function validarCVV(cvv) {
  return /^[0-9]{3,4}$/.test(cvv);
}

function mostrarError(input, mensaje) {
  const formGroup = input.parentElement;
  let errorDiv = formGroup.querySelector(".error-mensaje");

  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-mensaje";
    formGroup.appendChild(errorDiv);
  }

  errorDiv.textContent = mensaje;
  input.classList.add("input-error");
}

function limpiarError(input) {
  const formGroup = input.parentElement;
  const errorDiv = formGroup.querySelector(".error-mensaje");

  if (errorDiv) {
    errorDiv.remove();
  }

  input.classList.remove("input-error");
}

function limpiarErrores() {
  document.querySelectorAll(".error-mensaje").forEach((e) => e.remove());
  document.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
}

// Auto-formatear campos
const inputTarjeta = document.querySelector('input[name="tarjeta"]');
if (inputTarjeta) {
  inputTarjeta.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\s/g, "");
    let formateado = valor.match(/.{1,4}/g);
    e.target.value = formateado ? formateado.join(" ") : "";
  });
}

const inputVencimiento = document.querySelector('input[name="vencimiento"]');
if (inputVencimiento) {
  inputVencimiento.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
    }
    e.target.value = valor;
  });
}

const inputCVV = document.querySelector('input[name="cvv"]');
if (inputCVV) {
  inputCVV.addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, "");
  });
}

const inputPostal = document.querySelector('input[name="postal"]');
if (inputPostal) {
  inputPostal.addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, "");
  });
}

// Modal compra
const modalCompra = document.getElementById("modal-compra");
const modalCompraCerrar = document.getElementById("modal-compra-cerrar");
const carritoComprar = document.getElementById("carrito-comprar");
const formCompra = document.getElementById("form-compra");

if (carritoComprar && modalCompra) {
  carritoComprar.addEventListener("click", function () {
    if (carrito.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de comprar.");
      return;
    }
    modalCompra.classList.add("activo");
  });
}

if (modalCompraCerrar && modalCompra) {
  modalCompraCerrar.addEventListener("click", function () {
    modalCompra.classList.remove("activo");
    formCompra.reset();
    limpiarErrores();
  });
}

if (formCompra) {
  formCompra.addEventListener("submit", function (e) {
    e.preventDefault();
    limpiarErrores();

    let errores = false;

    const inputNombre = this.querySelector('input[name="nombre"]');
    if (!validarNombre(inputNombre.value)) {
      mostrarError(
        inputNombre,
        "Ingresa tu nombre completo (nombre y apellido)"
      );
      errores = true;
    }

    const inputDireccion = this.querySelector('input[name="direccion"]');
    if (!validarDireccion(inputDireccion.value)) {
      mostrarError(
        inputDireccion,
        "Ingresa una dirección válida (calle y número)"
      );
      errores = true;
    }

    const inputCP = this.querySelector('input[name="postal"]');
    if (!validarCodigoPostal(inputCP.value)) {
      mostrarError(inputCP, "Ingresa un código postal válido (5 dígitos)");
      errores = true;
    }

    const inputTel = this.querySelector('input[name="telefono"]');
    if (!validarTelefono(inputTel.value)) {
      mostrarError(inputTel, "Ingresa un teléfono válido (ej: 099123456)");
      errores = true;
    }

    const inputCard = this.querySelector('input[name="tarjeta"]');
    if (!validarTarjeta(inputCard.value)) {
      mostrarError(inputCard, "Número de tarjeta inválido");
      errores = true;
    }

    const inputVenc = this.querySelector('input[name="vencimiento"]');
    if (!validarVencimiento(inputVenc.value)) {
      mostrarError(inputVenc, "Fecha de vencimiento inválida (MM/AA)");
      errores = true;
    }

    const inputCvv = this.querySelector('input[name="cvv"]');
    if (!validarCVV(inputCvv.value)) {
      mostrarError(inputCvv, "CVV debe tener 3 o 4 dígitos");
      errores = true;
    }

    if (errores) {
      return;
    }

    // Calcular total y detalles
    const total = carrito.reduce((acc, item) => {
      const num =
        parseFloat(item.precio.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
      return acc + num * item.cantidad;
    }, 0);

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Crear modal de éxito personalizado
    mostrarMensajeExito(
      inputNombre.value,
      inputDireccion.value,
      inputCP.value,
      total,
      totalItems
    );

    modalCompra.classList.remove("activo");
    carrito = [];
    guardarCarrito();
    renderCarrito();
    formCompra.reset();
  });

  // Validación en tiempo real
  formCompra.querySelectorAll("input").forEach((input) => {
    input.addEventListener("blur", function () {
      limpiarError(this);

      if (this.name === "nombre" && this.value && !validarNombre(this.value)) {
        mostrarError(this, "Ingresa tu nombre completo");
      }
      if (
        this.name === "direccion" &&
        this.value &&
        !validarDireccion(this.value)
      ) {
        mostrarError(this, "Dirección incompleta");
      }
      if (
        this.name === "postal" &&
        this.value &&
        !validarCodigoPostal(this.value)
      ) {
        mostrarError(this, "Código postal inválido");
      }
      if (
        this.name === "telefono" &&
        this.value &&
        !validarTelefono(this.value)
      ) {
        mostrarError(this, "Teléfono inválido");
      }
      if (
        this.name === "tarjeta" &&
        this.value &&
        !validarTarjeta(this.value)
      ) {
        mostrarError(this, "Número de tarjeta inválido");
      }
      if (
        this.name === "vencimiento" &&
        this.value &&
        !validarVencimiento(this.value)
      ) {
        mostrarError(this, "Fecha inválida");
      }
      if (this.name === "cvv" && this.value && !validarCVV(this.value)) {
        mostrarError(this, "CVV inválido");
      }
    });
  });
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito(nombre, direccion, cp, total, items) {
  const modal = document.createElement("div");
  modal.className = "modal-exito";
  modal.innerHTML = `

            <div class="modal-exito__contenido">
                <div class="modal-exito__icono">✓</div>
                <h2 class="modal-exito__titulo">¡Compra Exitosa!</h2>
                <p class="modal-exito__mensaje">Gracias por tu compra, <strong>${nombre}</strong></p>
                
                <div class="modal-exito__detalles">
                    <div class="detalle-item">
                        <span class="detalle-label">📦 Productos:</span>
                        <span class="detalle-valor">${items} ${
    items === 1 ? "artículo" : "artículos"
  }</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">💰 Total:</span>
                        <span class="detalle-valor">$${total.toFixed(2)}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">📍 Envío a:</span>
                        <span class="detalle-valor">${direccion}, ${cp}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">🚚 Tiempo estimado:</span>
                        <span class="detalle-valor">3-5 días hábiles</span>
                    </div>
                </div>
                
                <p class="modal-exito__info">Recibirás un email de confirmación con los detalles de tu pedido.</p>
                
                <button class="modal-exito__btn" onclick="this.parentElement.parentElement.remove()">Continuar Comprando</button>
            </div>
        `;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.classList.add("mostrar");
  }, 10);
}

renderCarrito();

// Hacer que todos los productos sean clicables
if (productosGrid) {
  const productos = productosGrid.querySelectorAll(".producto");
  productos.forEach((producto) => {
    // Agregar badge "Ver Producto"
    const badge = document.createElement("span");
    badge.className = "producto__badge";
    badge.textContent = "Ver producto";
    producto.style.position = "relative";
    producto.insertBefore(badge, producto.firstChild);

    // Hacer clic en todo el producto (no solo en el enlace)
    producto.addEventListener("click", function (e) {
      if (!e.target.closest("a")) {
        const link = this.querySelector("a");
        if (link) {
          window.location.href = link.href;
        }
      }
    });
  });
}
