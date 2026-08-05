export function yandexMetrikaScript(counterId: number): string {
  if (!Number.isSafeInteger(counterId) || counterId <= 0) {
    throw new Error("Yandex Metrika counter ID must be a positive integer")
  }

  return `
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${counterId}','ym');

    ym(${counterId}, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });

    let yandexMetrikaPreviousUrl = location.href;
    document.addEventListener('nav', () => {
      ym(${counterId}, 'hit', location.href, {
        title: document.title,
        referrer: yandexMetrikaPreviousUrl
      });
      yandexMetrikaPreviousUrl = location.href;
    });

    document.addEventListener('click', (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor) return;

      const goal = anchor.dataset.metrikaGoal;
      if (goal) ym(${counterId}, 'reachGoal', goal);
    });
  `
}
