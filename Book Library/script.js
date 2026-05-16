// ─── COVER PALETTES (fallback if no image) ───────────────────────────────────
const COVER_PALETTES = [
  ['#C0152A','#8B0E1D'], ['#8B0E1D','#3D0509'],
  ['#E8334A','#C0152A'], ['#B01525','#5C0B12'],
  ['#D4182E','#8B0E1D'], ['#A01020','#600810'],
];

// ─── DATA ────────────────────────────────────────────────────────────────────
let books = JSON.parse(localStorage.getItem('bibliotheca_books') || '[]');
let history = JSON.parse(localStorage.getItem('bibliotheca_history') || '[]');

// Sample books with local image paths
if (!books.length) {
  books = [
    { id: uid(), title: "The Great Gatsby",       author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction",     rating: 5, status: "available", notes: "A masterpiece of the Jazz Age.",                   isbn: "", cover: "images/great-gatsby.jpg" },
    { id: uid(), title: "Sapiens",                author: "Yuval Noah Harari",   year: 2011, genre: "History",     rating: 5, status: "lent",      notes: "Mind-blowing perspective on human history.",     isbn: "", cover: "images/sapiens.jpg" },
    { id: uid(), title: "Atomic Habits",          author: "James Clear",         year: 2018, genre: "Self-Help",   rating: 4, status: "reading",   notes: "Practical guide to building good habits.",        isbn: "", cover: "images/atomic-habits.jpg" },
    { id: uid(), title: "Dune",                   author: "Frank Herbert",       year: 1965, genre: "Fiction",     rating: 5, status: "available", notes: "Epic science fiction saga.",                      isbn: "", cover: "images/dune.jpg" },
    { id: uid(), title: "A Brief History of Time",author: "Stephen Hawking",     year: 1988, genre: "Science",     rating: 4, status: "available", notes: "Complex physics made accessible.",                isbn: "", cover: "images/brief-history.jpg" },
    { id: uid(), title: "Steve Jobs",             author: "Walter Isaacson",     year: 2011, genre: "Biography",   rating: 4, status: "available", notes: "Fascinating life story.",                         isbn: "", cover: "images/steve-jobs.jpg" },
    { id: uid(), title: "The Art of War",         author: "Sun Tzu",             year: 500,  genre: "History",     rating: 5, status: "available", notes: "Timeless strategic wisdom.",                      isbn: "", cover: "images/art-of-war.jpg" },
    { id: uid(), title: "Thinking Fast and Slow", author: "Daniel Kahneman",     year: 2011, genre: "Non-Fiction", rating: 5, status: "reading",   notes: "Dual process theory explained brilliantly.",      isbn: "", cover: "images/thinking-fast-slow.jpg" },
  ];
  history = [
    { id: uid(), bookId: books[1].id, bookTitle: books[1].title, person: "Ahmed Ali",    lentDate: "2024-10-01", returnDate: "2024-10-20", status: "out" },
    { id: uid(), bookId: books[3].id, bookTitle: books[3].title, person: "Sara Khan",    lentDate: "2024-09-05", returnDate: "2024-09-25", status: "returned" },
    { id: uid(), bookId: books[4].id, bookTitle: books[4].title, person: "Usman Farooq", lentDate: "2024-08-12", returnDate: "2024-09-01", status: "returned" },
  ];
  save();
}

// ─── STATE ───────────────────────────────────────────────────────────────────
let currentFilter   = 'all';
let currentCategory = '';
let currentSearch   = '';
let currentSort     = 'title';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function save() {
  localStorage.setItem('bibliotheca_books',   JSON.stringify(books));
  localStorage.setItem('bibliotheca_history', JSON.stringify(history));
}
function palette(id) {
  const i = id ? (id.charCodeAt(0) % COVER_PALETTES.length) : 0;
  return COVER_PALETTES[i];
}
function stars(r) { return r ? '★'.repeat(r) + '☆'.repeat(5-r) : ''; }
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function updateStats() {
  document.getElementById('stat-total').textContent   = books.length;
  document.getElementById('stat-lent').textContent    = books.filter(b => b.status === 'lent').length;
  document.getElementById('stat-reading').textContent = books.filter(b => b.status === 'reading').length;
  document.getElementById('stat-genres').textContent  = [...new Set(books.map(b => b.genre))].length;
}

// ─── COVER UPLOAD ─────────────────────────────────────────────────────────────
function handleCoverUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById('f-cover').value = base64;
    showCoverPreview(base64);
  };
  reader.readAsDataURL(file);
}

