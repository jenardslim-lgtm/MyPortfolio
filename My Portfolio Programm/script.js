// ---- Settings ----
const EMAIL = 'LiMart@gmail.com'          // where the mailto fallback sends messages
const CV_NAME = 'Lim, Jenard Curriculum Vitae.pdf'  // your CV file name
const FORM_ENDPOINT = ''                  // paste your Formspree URL here (https://formspree.io/f/xxxx) to receive messages by email

// ---- Images: uses your real file names; tries common extensions and folders automatically ----
const ASSET_FOLDERS = ['./assets/', './', './images/', './img/', './Images/', './photos/']
const ASSET_EXTS = ['png', 'jpg', 'jpeg', 'webp']
function assetCandidates(name) {
  const names = [...new Set([name, name.replace(/\s+/g, ' ')])]
  const list = []
  for (const folder of ASSET_FOLDERS) for (const ext of ASSET_EXTS) for (const n of names) list.push(encodeURI(`${folder}${n}.${ext}`))
  return list
}
function assetImg(name, alt, attrs = '') {
  return `<img data-asset="${escapeHtml(name)}" data-try="0" src="${assetCandidates(name)[0]}" alt="${escapeHtml(alt)}" ${attrs} />`
}
function setAsset(img, name, alt) {
  img.dataset.asset = name
  img.dataset.try = '0'
  img.alt = alt
  img.src = assetCandidates(name)[0]
}
document.addEventListener('error', (event) => {
  const img = event.target
  if (!(img instanceof HTMLImageElement) || !img.dataset.asset) return
  const list = assetCandidates(img.dataset.asset)
  const next = Number(img.dataset.try) + 1
  if (next < list.length) { img.dataset.try = String(next); img.src = list[next] }
  else console.warn(`Image not found: "${img.dataset.asset}". Put it in the assets folder next to index.html.`)
}, true)
// The CV lives in the same folder the images loaded from, so build its links from that folder
let assetBase = './assets/'
function noteAssetFolder(img) {
  assetBase = img.src.slice(0, img.src.lastIndexOf('/') + 1)
  document.querySelectorAll('.cv-link').forEach((link) => { link.href = assetBase + encodeURIComponent(CV_NAME) })
}
document.addEventListener('load', (event) => {
  if (event.target instanceof HTMLImageElement && event.target.dataset.asset) noteAssetFolder(event.target)
}, true)
document.querySelectorAll('img[data-asset]').forEach((img) => { if (img.complete && img.naturalWidth > 0) noteAssetFolder(img) })
// Images in the HTML may already have failed before this script ran, so re-check them now
document.querySelectorAll('img[data-asset]').forEach((img) => {
  if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'))
})

const projects = [
  { title: 'Brew Haven Logo', type: 'Logo Design', image: 'Brew Haven Digital Logo', tools: 'Pencil, Colored Pencil, Adobe Illustrator', description: 'A warm identity for a fictional coffee shop, featuring expressive lettering and a wing motif. Shown from hand-drawn sketch to digital logo.',
    gallery: [{ src: 'Brew Haven Logo Sketch', label: 'Logo sketch' }, { src: 'Brew Haven Digital Logo', label: 'Digital logo' }] },
  { title: 'Pumpkin Spice Latte Campaign', type: 'Marketing Design', image: 'Pumpkin Spice Latte - Landing Page Banner 1600x900px (1)', tools: 'Adobe Photoshop, Canva', description: 'A seasonal campaign for Brew Haven, designed across a social media post, banner ad, landing page banner, and newsletter header.',
    gallery: [{ src: 'Pumpkin Spice Latte  - Social Media Post 1080 x 1080 (1)', label: 'Social media post (1080 x 1080)' }, { src: 'Pumpkin Spice Latte - Banner Ad 336x280px (1)', label: 'Banner ad (336 x 280)' }, { src: 'Pumpkin Spice Latte - Landing Page Banner 1600x900px (1)', label: 'Landing page banner (1600 x 900)' }, { src: 'Pumpkin Spice Latte - Newsletter Header 600x200px (1)', label: 'Newsletter header (600 x 200)' }] },
  { title: 'Typography Poster', type: 'Poster Design', image: 'Typography Brand Digital Poster', tools: 'Pencil, Colored Pencil, Adobe Photoshop', description: 'A bold brand identity poster built around repetition, contrast, and playful typography, from sketch to digital poster.',
    gallery: [{ src: 'Typography Brand Poster Sketch', label: 'Poster sketch' }, { src: 'Typography Brand Digital Poster', label: 'Digital poster' }] },
  { title: 'Digital Logo Studies', type: 'Logo Design', image: 'Digital Logo', tools: 'Ink, Pencil, Adobe Illustrator', description: 'A collection of logo directions exploring typography, symbols, and signature marks, from hand-rendered sketches to a digital mark.',
    gallery: [{ src: 'Digital Logo Sketch', label: 'Logo sketches' }, { src: 'Digital Logo', label: 'Digital logo' }] },
  { title: 'Portfolio Wireframe', type: 'Wireframe', image: 'Wireframe Figma Prototype', tools: 'Pencil, Ruler, Figma', description: 'A portfolio layout showing page hierarchy, navigation flow, and content structure, from paper sketch to Figma prototype.',
    gallery: [{ src: 'Wireframe Portfolio Sketch', label: 'Paper wireframe' }, { src: 'Wireframe Figma Prototype', label: 'Figma prototype' }] },
  { title: 'Apple Study', type: 'Illustration', image: 'Apple Sketch', tools: 'Pencil, Colored Pencil', description: 'A value and color study exploring light, shadow, and form through three apple illustrations.', gallery: [] },
]

