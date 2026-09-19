// ==========================================================================
// BANNER DE CONSENTIMIENTO DE COOKIES
// ==========================================================================
// Este sitio, en su configuración actual, NO instala cookies de analítica
// ni de terceros (ver cookies.html). Este banner queda preparado para el
// día en que se añada Google Analytics u otro servicio similar: antes de
// cargar ese script, comprobar `CookieConsent.hasConsent('analytics')` y
// solo entonces inyectarlo (ver el ejemplo comentado al final del archivo).
//
// Preferencia guardada en localStorage bajo CONSENT_KEY como:
// { necessary: true, analytics: bool, consentedAt: ISOString, version: 1 }
// ==========================================================================

(function () {
  const CONSENT_KEY = "sara_cookie_consent";
  const CONSENT_VERSION = 1;

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function writeConsent(analytics) {
    const consent = {
      necessary: true,
      analytics: !!analytics,
      consentedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (err) {
      // localStorage no disponible (modo privado, etc.): la elección no
      // persistirá entre visitas, pero la web sigue funcionando igual.
    }
    return consent;
  }

  function hasConsent(category) {
    const consent = readConsent();
    if (!consent) return false;
    if (category === "necessary") return true;
    return !!consent[category];
  }

  let bannerEl = null;

  function buildBanner({ expanded } = { expanded: false }) {
    const wrapper = document.createElement("div");
    wrapper.id = "cookie-banner";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-label", "Preferencias de cookies");
    wrapper.setAttribute("aria-live", "polite");
    wrapper.className =
      "fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-white shadow-warm";

    wrapper.innerHTML = expanded ? expandedPanelHTML() : compactBarHTML();
    return wrapper;
  }

  function compactBarHTML() {
    return `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p class="text-sm text-ink-soft leading-relaxed flex-1">
          Usamos únicamente cookies técnicas necesarias para que la web
          funcione correctamente. Con tu consentimiento, en el futuro
          podríamos usar cookies analíticas para mejorar el sitio. Puedes
          leer más en la
          <a href="cookies.html" class="underline hover:text-sage-dark">Política de Cookies</a>.
        </p>
        <div class="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            data-action="reject"
            class="text-sm font-medium text-ink border border-border rounded-full px-5 py-2.5 hover:bg-sand transition-colors"
          >
            Rechazar
          </button>
          <button
            type="button"
            data-action="customize"
            class="text-sm font-medium text-sage-dark border border-sage-dark rounded-full px-5 py-2.5 hover:bg-sage-50 transition-colors"
          >
            Personalizar
          </button>
          <button
            type="button"
            data-action="accept-all"
            class="text-sm font-medium text-white bg-sage-dark rounded-full px-5 py-2.5 hover:bg-sage transition-colors"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    `;
  }

  function expandedPanelHTML() {
    const current = readConsent();
    const analyticsChecked = current ? current.analytics : false;
    return `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <p class="text-sm font-medium text-ink mb-1">Preferencias de cookies</p>
        <p class="text-sm text-ink-soft leading-relaxed mb-5 max-w-2xl">
          Elige qué tipos de cookies aceptas. Puedes cambiar esta elección
          cuando quieras desde el enlace "Configurar cookies" del pie de página.
        </p>

        <div class="space-y-4 mb-6">
          <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-cream/50 p-4">
            <div>
              <p class="text-sm font-medium text-ink">Necesarias</p>
              <p class="text-xs text-ink-soft mt-1">
                Imprescindibles para que la web funcione. Siempre activas.
              </p>
            </div>
            <input type="checkbox" checked disabled aria-label="Cookies necesarias, siempre activas" class="mt-1 w-4 h-4 rounded border-border text-sage-dark opacity-60" />
          </div>

          <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-cream/50 p-4">
            <div>
              <p class="text-sm font-medium text-ink">Analíticas</p>
              <p class="text-xs text-ink-soft mt-1">
                Actualmente no están en uso. Si en el futuro se activan
                (p. ej. estadísticas de visitas), solo se cargarán si las
                aceptas aquí.
              </p>
            </div>
            <input
              type="checkbox"
              id="cookie-analytics-toggle"
              ${analyticsChecked ? "checked" : ""}
              aria-label="Cookies analíticas"
              class="mt-1 w-4 h-4 rounded border-border text-sage-dark focus:ring-sage-dark"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            data-action="save-preferences"
            class="text-sm font-medium text-white bg-sage-dark rounded-full px-5 py-2.5 hover:bg-sage transition-colors"
          >
            Guardar preferencias
          </button>
          <button
            type="button"
            data-action="reject"
            class="text-sm font-medium text-ink border border-border rounded-full px-5 py-2.5 hover:bg-sand transition-colors"
          >
            Rechazar todas
          </button>
        </div>
      </div>
    `;
  }

  function removeBanner() {
    if (bannerEl && bannerEl.parentNode) {
      bannerEl.parentNode.removeChild(bannerEl);
    }
    bannerEl = null;
  }

  function showBanner(expanded) {
    removeBanner();
    bannerEl = buildBanner({ expanded });
    document.body.appendChild(bannerEl);
    wireBanner();
  }

  function wireBanner() {
    if (!bannerEl) return;
    bannerEl.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]");
      if (!action) return;

      switch (action.dataset.action) {
        case "accept-all":
          writeConsent(true);
          removeBanner();
          break;
        case "reject":
          writeConsent(false);
          removeBanner();
          break;
        case "customize":
          showBanner(true);
          break;
        case "save-preferences": {
          const toggle = bannerEl.querySelector("#cookie-analytics-toggle");
          writeConsent(toggle ? toggle.checked : false);
          removeBanner();
          break;
        }
      }
    });
  }

  function openPreferences() {
    showBanner(true);
  }

  function init() {
    const consent = readConsent();
    if (!consent) {
      // Pequeño retraso para no competir con la primera pintura de la página.
      window.setTimeout(() => showBanner(false), 400);
    }

    // Cualquier enlace/botón con data-open-cookie-prefs reabre el panel
    // (usado por el enlace "Configurar cookies" del footer).
    document.querySelectorAll("[data-open-cookie-prefs]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openPreferences();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // API pública para el resto del sitio (o para un futuro script de
  // analítica) y para depuración manual desde la consola.
  window.CookieConsent = { hasConsent, openPreferences };

  // ------------------------------------------------------------------
  // EJEMPLO para cuando se añada Google Analytics en el futuro:
  //
  // if (window.CookieConsent.hasConsent("analytics")) {
  //   const s = document.createElement("script");
  //   s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
  //   s.async = true;
  //   document.head.appendChild(s);
  // }
  // ------------------------------------------------------------------
})();
