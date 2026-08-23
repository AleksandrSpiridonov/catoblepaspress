export function yandexMetrikaScript(counterId: number): string {
  if (!Number.isSafeInteger(counterId) || counterId <= 0) {
    throw new Error("Yandex Metrika counter ID must be a positive integer")
  }

  return `
    const catoblepasConsentKey = 'catoblepas_cookie_consent';
    const catoblepasAgeConfirmationKey = 'catoblepas_age_confirmed';

    function loadCatoblepasMetrika() {
      if (window.__catoblepasMetrikaLoaded) return;
      window.__catoblepasMetrikaLoaded = true;

      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${counterId}','ym');

      ym(${counterId}, 'init', {
        ssr: true,
        webvisor: false,
        clickmap: false,
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true
      });
    }

    function hasCatoblepasAnalyticsConsent() {
      try {
        return localStorage.getItem(catoblepasConsentKey) === 'granted';
      } catch {
        return false;
      }
    }

    function grantCatoblepasAnalyticsConsent() {
      try {
        localStorage.setItem(catoblepasConsentKey, 'granted');
      } catch {
        // If storage is unavailable, consent applies only to this page view.
      }
    }

    function revokeCatoblepasAnalyticsConsent() {
      try {
        localStorage.removeItem(catoblepasConsentKey);
      } catch {
        // The current page will still reload and stop the active counter.
      }

      const cookieDomain = '.' + location.hostname.replace(/^www\./, '');
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0]?.trim();
        if (!name?.startsWith('_ym_')) return;
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + cookieDomain + '; SameSite=Lax';
      });
    }

    function closeCatoblepasCookieBanner() {
      document.getElementById('cookie-consent')?.remove();
    }

    function hasCatoblepasAgeConfirmation() {
      try {
        return localStorage.getItem(catoblepasAgeConfirmationKey) === 'confirmed';
      } catch {
        return false;
      }
    }

    function confirmCatoblepasAge() {
      try {
        localStorage.setItem(catoblepasAgeConfirmationKey, 'confirmed');
      } catch {
        // If storage is unavailable, confirmation applies only to this page view.
      }
    }

    function closeCatoblepasAgeGate() {
      document.getElementById('age-gate')?.remove();
      document.documentElement.classList.remove('age-gate-open');
    }

    function continueAfterCatoblepasAgeConfirmation() {
      if (hasCatoblepasAnalyticsConsent()) {
        loadCatoblepasMetrika();
      } else {
        showCatoblepasCookieBanner();
      }
    }

    function showCatoblepasAgeGate() {
      if (document.getElementById('age-gate')) return;

      const gate = document.createElement('section');
      gate.id = 'age-gate';
      gate.className = 'age-gate';
      gate.setAttribute('role', 'dialog');
      gate.setAttribute('aria-modal', 'true');
      gate.setAttribute('aria-labelledby', 'age-gate-title');
      gate.setAttribute('aria-describedby', 'age-gate-description');
      gate.innerHTML = \`
        <div class="age-gate__dialog">
          <p class="age-gate__mark" aria-hidden="true">18+</p>
          <h2 id="age-gate-title">Подтвердите свой возраст</h2>
          <p id="age-gate-description">Материалы сайта предназначены для посетителей старше 18 лет.</p>
          <button type="button" data-age-confirm>Мне уже исполнилось 18 лет</button>
        </div>
      \`;

      gate.querySelector('[data-age-confirm]')?.addEventListener('click', () => {
        confirmCatoblepasAge();
        closeCatoblepasAgeGate();
        continueAfterCatoblepasAgeConfirmation();
      });

      document.documentElement.classList.add('age-gate-open');
      document.body.appendChild(gate);
      gate.querySelector('[data-age-confirm]')?.focus();
    }

    function showCatoblepasCookieBanner() {
      closeCatoblepasCookieBanner();
      const consentGranted = hasCatoblepasAnalyticsConsent();

      const banner = document.createElement('section');
      banner.id = 'cookie-consent';
      banner.className = 'cookie-consent';
      banner.setAttribute('aria-label', 'Согласие на аналитические файлы cookie');
      banner.innerHTML = \`
        <button type="button" class="cookie-consent__close" data-cookie-consent-close aria-label="Закрыть">×</button>
        <div class="cookie-consent__text">
          <strong>Аналитические cookie</strong>
          <p>
            \${consentGranted
              ? 'Аналитика Яндекс Метрики разрешена. Вы можете отозвать согласие и удалить аналитические cookie сайта.'
              : 'Разрешите cookie Яндекс Метрики, чтобы мы могли понимать, достигает ли сайт целей издательства: какие материалы читают и какие страницы помогают перейти к заказу, подписке или встрече. Без вашего согласия аналитика не загружается.'}
          </p>
          <a href="/documents/cookies">Подробнее</a>
        </div>
        <div class="cookie-consent__actions">
          \${consentGranted
            ? '<button type="button" data-cookie-consent-revoke>Отключить аналитику</button>'
            : '<button type="button" class="cookie-consent__accept" data-cookie-consent-grant>Разрешить аналитику</button>'}
        </div>
      \`;

      banner.querySelector('[data-cookie-consent-grant]')?.addEventListener('click', () => {
        grantCatoblepasAnalyticsConsent();
        closeCatoblepasCookieBanner();
        loadCatoblepasMetrika();
      });

      banner.querySelector('[data-cookie-consent-revoke]')?.addEventListener('click', () => {
        revokeCatoblepasAnalyticsConsent();
        location.reload();
      });

      banner.querySelector('[data-cookie-consent-close]')?.addEventListener('click', () => {
        closeCatoblepasCookieBanner();
      });

      document.body.appendChild(banner);
      banner.querySelector('[data-cookie-consent-grant], [data-cookie-consent-revoke]')?.focus();
    }

    if (hasCatoblepasAgeConfirmation()) {
      continueAfterCatoblepasAgeConfirmation();
    } else {
      showCatoblepasAgeGate();
    }

    document.addEventListener('catoblepas:cookie-settings', showCatoblepasCookieBanner);
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('#cookie-settings') : null;
      if (target) document.dispatchEvent(new CustomEvent('catoblepas:cookie-settings'));
    });

    let yandexMetrikaPreviousUrl = location.href;
    document.addEventListener('nav', () => {
      if (!window.__catoblepasMetrikaLoaded) return;
      ym(${counterId}, 'hit', location.href, {
        title: document.title,
        referrer: yandexMetrikaPreviousUrl
      });
      yandexMetrikaPreviousUrl = location.href;
    });

    document.addEventListener('click', (event) => {
      if (!window.__catoblepasMetrikaLoaded) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor) return;

      const goal = anchor.dataset.metrikaGoal;
      if (goal) ym(${counterId}, 'reachGoal', goal);
    });
  `
}
