function initArtistGalleries() {
  document.querySelectorAll<HTMLElement>(".artist-gallery").forEach((gallery) => {
    if (gallery.dataset.ready) return
    const slides = Array.from(gallery.querySelectorAll<HTMLElement>(".artist-gallery-slide"))
    const thumbs = Array.from(gallery.querySelectorAll<HTMLButtonElement>("[data-art-index]"))
    const status = gallery.querySelector<HTMLElement>("[data-art-status]")!
    let current = 0
    const show = (index: number) => {
      current = (index + slides.length) % slides.length
      slides.forEach((slide, i) => { slide.hidden = i !== current })
      thumbs.forEach((thumb, i) => thumb.setAttribute("aria-pressed", String(i === current)))
      status.textContent = `${current + 1} / ${slides.length}`
      const strip = gallery.querySelector<HTMLElement>(".artist-gallery-thumbs")!
      const thumb = thumbs[current]
      strip.scrollTo({ left: thumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2, behavior: "instant" })
    }
    gallery.querySelector("[data-art-prev]")!.addEventListener("click", () => show(current - 1))
    gallery.querySelector("[data-art-next]")!.addEventListener("click", () => show(current + 1))
    thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => show(i)))
    gallery.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      show(current + (event.key === "ArrowRight" ? 1 : -1))
      if ((event.target as HTMLElement).matches("[data-art-index]")) thumbs[current].focus({ preventScroll: true })
    })
    gallery.dataset.ready = "true"
    show(0)
  })
}
initArtistGalleries()
document.addEventListener("nav", initArtistGalleries)
