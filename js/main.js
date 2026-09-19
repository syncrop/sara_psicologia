// ==========================================================================
// LÓGICA DEL SITIO: menú móvil, año dinámico, animaciones al scroll
// y envío del formulario de contacto vía Web3Forms (sin backend propio).
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initFooterYear();
  initScrollReveal();
  initContactForm();
});

/* ---------- Menú móvil accesible ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.dataset.open = "false";
    toggle.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    menu.dataset.open = "true";
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.dataset.open === "true";
    isOpen ? closeMenu() : openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Año actual en el footer ---------- */
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Aparición progresiva al hacer scroll ---------- */
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;

  const elements = document.querySelectorAll("[data-reveal]");
  elements.forEach((el) => el.classList.add("reveal-pending"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---------- Formulario de contacto (Web3Forms) ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']");
  const statusEl = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot anti-spam: si el campo oculto tiene contenido, es un bot.
    if (form.botcheck && form.botcheck.checked) return;

    const accessKey = form.querySelector("input[name='access_key']").value;
    if (!accessKey || accessKey.includes("REEMPLAZAR")) {
      setStatus(
        "Falta configurar la clave de Web3Forms (access_key) en el formulario.",
        "error"
      );
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    setStatus("", null);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const result = await response.json();

      if (result.success) {
        setStatus(
          "Gracias por tu mensaje. Te responderé lo antes posible.",
          "success"
        );
        form.reset();
      } else {
        setStatus(
          "No se ha podido enviar el mensaje. Inténtalo de nuevo o escribe por WhatsApp.",
          "error"
        );
      }
    } catch (err) {
      setStatus(
        "Error de conexión. Comprueba tu red e inténtalo de nuevo.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("text-sage-dark", "text-red-700");
    if (type === "success") statusEl.classList.add("text-sage-dark");
    if (type === "error") statusEl.classList.add("text-red-700");
  }
}
