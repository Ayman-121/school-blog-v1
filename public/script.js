// Function to render posts
function renderPosts(posts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = ''; // Clear existing posts
  posts.forEach((post) => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
      postDiv.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>Posted on ${new Date(post.createdAt).toLocaleString()}</small>
      `;
      postsContainer.appendChild(postDiv);
  });
}

// Fetch posts from the server when the page loads
fetch('/posts')
  .then((response) => response.json())
  .then((data) => {
      renderPosts(data); // Render the posts
  });

// Handle form submission
document.getElementById('postForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  // Create a new post object
  const newPost = { title, content, createdAt: new Date() };

  // Send the new post to the server
  fetch('/posts', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
  })
  .then(response => response.json())
  .then(data => {
      renderPosts(data); // Render the updated posts
      document.getElementById('title').value = ''; // Clear the title input
      document.getElementById('content').value = ''; // Clear the content input
  });
});