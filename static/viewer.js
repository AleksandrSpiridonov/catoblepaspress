(() => {
  const root = document.getElementById("viewer-root") || document.body;
  const host = document.getElementById("viewer-root") ? document.getElementById("viewer-root") : (() => {
    const wrap = document.createElement("div");
    wrap.id = "viewer-root";
    document.body.appendChild(wrap);
    return wrap;
  })();

  const css = `
    #viewer-root .viewer-wrap{width:100%;max-width:420px;margin:1rem auto}
    #viewer-root .viewer-box{position:relative;width:100%;aspect-ratio:9/16;min-height:560px;background:#000;border-radius:16px;overflow:hidden}
    #viewer-root .viewer-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;vertical-align:top}
    #viewer-root .viewer-box:fullscreen .viewer-media{object-fit:contain;background:#000}
    #viewer-root .viewer-box:-webkit-full-screen .viewer-media{object-fit:contain;background:#000}
    #viewer-root .viewer-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;border-radius:999px;background:rgba(0,0,0,.45);color:#fff;cursor:pointer;z-index:5}
    #viewer-root .viewer-prev{left:8px}
    #viewer-root .viewer-next{right:8px}
    #viewer-root .viewer-fs{top:8px;right:8px;transform:none;z-index:6}
    #viewer-root .viewer-meta{display:flex;justify-content:space-between;margin:.5rem 0;font-size:.9rem;opacity:.85}
    @media (hover:none){#viewer-root .viewer-nav{display:none}}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  host.appendChild(style);

  host.insertAdjacentHTML("beforeend", `
    <div class="viewer-wrap">
      <div class="viewer-meta">
        <strong id="v-title">Загрузка…</strong>
        <span id="v-count">0 / 0</span>
      </div>
      <div id="v-box" class="viewer-box">
        <button id="v-fs" class="viewer-nav viewer-fs" aria-label="На весь экран">⛶</button>
        <button id="v-prev" class="viewer-nav viewer-prev" aria-label="Назад">‹</button>
        <button id="v-next" class="viewer-nav viewer-next" aria-label="Вперёд">›</button>
      </div>
    </div>
  `);

  const box = host.querySelector("#v-box");
  const titleEl = host.querySelector("#v-title");
  const countEl = host.querySelector("#v-count");
  const prevBtn = host.querySelector("#v-prev");
  const nextBtn = host.querySelector("#v-next");
  const fsBtn = host.querySelector("#v-fs");

  const qs = new URLSearchParams(location.search);
  const issue = qs.get("issue") || host.dataset.issue || window.VIEWER_CONFIG?.defaultIssue || "001";
  const manifestUrl = qs.get("manifest") || (window.VIEWER_CONFIG?.manifestByIssue
    ? window.VIEWER_CONFIG.manifestByIssue(issue)
    : `https://s3.twcstorage.ru/catoblepaspress/issues/${issue}/manifest.json`);

  let manifest = null;
  let index = 0;
  let touchX = null;

  function stopCurrentVideo() {
    const v = box.querySelector("video");
    if (v) v.pause();
  }

  function render() {
    stopCurrentVideo();
    box.querySelector(".viewer-media")?.remove();

    const page = manifest.pages[index];
    if (!page) return;

    let el;
    if (page.type === "video") {
      el = document.createElement("video");
      el.src = page.src;
      el.controls = true;
      el.playsInline = true;
      el.preload = "metadata";
      if (page.poster) el.poster = page.poster;
    } else {
      el = document.createElement("img");
      el.src = page.src;
      el.alt = page.alt || `Страница ${index + 1}`;
      el.loading = "eager";
      el.decoding = "async";
    }

    el.className = "viewer-media";
    box.appendChild(el);
    titleEl.textContent = manifest.title || `Выпуск ${issue}`;
    countEl.textContent = `${index + 1} / ${manifest.pages.length}`;
  }

  function go(nextIndex) {
    if (!manifest) return;
    index = Math.max(0, Math.min(manifest.pages.length - 1, nextIndex));
    render();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await box.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch (e) {
      console.error("fullscreen error", e);
    }
  }

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));
  fsBtn?.addEventListener("click", toggleFullscreen);

  box.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    const r = box.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < r.width * 0.35) go(index - 1);
    else if (x > r.width * 0.65) go(index + 1);
  });

  box.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 35) dx < 0 ? go(index + 1) : go(index - 1);
    touchX = null;
  }, { passive: true });

  fetch(manifestUrl)
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((data) => {
      if (!Array.isArray(data.pages) || data.pages.length === 0) throw new Error("Пустой manifest");
      manifest = data;
      render();
    })
    .catch((err) => {
      titleEl.textContent = "Ошибка";
      countEl.textContent = "—";
      box.insertAdjacentHTML("beforeend", `<div style="padding:12px;color:#fff">Не удалось загрузить выпуск: ${err.message}</div>`);
    });
})();