document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const isPatron = params.get('patron') === 'true';

  const contentWrapper = document.getElementById('content-wrapper');
  const accessDeniedModal = document.getElementById('access-denied-modal');
  const loginRedirectBtn = document.getElementById('login-redirect-btn');

  // --- Start of original inline script logic ---
  let posts = JSON.parse(localStorage.getItem('mysticPosts') || '[]');
  let infoPages = JSON.parse(localStorage.getItem('mysticInfo') || '[]');
  let editingPost = null;
  let editingInfo = null;

  // Ensure "about me" post exists
  if (!posts.some(p => p.title === 'about me')) {
    const aboutPost = {
      id: '1',
      title: 'about me',
      content: `A journey inward is a journey through time. Through my own explorations with consciousness, I've learned that connection is the most fundamental aspect of existence. This blog is a space to share insights about spirituality, philosophy, and the nature of being.

Each post is a reflection on the mysteries of life and our place within the cosmic whole. I believe that by sharing our experiences and questions, we create a bridge of understanding with one another.

Welcome to the journey.`,
      date: new Date().toISOString()
    };
    posts.unshift(aboutPost);
    localStorage.setItem('mysticPosts', JSON.stringify(posts));
  }

  function requireAuth(callback) {
    const pass = prompt("Password:");
    if (pass === 'mystic') callback();
    else alert("Wrong password");
  }

  window.openWriteModal = function() {
    requireAuth(() => {
      document.getElementById('write-modal').style.display = 'flex';
    });
  }

  window.closeWriteModal = function() { document.getElementById('write-modal').style.display = 'none'; }

  window.openBlogEditor = function() {
    closeWriteModal();
    document.getElementById('editor').style.display = 'flex';
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('editor-title').textContent = 'Write Blog Post';
    document.getElementById('delete-btn').style.display = 'none';
    editingPost = null;
  }

    window.openInfoEditor = function() {
    closeWriteModal();
    document.getElementById('info-editor').style.display = 'flex';
    document.getElementById('info-name').value = '';
    document.getElementById('info-body').value = '';
    document.getElementById('info-title').textContent = 'Add Info Page';
    document.getElementById('info-delete').style.display = 'none';
    editingInfo = null;
  }

  window.showHome = function() {
    document.getElementById('home-view').style.display = 'block';
    document.getElementById('single-post').style.display = 'none';
    document.getElementById('info-page').style.display = 'none';
    render();
  }

  window.showPost = function(id) {
    const p = posts.find(x => x.id == id);
    document.getElementById('single-content').innerHTML = `
      <h1 style="color:#dcfca1;">${p.title}</h1>
      <div style="color:#667eea;margin-bottom:20px;">${new Date(p.date).toLocaleDateString()}</div>
      <div style="line-height:1.8;">${p.content.replace(/\n/g, '<br>')}</div>
      <br><a href="#" onclick="editPost('${id}')" style="color:#667eea;">edit</a>
    `;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('single-post').style.display = 'block';
    window.scrollTo(0, 0);
  }

  window.showInfo = function(id) {
    const p = infoPages.find(x => x.id == id);
    document.getElementById('info-content').innerHTML = `
      <h1 style="color:#dcfca1;">${p.name}</h1>
      <div style="line-height:1.8;">${p.body.replace(/\n/g, '<br>')}</div>
      <br><a href="#" onclick="editInfo('${id}')" style="color:#667eea;">edit</a>
    `;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('info-page').style.display = 'block';
    window.scrollTo(0, 0);
  }

  function render() {
    const sorted = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date));
    const latest = sorted[0];

    if (latest) {
      document.getElementById('latest-excerpt').textContent = latest.content.substring(0, 180) + (latest.content.length > 180 ? '...' : '');
      document.getElementById('latest-date').textContent = `(${new Date(latest.date).toLocaleDateString()})`;
      const readMore = document.getElementById('read-more');
      if(readMore) readMore.onclick = e => { e.preventDefault(); showPost(latest.id); };
    } else {
      document.getElementById('latest-excerpt').textContent = 'Begin your journey...';
    }

    document.getElementById('post-list').innerHTML = sorted.map(p => 
      `<a href="#" onclick="event.preventDefault(); showPost('${p.id}')">${p.title}</a>`
    ).join('');

    document.getElementById('posts-container').innerHTML = sorted.map(p => `
      <div class="post">
        <h3><a href="#" onclick="event.preventDefault(); showPost('${p.id}')">${p.title}</a></h3>
        <div class="date">${new Date(p.date).toLocaleDateString()}</div>
        <p>${p.content.substring(0, 300)}${p.content.length > 300 ? '...' : ''}</p>
        <a href="#" onclick="event.preventDefault(); editPost('${p.id}')">edit</a>
      </div>
    `).join('');

    const infoHTML = infoPages.map(p => 
      `<a href="#" onclick="event.preventDefault(); showInfo('${p.id}')">${p.name}</a>`
    ).join('<br>');
    document.getElementById('info-list').innerHTML = 
      `<span class="write-btn" onclick="openWriteModal()">+ Write Post or Info</span><br>` + infoHTML;
  }

  window.closeEditor = function() { document.getElementById('editor').style.display = 'none'; }
  window.savePost = function() {
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    if (!title || !content) return alert('Required');
    if (editingPost) {
      const idx = posts.findIndex(p => p.id == editingPost);
      posts[idx] = { ...posts[idx], title, content };
    } else {
      posts.unshift({ id: Date.now() + '', title, content, date: new Date().toISOString() });
    }
    localStorage.setItem('mysticPosts', JSON.stringify(posts));
    closeEditor();
    render();
    showHome();
  }
  window.editPost = function(id) {
    requireAuth(() => {
      const p = posts.find(x => x.id == id);
      editingPost = id;
      document.getElementById('post-title').value = p.title;
      document.getElementById('post-content').value = p.content;
      document.getElementById('editor-title').textContent = 'Edit Post';
      document.getElementById('delete-btn').style.display = 'inline-block';
      document.getElementById('editor').style.display = 'flex';
    });
  }
  window.deletePost = function() {
    if (confirm('Delete?')) {
      posts = posts.filter(p => p.id != editingPost);
      localStorage.setItem('mysticPosts', JSON.stringify(posts));
      closeEditor();
      render();
      showHome();
    }
  }

  window.closeInfoEditor = function() { document.getElementById('info-editor').style.display = 'none'; }
  window.saveInfo = function() {
    const name = document.getElementById('info-name').value.trim();
    const body = document.getElementById('info-body').value.trim();
    if (!name || !body) return alert('Required');
    if (editingInfo) {
      const idx = infoPages.findIndex(p => p.id == editingInfo);
      infoPages[idx] = { ...infoPages[idx], name, body };
    } else {
      infoPages.unshift({ id: Date.now() + '', name, body });
    }
    localStorage.setItem('mysticInfo', JSON.stringify(infoPages));
    closeInfoEditor();
    render();
  }
  window.editInfo = function(id) {
    requireAuth(() => {
      const p = infoPages.find(x => x.id == id);
      editingInfo = id;
      document.getElementById('info-name').value = p.name;
      document.getElementById('info-body').value = p.body;
      document.getElementById('info-title').textContent = 'Edit Info Page';
      document.getElementById('info-delete').style.display = 'inline-block';
      document.getElementById('info-editor').style.display = 'flex';
    });
  }
  window.deleteInfo = function() {
    if (confirm('Delete?')) {
      infoPages = infoPages.filter(p => p.id != editingInfo);
      localStorage.setItem('mysticInfo', JSON.stringify(infoPages));
      closeInfoEditor();
      render();
    }
  }
  // --- End of original inline script logic ---


  // Main logic to check patron status
  if (isPatron) {
    // User is a patron, so show the content and hide the modal.
    if (contentWrapper) contentWrapper.style.display = 'block';
    if (accessDeniedModal) accessDeniedModal.style.display = 'none';
    render(); // Render the blog content
  } else {
    // User is not a patron, so hide the content and show the modal.
    if (contentWrapper) contentWrapper.style.display = 'none';
    if (accessDeniedModal) accessDeniedModal.style.display = 'flex';

    // Make the "OK" button in the modal redirect to the login page.
    if (loginRedirectBtn) {
      loginRedirectBtn.addEventListener('click', () => {
        window.location.href = 'https://portfolio-and-blog-production.up.railway.app/auth/patreon';
      });
    }
  }
});
