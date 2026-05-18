const uploadButton = document.getElementById('uploadButton') as HTMLElement;
const titleInput = document.getElementById('postTitle') as HTMLInputElement;
const bodyInput = document.getElementById('postBody') as HTMLTextAreaElement;

type PostInput = {
  title: string;
  content: string;
  tags: string[];
};

// Tag selection
const tagButtons = document.querySelectorAll<HTMLButtonElement>('.tagButton');
let selectedTags: string[] = [];

tagButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('clicked', btn);

    btn.classList.toggle('selected');

    const tagText = btn.textContent!.trim();

    if (btn.classList.contains('selected')) {
      selectedTags.push(tagText);
    } else {
      selectedTags = selectedTags.filter((t) => t !== tagText);
    }
  });
});

// Upload post
uploadButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const newPost: PostInput = {
    title: titleInput.value,
    content: bodyInput.value,
    tags: selectedTags,
  };

  const res = await fetch('http://localhost:3000/community', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(newPost),
  });

  const data = await res.json();
  console.log('Created post: ', data);
  window.location.href = 'http://127.0.0.1:5500/public/community.html';
});