const $ = (selector) => document.querySelector(selector)

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// ---- Projects ----
function projectCard(project) {
  const index = projects.indexOf(project)
  return `
    <a class="work-card" href="#project-${index}">
      <div class="project-image">${assetImg(project.image, project.title, 'loading="lazy" width="400" height="165"')}</div>
      <strong>${escapeHtml(project.type)}</strong>
      <span>${escapeHtml(project.title)}</span>
      <small>Tools: ${escapeHtml(project.tools)}</small>
    </a>`
}

function renderProjects(filter = 'All') {
  const visible = filter === 'All' ? projects : projects.filter((project) => project.type === filter)
  $('#project-grid').innerHTML = visible.length
    ? visible.map(projectCard).join('')
    : '<div class="empty-state"><strong>No projects yet</strong><p>Check back soon.</p></div>'
}

function showProject(index) {
  const project = projects[index]
  setAsset($('#detail-image'), project.image, project.title)
  $('#detail-title').textContent = project.title
  $('#detail-type').textContent = project.type
  $('#detail-description').textContent = project.description
  $('#detail-tools').innerHTML = project.tools.split(',').map((tool) => `<span>${escapeHtml(tool.trim())}</span>`).join('')
  const hasGallery = project.gallery.length > 1
  $('#detail-more-title').hidden = !hasGallery
  $('#detail-gallery').hidden = !hasGallery
  $('#detail-gallery').innerHTML = project.gallery.map((item) => `<figure><button class="zoom" type="button" aria-label="View larger: ${escapeHtml(item.label)}">${assetImg(item.src, `${project.title}: ${item.label}`)}</button><figcaption>${escapeHtml(item.label)}</figcaption></figure>`).join('')
}

$('#featured-projects').innerHTML = projects.slice(0, 3).map(projectCard).join('')
renderProjects()

// ---- Safe storage (private browsing or bad data won't crash the site) ----
function getMessages() {
  try {
    const data = JSON.parse(localStorage.getItem('limart-feedback') || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function saveMessages(messages) {
  try { localStorage.setItem('limart-feedback', JSON.stringify(messages)) } catch { /* storage unavailable */ }
  renderFeedback()
}

function renderFeedback() {
  const messages = getMessages()
  $('#message-count').textContent = messages.length
  $('#feedback-list').innerHTML = messages.length
    ? messages.map((message) => `
      <article class="message-card">
        <div class="message-meta">
          <div><strong>${escapeHtml(message.name)}</strong><a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></div>
          <time>${escapeHtml(message.date)}</time>
        </div>
        <p>${escapeHtml(message.message)}</p>
        <button class="delete-message" data-message-id="${escapeHtml(message.id)}" type="button">Delete</button>
      </article>`).join('')
    : '<div class="empty-state"><strong>No messages yet</strong><p>New contact form messages will appear here.</p></div>'
}

// ---- Image viewer (lightbox) ----
const lightbox = $('#lightbox')
let lastFocus = null
let viewerImages = []
let viewerIndex = 0
function showViewerImage() {
  const img = viewerImages[viewerIndex]
  const figure = img.closest('figure')
  const caption = figure ? figure.querySelector('figcaption').textContent : img.alt
  $('#lightbox-img').src = img.currentSrc || img.src
  $('#lightbox-img').alt = img.alt
  $('#lightbox-caption').textContent = viewerImages.length > 1 ? `${caption} (${viewerIndex + 1} of ${viewerImages.length})` : caption
}
function openLightbox(img) {
  lastFocus = document.activeElement
  const gallery = [...document.querySelectorAll('#detail-gallery img')]
  viewerImages = gallery.includes(img) ? gallery : [img]
  viewerIndex = viewerImages.indexOf(img)
  const many = viewerImages.length > 1
  $('#lightbox-prev').hidden = !many
  $('#lightbox-next').hidden = !many
  showViewerImage()
  lightbox.hidden = false
  document.body.classList.add('no-scroll')
  $('#lightbox-close').focus()
}
function stepViewer(step) {
  if (lightbox.hidden || viewerImages.length < 2) return
  viewerIndex = (viewerIndex + step + viewerImages.length) % viewerImages.length
  showViewerImage()
}
function closeLightbox() {
  if (lightbox.hidden) return
  lightbox.hidden = true
  $('#lightbox-img').removeAttribute('src')
  document.body.classList.remove('no-scroll')
  if (lastFocus && lastFocus.focus) lastFocus.focus()
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') stepViewer(-1)
  if (event.key === 'ArrowRight') stepViewer(1)
})
// Swipe left/right on touch screens
let touchStartX = null
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.touches[0].clientX }, { passive: true })
lightbox.addEventListener('touchend', (event) => {
  if (touchStartX === null) return
  const distance = event.changedTouches[0].clientX - touchStartX
  touchStartX = null
  if (Math.abs(distance) > 50) stepViewer(distance < 0 ? 1 : -1)
}, { passive: true })

