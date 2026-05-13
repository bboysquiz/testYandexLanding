function setupTicker(ticker) {
  const tickerTrack = ticker.querySelector('.ticker__track')
  const tickerGroup = ticker.querySelector('.ticker__group')

  if (!tickerTrack || !tickerGroup) return

  tickerTrack.querySelectorAll('.ticker__group[aria-hidden="true"]').forEach((group) => {
    group.remove()
  })

  const groupWidth = tickerGroup.offsetWidth

  if (groupWidth === 0) return

  const tickerWidth = ticker.offsetWidth
  const clonesCount = Math.ceil(tickerWidth / groupWidth) + 2
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < clonesCount; i += 1) {
    const clone = tickerGroup.cloneNode(true)
    clone.setAttribute('aria-hidden', 'true')
    fragment.append(clone)
  }

  tickerTrack.append(fragment)

  const speed = 90
  const duration = groupWidth / speed

  tickerTrack.style.setProperty('--ticker-distance', `-${groupWidth}px`)
  tickerTrack.style.setProperty('--ticker-duration', `${duration}s`)
}

export function setupTickers() {
  document.querySelectorAll('.ticker').forEach((ticker) => {
    setupTicker(ticker)
  })

  window.addEventListener('resize', () => {
    document.querySelectorAll('.ticker').forEach((ticker) => {
      setupTicker(ticker)
    })
  })
}
