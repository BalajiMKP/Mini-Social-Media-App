const token = localStorage.getItem("token");

function createPost() {
  const content = document.getElementById('postText').value;
  fetch('http://localhost:5000/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  }).then(res => res.json()).then(() => {
    loadFeed();
  });
}

function loadFeed() {
  fetch('http://localhost:5000/posts', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(posts => {
      const feed = document.getElementById('feed');
      feed.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p><b>${post.author.username}:</b> ${post.content}</p>
          <p>Likes: ${post.likes.length} <button onclick="likePost('${post._id}')">Like</button></p>
          <input type="text" id="comment-${post._id}" placeholder="Comment...">
          <button onclick="commentPost('${post._id}')">Comment</button>
          <div>${post.comments.map(c => `<p><i>${c.author.username}:</i> ${c.text}</p>`).join('')}</div>
        `;
        feed.appendChild(div);
      });
    });
}

function likePost(id) {
  fetch(`http://localhost:5000/posts/${id}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(() => loadFeed());
}

function commentPost(id) {
  const text = document.getElementById(`comment-${id}`).value;
  fetch(`http://localhost:5000/posts/${id}/comment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  }).then(() => loadFeed());
}

loadFeed();
