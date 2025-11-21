/* blook.js – Fixed & Robust */
(() => {
  const isAdmin = location.pathname.includes('admin.html');

  // Load index.json with fallback
  async function loadIndex() {
    try {
      const res = await fetch('posts/index.json?t=' + Date.now());
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      console.warn('index.json not found – starting fresh');
      return [];
    }
  }

  // Render posts
  async function renderPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    const posts = await loadIndex();
    if (posts.length === 0) {
      container.innerHTML = '<p>No posts yet. <a href="admin.html">Write your first one!</a></p>';
      return;
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.map(p => `
      <article class="post-card">
        <div class="post-thumb">
          <img src="${p.image || 'assets/placeholder.jpg'}" alt="">
        </div>
        <div class="post-content">
          <h2 class="entry-title"><a href="${p.url}">${p.title}</a></h2>
          <div class="entry-meta"><span class="date">${p.date}</span></div>
          <div class="entry-excerpt">${p.excerpt}</div>
          <a href="${p.url}" class="read-more">Read More →</a>
        </div>
      </article>
    `).join('');
  }

  // Admin: Save post
  function setupAdmin() {
    const btn = document.getElementById('save-post');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const title = document.getElementById('post-title').value.trim();
      const content = document.getElementById('post-content').value.trim();
      if (!title || !content) return alert('Title and content required!');

      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const fileName = `${slug}.html`;
      const excerpt = content.split('\n').find(l => l.trim()) || content.slice(0, 150) + '...';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
<div class="container single-post">
  <h1>${title}</h1>
  <p class="date">${date}</p>
  <div class="post-body">${content.replace(/\n/g, '<br>')}</div>
  <p><a href="../index.html">← Back to Home</a></p>
</div>
</body>
</html>`;

      // Save via File System API or download
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await showSaveFilePicker({
            suggestedName: fileName,
            types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }]
          });
          const writable = await handle.createWritable();
          await writable.write(html);
          await writable.close();

          // Update index.json
          const index = await loadIndex();
          const entry = { url: `posts/${fileName}`, title, date, excerpt, image: '' };
          const exists = index.findIndex(p => p.url === entry.url);
          if (exists > -1) index[exists] = entry;
          else index.push(entry);

          const indexHandle = await showSaveFilePicker({
            suggestedName: 'index.json',
            types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
          });
          const w = await indexHandle.createWritable();
          await w.write(JSON.stringify(index, null, 2));
          await w.close();

          alert('Post published! Refresh home page.');
        } catch (e) { console.error(e); }
      } else {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fileName; a.click();
        alert('Downloaded! Move to /posts/ and refresh.');
      }
    });
  }

  // Run
  if (isAdmin) setupAdmin();
  else renderPosts();
})();