function showCoverPreview(src) {
  const area = document.getElementById('coverUploadArea');
  const placeholder = document.getElementById('uploadPlaceholder');
  // Remove old image preview if any
  const oldImg = area.querySelector('img.preview-img');
  if (oldImg) oldImg.remove();
  const oldBtn = area.querySelector('.remove-cover-btn');
  if (oldBtn) oldBtn.remove();

  if (src) {
    area.classList.add('has-image');
    placeholder.style.display = 'none';
    const img = document.createElement('img');
    img.src = src; img.className = 'preview-img';
    area.insertBefore(img, area.querySelector('input'));
    const btn = document.createElement('button');
    btn.className = 'remove-cover-btn'; btn.innerHTML = '✕'; btn.type = 'button';
    btn.onclick = (e) => { e.stopPropagation(); clearCoverPreview(); };
    area.appendChild(btn);
  } else {
    clearCoverPreview();
  }
}

function clearCoverPreview() {
  document.getElementById('f-cover').value = '';
  document.getElementById('coverFileInput').value = '';
  const area = document.getElementById('coverUploadArea');
  area.classList.remove('has-image');
  document.getElementById('uploadPlaceholder').style.display = '';
  const oldImg = area.querySelector('img.preview-img');
  if (oldImg) oldImg.remove();
  const oldBtn = area.querySelector('.remove-cover-btn');
  if (oldBtn) oldBtn.remove();
}

// ─── RENDER BOOKS ─────────────────────────────────────────────────────────────
function getFiltered() {
  let list = [...books];
  if (currentFilter !== 'all') list = list.filter(b => b.status === currentFilter);
  if (currentCategory)         list = list.filter(b => b.genre === currentCategory);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q));
  }
  list.sort((a, b) => {
    if (currentSort === 'title')  return a.title.localeCompare(b.title);
    if (currentSort === 'author') return a.author.localeCompare(b.author);
    if (currentSort === 'year')   return (b.year||0) - (a.year||0);
    if (currentSort === 'rating') return (b.rating||0) - (a.rating||0);
    return 0;
  });
  return list;
}

function renderBooks() {
  const list = getFiltered();
  const grid = document.getElementById('booksGrid');
  document.getElementById('result-count').textContent = `${list.length} book${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="big-icon">📚</div><h3>No books found</h3><p>Try a different search or filter.</p>
    </div>`;
    return;
  }

  grid.innerHTML = list.map((b, i) => {
    const [c1, c2] = palette(b.id);
    const statusLabel = b.status === 'lent' ? 'On Loan' : b.status === 'reading' ? 'Reading' : 'Available';
    const statusClass = b.status === 'lent' ? 'badge-lent' : b.status === 'reading' ? 'badge-reading' : 'badge-available';
    const lendBtn = b.status === 'available'
      ? `<button class="action-btn btn-lend" onclick="openLendModal('${b.id}',event)">📤 Lend</button>`
      : b.status === 'lent'
      ? `<button class="action-btn btn-return" onclick="returnBook('${b.id}',event)">↩ Return</button>`
      : `<button class="action-btn btn-lend" style="opacity:.4" disabled>📖 Reading</button>`;

    const coverHTML = b.cover
      ? `<img src="${b.cover}" alt="${b.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<div class="book-cover-art" style="background:linear-gradient(135deg,${c1},${c2})">
           <div class="stripe"></div>
           <div class="cover-icon">📖</div>
           <div class="cover-title">${b.title}</div>
           <div class="cover-author">${b.author}</div>
         </div>`;

    return `
    <div class="book-card" style="animation-delay:${i*0.05}s" onclick="openDetail('${b.id}')">
      <div class="book-cover">
        ${coverHTML}
        <span class="book-status-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="book-info">
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author}${b.year ? ` · ${b.year}` : ''}</div>
        <div class="book-meta">
          <span class="book-genre">${b.genre}</span>
          <span class="book-rating">${b.rating ? stars(b.rating) : ''}</span>
        </div>
      </div>
      <div class="book-actions" onclick="event.stopPropagation()">
        ${lendBtn}
        <button class="action-btn btn-detail" onclick="openEdit('${b.id}',event)">✏️ Edit</button>
      </div>
    </div>`;
  }).join('');
  updateStats();
}

