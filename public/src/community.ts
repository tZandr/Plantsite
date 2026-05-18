const searchIcon = document.getElementById('searchIcon') as HTMLElement;
const searchBar = document.getElementById('searchBar') as HTMLElement;

searchIcon.addEventListener('click', (e) => {
  e.preventDefault();
  searchBar.classList.toggle('active');
  console.log('workings?');
});

interface Post {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  author?: string;
  is_premium?: boolean;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Comment {
  _id?: string;
  content: string;
  author?: string;
  is_premium?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded, fetching posts...');
  const postsContainer = document.getElementById('posts') as HTMLElement;
  const modal = document.getElementById('post-modal') as HTMLElement;
  const modalTitle = document.getElementById('modal-title') as HTMLElement;
  const modalBody = document.getElementById('modal-body') as HTMLElement;
  const closeButton = document.getElementById('close-modal') as HTMLElement;
  const deletePostButton = document.getElementById(
    'deletePostButton',
  ) as HTMLElement;
  const editPostButton = document.getElementById(
    'editPostButton',
  ) as HTMLElement;
  const savePostButton = document.getElementById(
    'savePostButton',
  ) as HTMLElement;
  const modalTitleEdit = document.getElementById(
    'modal-title-edit',
  ) as HTMLTextAreaElement;
  const modalBodyEdit = document.getElementById(
    'modal-body-edit',
  ) as HTMLTextAreaElement;

  closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  editPostButton.addEventListener('click', () => {
    modalTitle.classList.add('hidden');
    modalBody.classList.add('hidden');

    // Edit-mode
    modalTitleEdit.classList.remove('hidden');
    modalBodyEdit.classList.remove('hidden');

    // Visa Save-knappen
    savePostButton.classList.remove('hidden');

    // Göm Edit-knappen
    editPostButton.classList.add('hidden');
  });

  deletePostButton.addEventListener('click', async () => {
    const postId = modal.dataset.postId;

    if (!postId) {
      console.error('No post ID found in modal');
      return;
    }

    const res = await fetch(`http://localhost:3000/community/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.ok) {
      console.log('Post deleted');

      modal.classList.add('hidden');

      const posts = document.querySelectorAll('.post');
      posts.forEach((p) => {
        if (
          p.querySelector('.postTitle')?.textContent === modalTitle.textContent
        ) {
          p.remove();
        }
      });
    } else {
      console.error('Failed to delete post');
    }
  });

  // Tag selection
  const tagButtons = document.querySelectorAll<HTMLButtonElement>('.tagButton');
  let selectedTags: string[] = [];

  tagButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Toggled:', btn);

      btn.classList.toggle('selected');
    });
  });

  savePostButton.addEventListener('click', async () => {
    const postId = modal.dataset.postId;

    if (!postId) {
      console.error('No post ID found in modal');
      return;
    }

    const updatedPost = {
      title: modalTitleEdit.value,
      content: modalBodyEdit.value,
    };

    const res = await fetch(`http://localhost:3000/community/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedPost),
    });

    if (!res.ok) {
      console.error('Failed to update post');
      return;
    }

    // Uppdatera UI i modalen
    modalTitle.textContent = updatedPost.title;
    modalBody.textContent = updatedPost.content;

    // Gå tillbaka till visningsläge
    modalTitle.classList.remove('hidden');
    modalBody.classList.remove('hidden');

    modalTitleEdit.classList.add('hidden');
    modalBodyEdit.classList.add('hidden');

    savePostButton.classList.add('hidden');
    editPostButton.classList.remove('hidden');

    console.log('Post updated');
    window.location.href = 'http://127.0.0.1:5500/public/community.html';
  });

  const getPosts = async () => {
    try {
      const res = await fetch('http://localhost:3000/community');
      const posts: Post[] = await res.json();
      console.log('Fetched posts: ', posts);

      posts.forEach((post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post', 'forum');
        postDiv.innerHTML = `
          <div>
          <h3 class="postTitle" style="margin-bottom: 10px;">${post.title}</h3>
          <p class="postBodyPV">${post.content}</p>
          </div>
          <div>
          <h5>${post.tags.join(', ')}</h5>

          <h6>Created at ${post.createdAt}</h6>
          <small>By ${post.author}</small>
          </div>
        `;

        // Modal
        postDiv.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).classList.contains('tagButton')) return;

          modal.dataset.postId = post._id!;

          modalTitle.textContent = post.title;
          modalBody.textContent = post.content;

          modalTitleEdit.value = post.title;
          modalBodyEdit.value = post.content;

          modal.classList.remove('hidden');
        });

        postsContainer.appendChild(postDiv);
      });
    } catch (error) {
      console.log('Error fetching posts: ', error);
    }
  };

  getPosts();
});
