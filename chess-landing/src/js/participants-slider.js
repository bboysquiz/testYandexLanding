export function setupParticipantsSlider() {
  const participantsSlider = document.querySelector('.participants')
  const participantsTrack = document.querySelector('.participants__list')
  const participantsPrev = document.querySelector('.participants__button--prev')
  const participantsNext = document.querySelector('.participants__button--next')
  const participantsCurrent = document.querySelector('.participants__counter-current')
  const participantsTotal = document.querySelector('.participants__counter-total')

  let isAnimating = false

  if (!participantsSlider || !participantsTrack) return

  const originalItems = Array.from(
    participantsTrack.querySelectorAll('.participants__item:not([data-clone])')
  )

  if (originalItems.length === 0) return

  function getVisibleCount() {
    if (window.matchMedia('(max-width: 767px)').matches) return 1
    if (window.matchMedia('(max-width: 1199px)').matches) return 2

    return 3
  }

  let visibleCount = getVisibleCount()
  let cloneCount = visibleCount
  let currentIndex = cloneCount
  let autoplayId = null
  const autoplayDelay = 4000
  const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

  function shouldAutoplay() {
    return !reducedMotionMedia.matches
  }

  function getStep() {
    const item = participantsTrack.querySelector('.participants__item')
    const styles = getComputedStyle(participantsTrack)
    const gap = parseFloat(styles.columnGap) || 0

    return item.getBoundingClientRect().width + gap
  }

  function getRealIndex() {
    return (currentIndex - cloneCount + originalItems.length) % originalItems.length
  }

  function updateCounter() {
    if (!participantsCurrent || !participantsTotal) return

    const realIndex = getRealIndex()
    const current = ((realIndex + visibleCount - 1) % originalItems.length) + 1

    participantsCurrent.textContent = current
    participantsTotal.textContent = originalItems.length
  }

  function moveTo(index, withTransition = true) {
    if (withTransition && isAnimating) return

    currentIndex = index
    isAnimating = withTransition

    participantsTrack.style.transition = withTransition ? '' : 'none'
    participantsTrack.style.transform = `translateX(-${getStep() * currentIndex}px)`

    updateCounter()
  }

  function nextSlide() {
    moveTo(currentIndex + 1)
  }

  function prevSlide() {
    moveTo(currentIndex - 1)
  }

  function startAutoplay() {
    if (!shouldAutoplay()) return

    stopAutoplay()
    autoplayId = window.setInterval(nextSlide, autoplayDelay)
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId)
      autoplayId = null
    }
  }

  function restartAutoplay() {
    stopAutoplay()
    startAutoplay()
  }

  function prepareClone(clone) {
    clone.dataset.clone = 'true'
    clone.setAttribute('aria-hidden', 'true')

    clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((element) => {
      element.setAttribute('tabindex', '-1')
    })

    return clone
  }

  function rebuildClones() {
    participantsTrack.querySelectorAll('[data-clone]').forEach((item) => {
      item.remove()
    })

    visibleCount = getVisibleCount()
    cloneCount = visibleCount

    const startClones = originalItems.slice(-cloneCount).map((item) => {
      const clone = item.cloneNode(true)
      return prepareClone(clone)
    })

    const endClones = originalItems.slice(0, cloneCount).map((item) => {
      const clone = item.cloneNode(true)
      return prepareClone(clone)
    })

    participantsTrack.prepend(...startClones)
    participantsTrack.append(...endClones)

    moveTo(cloneCount, false)
  }

  participantsTrack.addEventListener('transitionend', (event) => {
    if (event.target !== participantsTrack) return

    if (currentIndex >= originalItems.length + cloneCount) {
      moveTo(cloneCount, false)
    }

    if (currentIndex < cloneCount) {
      moveTo(originalItems.length + cloneCount - 1, false)
    }

    isAnimating = false
  })

  participantsNext?.addEventListener('click', () => {
    if (isAnimating) return

    nextSlide()
    restartAutoplay()
  })

  participantsPrev?.addEventListener('click', () => {
    if (isAnimating) return

    prevSlide()
    restartAutoplay()
  })

  participantsSlider.addEventListener('mouseenter', stopAutoplay)
  participantsSlider.addEventListener('mouseleave', startAutoplay)

  window.addEventListener('resize', () => {
    rebuildClones()
  })

  reducedMotionMedia.addEventListener('change', () => {
    if (shouldAutoplay()) {
      startAutoplay()
      return
    }

    stopAutoplay()
  })

  rebuildClones()
  startAutoplay()
}
