function f(){document.querySelectorAll(".artist-gallery").forEach(e=>{if(e.dataset.ready)return;let o=Array.from(e.querySelectorAll(".artist-gallery-slide")),s=Array.from(e.querySelectorAll("[data-art-index]")),h=e.querySelector("[data-art-status]"),r=0,a=t=>{r=(t+o.length)%o.length,o.forEach((u,l)=>{u.hidden=l!==r}),s.forEach((u,l)=>u.setAttribute("aria-pressed",String(l===r))),h.textContent=`${r+1} / ${o.length}`;let n=e.querySelector(".artist-gallery-thumbs"),c=s[r];n.scrollTo({left:c.offsetLeft-n.offsetLeft-(n.clientWidth-c.clientWidth)/2,behavior:"instant"})};e.querySelector("[data-art-prev]").addEventListener("click",()=>a(r-1)),e.querySelector("[data-art-next]").addEventListener("click",()=>a(r+1)),s.forEach((t,n)=>t.addEventListener("click",()=>a(n)));let d=e.querySelector(".artist-gallery-stage"),i;d.addEventListener("pointerdown",t=>{if(!t.isPrimary){i=void 0;return}t.pointerType!=="touch"&&t.pointerType!=="pen"||(i={id:t.pointerId,x:t.clientX,y:t.clientY},d.setPointerCapture(t.pointerId))}),d.addEventListener("pointerup",t=>{if(!i||t.pointerId!==i.id)return;let n=t.clientX-i.x,c=t.clientY-i.y;i=void 0,Math.abs(n)>=40&&Math.abs(n)>Math.abs(c)*1.5&&a(r+(n<0?1:-1))});for(let t of["pointercancel","lostpointercapture"])d.addEventListener(t,()=>{i=void 0});e.addEventListener("keydown",t=>{t.key!=="ArrowLeft"&&t.key!=="ArrowRight"||(t.preventDefault(),a(r+(t.key==="ArrowRight"?1:-1)),t.target.matches("[data-art-index]")&&s[r].focus({preventScroll:!0}))}),e.dataset.ready="true",a(0)})}f();document.addEventListener("nav",f);

    const openIssueZoom = (link, english) => {
      const reader = link.closest('.issue-reader')
      const pages = Array.from(reader.querySelectorAll('.issue-page'))
      let index = pages.indexOf(link.closest('.issue-page'))
      const video = document.createElement('video')
      video.controls = true; video.playsInline = true; video.preload = 'none'
      const dialog = document.createElement('dialog')
      dialog.className = 'issue-zoom'
      dialog.setAttribute('aria-label', english ? 'Image viewer' : 'Просмотр изображения')
      const bar = document.createElement('div')
      bar.className = 'issue-zoom-bar'
      const stage = document.createElement('div')
      stage.className = 'issue-zoom-stage'
      const img = document.createElement('img')
      if(link.querySelector('img')) {
        img.src = link.href
        img.alt = link.querySelector('img').alt
      }
      img.draggable = false
      stage.append(img, video)
      let scale = 1, x = 0, y = 0
      const points = new Map()
      const percent = document.createElement('span')
      percent.setAttribute('aria-live', 'polite')
      const draw = () => {
        const maxX = Math.max(0, (img.clientWidth * scale - stage.clientWidth) / 2)
        const maxY = Math.max(0, (img.clientHeight * scale - stage.clientHeight) / 2)
        x = Math.max(-maxX, Math.min(maxX, x))
        y = Math.max(-maxY, Math.min(maxY, y))
        img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')'
        percent.textContent = Math.round(scale * 100) + '%'
      }
      const zoom = factor => { if(img.hidden)return; scale = Math.max(1, Math.min(5, scale * factor)); draw() }
      const button = (text, label, action) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = text
        b.setAttribute('aria-label', label); b.addEventListener('click', action); bar.append(b)
        return b
      }
      const previous = button('←', english ? 'Previous page' : 'Предыдущая страница', () => showPage(index-1))
      const counter = document.createElement('span'); counter.setAttribute('aria-live','polite'); bar.append(counter)
      const next = button('→', english ? 'Next page' : 'Следующая страница', () => showPage(index+1))
      const less = button('−', english ? 'Zoom out' : 'Уменьшить', () => zoom(1/1.25))
      bar.append(percent)
      const more = button('+', english ? 'Zoom in' : 'Увеличить', () => zoom(1.25))
      const reset = button('↺', english ? 'Fit image' : 'Сбросить масштаб', () => {scale=1;x=0;y=0;draw()})
      button('×', english ? 'Close' : 'Закрыть', () => dialog.close())
      const showPage = target => {
        if(target<0||target>=pages.length)return
        index=target;video.pause();video.removeAttribute('src');video.load();points.clear();x=0;y=0
        const source=pages[index].querySelector('video')
        img.hidden=!!source;video.hidden=!source
        stage.style.touchAction=source?'auto':'none'
        if(source){video.src=source.querySelector('source')?.src||source.currentSrc;video.poster=source.poster;video.setAttribute('aria-label',source.getAttribute('aria-label')||'Video')}
        else {const image=pages[index].querySelector('img');img.src=pages[index].querySelector('a').href;img.alt=image.alt}
        for(const control of [less,more,reset,percent])control.hidden=!!source
        previous.disabled=index===0;next.disabled=index===pages.length-1;counter.textContent=(index+1)+' / '+pages.length
        draw()
      }
      dialog.append(bar, stage)
      document.body.append(dialog)
      const oldOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      dialog.addEventListener('close', () => {
        video.pause();video.removeAttribute('src');video.load()
        document.body.style.overflow = oldOverflow; dialog.remove()
        const track=reader.querySelector('.issue-pages')
        track.scrollBy({left:pages[index].getBoundingClientRect().left-track.getBoundingClientRect().left,behavior:'instant'})
        const focus=pages[index].querySelector('a,video');focus?.focus({preventScroll:true})
      }, {once:true})
      dialog.addEventListener('keydown', e => {
        if(e.target===video)return
        if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showPage(index+(e.key==='ArrowRight'?1:-1))}
        if(e.key==='+'||e.key==='=') {e.preventDefault();zoom(1.25)}
        if(e.key==='-') {e.preventDefault();zoom(1/1.25)}
      })
      stage.addEventListener('wheel', e => {e.preventDefault();zoom(e.deltaY < 0 ? 1.1 : 1/1.1)}, {passive:false})
      stage.addEventListener('pointerdown', e => {if(e.button!==0||img.hidden)return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.setPointerCapture(e.pointerId)})
      stage.addEventListener('pointermove', e => {
        if(!points.has(e.pointerId))return
        const old = points.get(e.pointerId)
        const other = [...points.entries()].find(([id])=>id!==e.pointerId)?.[1]
        if(other) {
          const before = Math.hypot(old.x-other.x,old.y-other.y)
          const after = Math.hypot(e.clientX-other.x,e.clientY-other.y)
          if(before>0)scale=Math.max(1,Math.min(5,scale*after/before))
        } else {x+=e.clientX-old.x;y+=e.clientY-old.y}
        points.set(e.pointerId,{x:e.clientX,y:e.clientY});draw()
      })
      for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,e=>points.delete(e.pointerId))
      img.addEventListener('load',draw)
      dialog.showModal();showPage(index)
    }
    const initIssueReaders = () => {
      document.querySelectorAll('.issue-reader').forEach(reader => {
        if (reader.dataset.ready) return
        reader.dataset.ready = 'true'
        reader.querySelectorAll('.issue-page video').forEach(video => {
          const open = document.createElement('button')
          open.type = 'button'
          open.className = 'issue-open-viewer'
          open.textContent = reader.lang === 'en' ? 'Open viewer' : 'Открыть просмотр'
          video.after(open)
          open.addEventListener('click', () => {
            reader.querySelectorAll('video').forEach(item=>item.pause())
            openIssueZoom(open, reader.lang === 'en')
          })
        })
        reader.querySelectorAll('.issue-page a').forEach(link => {
          link.addEventListener('click', event => {
            if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return
            event.preventDefault();event.stopPropagation()
            reader.querySelectorAll('video').forEach(video=>video.pause())
            openIssueZoom(link, reader.lang === 'en')
          })
        })
        const track = reader.querySelector('.issue-pages')
        const pages = Array.from(track.querySelectorAll('.issue-page'))
        const prev = reader.querySelector('[data-issue-prev]')
        const next = reader.querySelector('[data-issue-next]')
        const status = reader.querySelector('[data-issue-status]')
        let current = 0
        const update = () => {
          const left = track.getBoundingClientRect().left
          current = pages.reduce((best, page, i) => Math.abs(page.getBoundingClientRect().left-left) < Math.abs(pages[best].getBoundingClientRect().left-left) ? i : best, 0)
          status.textContent = (current + 1) + ' / ' + pages.length
          prev.disabled = current === 0
          next.disabled = current === pages.length - 1
          pages.forEach((page, i) => { if (i !== current) page.querySelector('video')?.pause() })
        }
        const go = delta => {
          const target = pages[Math.max(0, Math.min(pages.length - 1, current + delta))]
          track.scrollBy({left: target.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: 'instant'})
          update()
        }
        prev.addEventListener('click', () => go(-1))
        next.addEventListener('click', () => go(1))
        track.addEventListener('scroll', update, {passive: true})
        track.addEventListener('keydown', event => {
          if (event.target !== track) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(event.key === 'ArrowRight' ? 1 : -1) }
        })
        update()
      })
    }
    initIssueReaders()
    document.addEventListener('nav', initIssueReaders)
    const localizeBasesEntryCounts = () => {
      const entryWord = (count) => {
        const lastTwo = count % 100
        const last = count % 10

        if (lastTwo >= 11 && lastTwo <= 14) return "записей"
        if (last === 1) return "запись"
        if (last >= 2 && last <= 4) return "записи"
        return "записей"
      }

      for (const element of document.querySelectorAll(".bases-view-meta")) {
        const match = element.textContent?.trim().match(/^Showing (\d+) of (\d+) entries$/)
        if (!match) continue

        const shown = Number(match[1])
        const total = Number(match[2])
        element.textContent = "Показано " + shown + " из " + total + " " + entryWord(total)
      }
    }

    localizeBasesEntryCounts()
    document.addEventListener("nav", localizeBasesEntryCounts)
  