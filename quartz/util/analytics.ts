export function yandexMetrikaScript(counterId: number): string {
  if (!Number.isSafeInteger(counterId) || counterId <= 0) {
    throw new Error("Yandex Metrika counter ID must be a positive integer")
  }

  return `
    const catoblepasConsentKey = 'catoblepas_cookie_consent';

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

    function getCatoblepasConsent() {
      try {
        return localStorage.getItem(catoblepasConsentKey);
      } catch {
        return null;
      }
    }

    function setCatoblepasConsent(value) {
      try {
        localStorage.setItem(catoblepasConsentKey, value);
      } catch {
        // If storage is unavailable, the choice applies only to this page view.
      }
    }

    function clearCatoblepasMetrikaCookies() {
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

    function showCatoblepasCookieBanner() {
      closeCatoblepasCookieBanner();

      const banner = document.createElement('section');
      banner.id = 'cookie-consent';
      banner.className = 'cookie-consent';
      banner.setAttribute('aria-label', 'Настройки аналитических файлов cookie');
      banner.innerHTML = \`
        <div class="cookie-consent__text">
          <strong>Аналитические cookie</strong>
          <p>Мы используем cookie Яндекс Метрики, чтобы понимать, какие материалы читают. Аналитика включится только с вашего согласия.</p>
          <a href="/documents/cookies">Подробнее</a>
        </div>
        <div class="cookie-consent__actions">
          <button type="button" data-cookie-choice="denied">Отклонить</button>
          <button type="button" class="cookie-consent__accept" data-cookie-choice="granted">Принять</button>
        </div>
      \`;

      banner.querySelector('[data-cookie-choice="granted"]')?.addEventListener('click', () => {
        setCatoblepasConsent('granted');
        closeCatoblepasCookieBanner();
        loadCatoblepasMetrika();
      });

      banner.querySelector('[data-cookie-choice="denied"]')?.addEventListener('click', () => {
        const metrikaWasLoaded = window.__catoblepasMetrikaLoaded === true;
        setCatoblepasConsent('denied');
        clearCatoblepasMetrikaCookies();
        closeCatoblepasCookieBanner();
        if (metrikaWasLoaded) location.reload();
      });

      document.body.appendChild(banner);
      banner.querySelector('button')?.focus();
    }

    if (getCatoblepasConsent() === 'granted') {
      loadCatoblepasMetrika();
    } else if (getCatoblepasConsent() !== 'denied') {
      showCatoblepasCookieBanner();
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
