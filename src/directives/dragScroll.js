/**
 * Global Drag-to-Scroll & Mouse Wheel Horizontal Scroll Helper
 * Memungkinkan seluruh elemen chip-row / tab scrollable di desktop
 * dapat digeser/drag dengan klik mouse maupun di-scroll dengan roda mouse.
 */
export function setupDragScroll() {
  if (typeof window === 'undefined') return

  let activeEl = null
  let isDown = false
  let startX = 0
  let scrollLeft = 0
  let hasMoved = false

  // 1. Mouse Drag-to-Scroll (Klik dan geser dengan mouse di desktop)
  window.addEventListener(
    'mousedown',
    (e) => {
      // Jangan aktifkan jika user mengklik input control
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return
      }

      const container = e.target.closest('.chip-row, .card-filter-scroll, [data-drag-scroll]')
      if (!container) return

      activeEl = container
      isDown = true
      hasMoved = false
      startX = e.pageX - container.getBoundingClientRect().left
      scrollLeft = container.scrollLeft
    },
    { passive: false }
  )

  window.addEventListener(
    'mousemove',
    (e) => {
      if (!isDown || !activeEl) return
      const currentX = e.pageX - activeEl.getBoundingClientRect().left
      const walk = currentX - startX

      // Hanya anggap drag jika gerakan lebih dari 4px
      if (Math.abs(walk) > 4) {
        if (!hasMoved) {
          hasMoved = true
          activeEl.classList.add('is-dragging')
        }
        activeEl.scrollLeft = scrollLeft - walk
      }
    },
    { passive: true }
  )

  const stopDrag = () => {
    if (!isDown || !activeEl) return
    isDown = false
    activeEl.classList.remove('is-dragging')

    if (hasMoved) {
      // Mencegah trigger click pada tombol anak jika user sedang menggeser/drag
      const suppressClick = (ev) => {
        ev.stopImmediatePropagation()
        ev.preventDefault()
        window.removeEventListener('click', suppressClick, true)
      }
      window.addEventListener('click', suppressClick, true)
      setTimeout(() => {
        window.removeEventListener('click', suppressClick, true)
      }, 50)
    }

    activeEl = null
    hasMoved = false
  }

  window.addEventListener('mouseup', stopDrag, true)
  window.addEventListener('mouseleave', stopDrag, true)

  // 2. Mouse Wheel to Horizontal Scroll (Scroll roda mouse atas/bawah langsung menggeser ke samping)
  window.addEventListener(
    'wheel',
    (e) => {
      const container = e.target.closest('.chip-row, .card-filter-scroll, [data-drag-scroll]')
      if (!container) return

      // Jika konten lebih lebar dari kontainer, alihkan scroll vertikal ke horizontal
      if (container.scrollWidth > container.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          container.scrollLeft += e.deltaY * 1.2
          e.preventDefault()
        }
      }
    },
    { passive: false }
  )
}