// ─── FILTERS ──────────────────────────────────────────────────────────────────
function setFilter(f, el) {
  currentFilter = f; currentCategory = '';
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item')[0].classList.add('active');
  renderBooks();
}
function filterByCategory(cat) {
  currentCategory = cat; currentFilter = 'all';
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  showPage('books'); renderBooks();
}
function handleSearch() { currentSearch = document.getElementById('searchInput').value; renderBooks(); }
function handleSort(v)  { currentSort = v; renderBooks(); }

// ─── PAGES ────────────────────────────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (page === 'books')   document.querySelectorAll('.nav-item')[0].classList.add('active');
  if (page === 'history') { document.querySelectorAll('.nav-item')[1].classList.add('active'); renderHistory(); }
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function renderHistory() {
  const ct = document.getElementById('historyTable');
  document.getElementById('history-count').textContent = `${history.length} record${history.length !== 1 ? 's' : ''}`;
  if (!history.length) {
    ct.innerHTML = `<div class="empty-state"><div class="big-icon">🕓</div><h3>No history yet</h3><p>Lend a book to start tracking.</p></div>`;
    return;
  }
  ct.innerHTML = `
    <div class="history-table-header">
      <div>Book</div><div>Borrower</div><div>Lent</div><div>Return</div><div>Status</div>
    </div>
    ${[...history].reverse().map(h => `
      <div class="history-table-row">
        <div class="ht-book">${h.bookTitle}</div>
        <div class="ht-person">${h.person}</div>
        <div class="ht-date">${formatDate(h.lentDate)}</div>
        <div class="ht-date">${formatDate(h.returnDate)}</div>
        <div><span class="ht-status ${h.status}">${h.status === 'returned' ? '✅ Returned' : '📤 Out'}</span></div>
      </div>`).join('')}`;
}

