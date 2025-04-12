// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get references to HTML elements
const savePostBtn = document.getElementById('save-post-btn');
const postTitleInput = document.getElementById('post-title');
const postBodyInput = document.getElementById('post-body');
const postsList = document.getElementById('posts-list');

// Save blog post to Firestore
savePostBtn.addEventListener('click', () => {
  const title = postTitleInput.value.trim();
  const body = postBodyInput.value.trim();

  if (title && body) {
    // Add post to Firestore
    db.collection('posts').add({
      title: title,
      body: body,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('Post saved!');
      postTitleInput.value = '';
      postBodyInput.value = '';
      loadPosts();  // Reload the list of posts
    })
    .catch(error => {
      console.error('Error adding post: ', error);
    });
  } else {
    alert('Please fill in both title and body');
  }
});

// Load blog posts from Firestore
function loadPosts() {
  db.collection('posts').orderBy('timestamp', 'desc').get().then(snapshot => {
    postsList.innerHTML = '';  // Clear existing posts
    snapshot.forEach(doc => {
      const post = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `${post.title}: ${post.body}`;
      postsList.appendChild(listItem);
    });
  });
}

// Load posts on page load
loadPosts();
