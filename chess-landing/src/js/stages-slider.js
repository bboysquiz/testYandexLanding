export function setupStagesSlider() {
  const stagesSection = document.querySelector('.stages')
  const stagesTrack = document.querySelector('.stages__list')
  const stagesSlides = Array.from(document.querySelectorAll('.stages__slide'))
  const stagesPrev = document.querySelector('.stages__button--prev')
  const stagesNext = document.querySelector('.stages__button--next')
  const stagesPagination = document.querySelector('.stages__pagination')

  if (!stagesSection || !stagesTrack || stagesSlides.length === 0) return

  const mobileMedia = window.matchMedia('(max-width: 767px)')
  let currentIndex = 0

  function isMobile() {
    return mobileMedia.matches
  }

  function renderPagination() {
    if (!stagesPagination) return

    stagesPagination.innerHTML = ''

    stagesSlides.forEach((_, index) => {
      const dot = document.createElement('span')
      dot.className = 'stages__pagination-dot'

      if (index === currentIndex) {
        dot.classList.add('stages__pagination-dot--active')
      }

      stagesPagination.append(dot)
    })
  }

  function updateSlider() {
    if (!isMobile()) {
      stagesTrack.style.transform = ''
      stagesPrev?.removeAttribute('disabled')
      stagesNext?.removeAttribute('disabled')
      return
    }

    const styles = getComputedStyle(stagesTrack)
    const gap = parseFloat(styles.columnGap) || 0
    const slideWidth = stagesSlides[0].getBoundingClientRect().width
    const step = slideWidth + gap

    stagesTrack.style.transform = `translateX(-${currentIndex * step}px)`

    stagesPrev?.toggleAttribute('disabled', currentIndex === 0)
    stagesNext?.toggleAttribute('disabled', currentIndex === stagesSlides.length - 1)

    renderPagination()
  }

  stagesPrev?.addEventListener('click', () => {
    if (currentIndex === 0) return

    currentIndex -= 1
    updateSlider()
  })

  stagesNext?.addEventListener('click', () => {
    if (currentIndex === stagesSlides.length - 1) return

    currentIndex += 1
    updateSlider()
  })

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      currentIndex = 0
    }

    updateSlider()
  })

  updateSlider()
}