// ---- Routing: the URL hash drives the page, so Back, Refresh, and shared links work ----
let firstLoad = true

function route() {
  closeLightbox()
  let name = location.hash.slice(1) || 'home'
  if (name.startsWith('project-')) {
    const index = Number(name.slice(8))
    if (Number.isInteger(index) && projects[index]) {
      showProject(index)
      name = 'project'
    } else {
      name = 'portfolio'
    }
  }
  const page = document.getElementById(name)
  if (!page || !page.classList.contains('page')) name = 'home'

  document.querySelectorAll('.page').forEach((section) => section.classList.toggle('active', section.id === name))
  document.querySelectorAll('.header .nav-link').forEach((link) => {
    const current = link.dataset.page === name || (name === 'project' && link.dataset.page === 'portfolio')
    link.classList.toggle('active', current)
    if (link.closest('nav')) {
      if (current) link.setAttribute('aria-current', 'page')
      else link.removeAttribute('aria-current')
    }
  })

  window.scrollTo({ top: 0, behavior: firstLoad ? 'auto' : 'smooth' })
  const heading = document.getElementById(name).querySelector('h1')
  if (heading && !firstLoad) {
    heading.tabIndex = -1
    heading.focus({ preventScroll: true })
  }
  if (name === 'feedback') renderFeedback()
  firstLoad = false
}

window.addEventListener('hashchange', route)

// ---- Clicks ----
document.addEventListener('click', (event) => {
  const navigationButton = event.target.closest('button.nav-link')
  if (navigationButton) {
    const target = `#${navigationButton.dataset.page}`
    if (location.hash === target || (!location.hash && target === '#home')) route()
    else location.hash = target
  }

  const zoomImage = event.target.closest('#detail-gallery img, #detail-image')
  if (zoomImage) openLightbox(zoomImage)
  if (event.target.closest('#lightbox-prev')) stepViewer(-1)
  if (event.target.closest('#lightbox-next')) stepViewer(1)
  if (event.target === lightbox || event.target.closest('#lightbox-close')) closeLightbox()

  const filterButton = event.target.closest('[data-filter]')
  if (filterButton) {
    document.querySelectorAll('[data-filter]').forEach((button) => {
      button.classList.toggle('selected', button === filterButton)
      button.setAttribute('aria-pressed', button === filterButton)
    })
    renderProjects(filterButton.dataset.filter)
  }

  const deleteButton = event.target.closest('.delete-message')
  if (deleteButton) saveMessages(getMessages().filter((message) => message.id !== deleteButton.dataset.messageId))
})

// ---- Contact form ----
async function deliver(data) {
  if (FORM_ENDPOINT) {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Send failed')
  } else {
    const subject = encodeURIComponent(`Portfolio message from ${data.name}`)
    const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} (${data.email})`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }
}

$('#contact-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const form = event.currentTarget
  const button = form.querySelector('button[type="submit"]')
  const status = $('#form-status')
  const values = Object.fromEntries(new FormData(form))
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: values.name, email: values.email, message: values.message,
    date: new Date().toLocaleString(),
  }

  button.disabled = true
  status.classList.remove('error')
  status.textContent = 'Sending...'
  try {
    await deliver(entry)
    saveMessages([entry, ...getMessages()])
    button.textContent = 'Message Sent'
    status.textContent = FORM_ENDPOINT ? 'Thank you. Your message was sent.' : 'Your email app should open with your message ready to send.'
    form.reset()
  } catch {
    status.classList.add('error')
    status.textContent = `Could not send. Please email ${EMAIL} directly.`
  }
  setTimeout(() => {
    button.disabled = false
    button.textContent = 'Send Message'
    status.textContent = ''
  }, 4000)
})

$('#clear-feedback').addEventListener('click', () => {
  if (getMessages().length && window.confirm('Delete all saved messages?')) saveMessages([])
})

renderFeedback()
route()