// ─── ADD / EDIT MODAL ─────────────────────────────────────────────────────────
function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add New Book';
  document.getElementById('editingId').value = '';
  ['title','author','year','isbn','notes'].forEach(f => document.getElementById('f-'+f).value = '');
  document.getElementById('f-genre').value  = 'Fiction';
  document.getElementById('f-status').value = 'available';
  document.getElementById('f-rating').value = '';
  clearCoverPreview();
  openModal('addModal');
}
function openEdit(id, e) {
  if (e) e.stopPropagation();
  const b = books.find(x => x.id === id); if (!b) return;
  document.getElementById('modalTitle').textContent = 'Edit Book';
  document.getElementById('editingId').value = id;
  document.getElementById('f-title').value  = b.title;
  document.getElementById('f-author').value = b.author;
  document.getElementById('f-year').value   = b.year || '';
  document.getElementById('f-genre').value  = b.genre;
  document.getElementById('f-rating').value = b.rating || '';
  document.getElementById('f-status').value = b.status;
  document.getElementById('f-isbn').value   = b.isbn || '';
  document.getElementById('f-notes').value  = b.notes || '';
  // Show existing cover preview
  clearCoverPreview();
  if (b.cover) {
    document.getElementById('f-cover').value = b.cover;
    showCoverPreview(b.cover);
  }
  openModal('addModal');
}
function saveBook() {
  const title  = document.getElementById('f-title').value.trim();
  const author = document.getElementById('f-author').value.trim();
  if (!title || !author) { toast('Please fill in title and author.'); return; }
  const id = document.getElementById('editingId').value;
  const data = {
    title, author,
    year:   parseInt(document.getElementById('f-year').value)   || null,
    genre:  document.getElementById('f-genre').value,
    rating: parseInt(document.getElementById('f-rating').value) || null,
    status: document.getElementById('f-status').value,
    isbn:   document.getElementById('f-isbn').value.trim(),
    notes:  document.getElementById('f-notes').value.trim(),
    cover:  document.getElementById('f-cover').value || null,
  };
  if (id) {
    const idx = books.findIndex(b => b.id === id);
    books[idx] = { ...books[idx], ...data };
    toast('Book updated! ✏️');
  } else {
    books.push({ id: uid(), ...data });
    toast('Book added to library! 📚');
  }
  save(); closeModal('addModal'); renderBooks();
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function openDetail(id) {
  const b = books.find(x => x.id === id); if (!b) return;
  const [c1, c2] = palette(b.id);
  const bHistory  = history.filter(h => h.bookId === id);
  const statusLabel = b.status === 'lent' ? '📤 On Loan' : b.status === 'reading' ? '📖 Reading' : '✅ Available';
  const coverHTML = b.cover
    ? `<img src="${b.cover}" alt="${b.title}" style="width:100%;height:100%;object-fit:cover;">`
    : `<div class="detail-cover-gradient" style="background:linear-gradient(135deg,${c1},${c2})">
         <div class="stripe"></div>
         <div style="text-align:center;position:relative;z-index:1">
           <div style="font-size:40px">📖</div>
           <div style="font-family:'Playfair Display',serif;font-size:20px;color:white;font-weight:700;margin-top:8px;padding:0 20px">${b.title}</div>
           <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px">${b.author}</div>
         </div>
       </div>`;

  document.getElementById('detailBody').innerHTML = `
    <div class="detail-cover">${coverHTML}</div>
    <div class="detail-grid">
      <div class="detail-field"><label>Genre</label><p>${b.genre}</p></div>
      <div class="detail-field"><label>Year</label><p>${b.year || '—'}</p></div>
      <div class="detail-field"><label>Rating</label><p style="color:var(--crimson)">${b.rating ? stars(b.rating) : '—'}</p></div>
      <div class="detail-field"><label>Status</label><p>${statusLabel}</p></div>
      ${b.isbn ? `<div class="detail-field" style="grid-column:1/-1"><label>ISBN</label><p>${b.isbn}</p></div>` : ''}
    </div>
    ${b.notes ? `<div class="notes-box"><label>Notes</label><p>${b.notes}</p></div>` : ''}
    <div>
      <div style="font-size:12px;font-weight:700;color:var(--crimson);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">
        📋 Borrow History (${bHistory.length})
      </div>
      ${bHistory.length ? bHistory.map(h => `
        <div class="history-item">
          <div class="history-dot" style="${h.status==='returned'?'background:#28a745':''}"></div>
          <div><span class="person">${h.person}</span> — ${h.status==='returned'?'✅ Returned':'📤 Currently out'}</div>
          <div class="dates">${formatDate(h.lentDate)} → ${formatDate(h.returnDate)}</div>
        </div>`).join('') : '<p style="color:var(--text-light);font-size:13px">No borrowing history yet.</p>'}
    </div>
    <div class="modal-actions" style="margin-top:24px">
      <button class="btn-cancel" onclick="closeModal('detailModal');openEdit('${id}',null)">✏️ Edit</button>
      <button class="btn-save" style="background:#dc3545" onclick="deleteBook('${id}')">🗑️ Delete</button>
      ${b.status==='available' ? `<button class="btn-save" onclick="closeModal('detailModal');openLendModal('${id}',null)">📤 Lend</button>` : ''}
      ${b.status==='lent'      ? `<button class="btn-save" style="background:#856404" onclick="returnBook('${id}',null)">↩ Return</button>` : ''}
    </div>`;
  openModal('detailModal');
}
function deleteBook(id) {
  if (!confirm('Delete this book from your library?')) return;
  books = books.filter(b => b.id !== id);
  save(); closeModal('detailModal'); renderBooks(); toast('Book removed. 🗑️');
}

// ─── LEND MODAL ───────────────────────────────────────────────────────────────
function openLendModal(id, e) {
  if (e) e.stopPropagation();
  const b = books.find(x => x.id === id); if (!b) return;
  document.getElementById('lendBookId').value    = id;
  document.getElementById('lendBookTitle').textContent = b.title;
  document.getElementById('lendName').value      = '';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('lendDate').value      = today;
  const ret = new Date(); ret.setDate(ret.getDate() + 14);
  document.getElementById('lendReturn').value    = ret.toISOString().split('T')[0];
  openModal('lendModal');
}
function confirmLend() {
  const id   = document.getElementById('lendBookId').value;
  const name = document.getElementById('lendName').value.trim();
  if (!name) { toast("Please enter borrower's name."); return; }
  const b = books.find(x => x.id === id); if (!b) return;
  b.status = 'lent';
  history.push({
    id: uid(), bookId: id, bookTitle: b.title, person: name,
    lentDate:   document.getElementById('lendDate').value,
    returnDate: document.getElementById('lendReturn').value,
    status: 'out',
  });
  save(); closeModal('lendModal'); renderBooks();
  toast(`"${b.title}" lent to ${name} 📤`);
}
function returnBook(id, e) {
  if (e) e.stopPropagation();
  const b = books.find(x => x.id === id); if (!b) return;
  b.status = 'available';
  const rec = history.filter(h => h.bookId === id && h.status === 'out').pop();
  if (rec) { rec.status = 'returned'; rec.returnDate = new Date().toISOString().split('T')[0]; }
  save(); closeModal('detailModal'); renderBooks();
  toast(`"${b.title}" returned! ✅`);
}

// ─── MODAL HELPERS ────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(o => closeModal(o.id));
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderBooks();
