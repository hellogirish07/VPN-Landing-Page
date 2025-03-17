// Mobile menu toggle
document.getElementById('menu-toggle')?.addEventListener('click', function() {
    document.querySelector('.mobile-menu').classList.toggle('active');
});

// Blog functionality
let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
let currentBlogId = null;

// DOM Elements
const blogPosts = document.getElementById('blogPosts');
const blogModal = document.getElementById('blogModal');
const createBlogBtn = document.getElementById('createBlogBtn');
const closeModal = document.getElementById('closeModal');
const cancelBlog = document.getElementById('cancelBlog');
const blogForm = document.getElementById('blogForm');
const modalTitle = document.getElementById('modalTitle');
const imageUpload = document.getElementById('imageUpload');
const blogImage = document.getElementById('blogImage');

// Show modal
function showModal(title = 'Create New Blog') {
    modalTitle.textContent = title;
    blogModal.classList.remove('hidden');
    blogModal.classList.add('flex');
}

// Hide modal
function hideModal() {
    blogModal.classList.add('hidden');
    blogModal.classList.remove('flex');
    blogForm.reset();
    currentBlogId = null;
    // Clear the file input
    if (imageUpload) {
        imageUpload.value = '';
    }
}

// Convert File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Handle image upload
imageUpload?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            const base64Image = await fileToBase64(file);
            blogImage.value = base64Image;
        } catch (error) {
            console.error('Error converting image:', error);
            alert('Error uploading image. Please try again.');
        }
    }
});

// Create blog card
function createBlogCard(blog) {
    return `
        <div class="bg-dark p-6 rounded-lg shadow-neon">
            ${blog.image ? `
                <div class="relative w-full mb-4 rounded-lg overflow-hidden">
                    <img src="${blog.image}" 
                         alt="${blog.title}" 
                         class="w-full h-full object-cover"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x200?text=No+Image+Available';">
                </div>
            ` : `
                <div class="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img src="https://via.placeholder.com/400x200?text=No+Image+Available" 
                         alt="No image available" 
                         class="w-full h-full object-cover">
                </div>
            `}
            <h3 class="text-xl font-bold text-neon mb-2">${blog.title}</h3>
            <p class="text-neon mb-4">${blog.content.substring(0, 150)}...</p>
            <div class="flex justify-between items-center">
                <span class="text-neon">${new Date(blog.date).toLocaleDateString()}</span>
                <div class="space-x-2">
                    <button onclick="editBlog(${blog.id})" class="text-neon hover:text-white" title="Edit blog post">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBlog(${blog.id})" class="text-neon hover:text-white" title="Delete blog post">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Display blogs
function displayBlogs() {
    if (blogPosts) {
        blogPosts.innerHTML = blogs.map(blog => createBlogCard(blog)).join('');
    }
}

// Create new blog
createBlogBtn?.addEventListener('click', () => {
    showModal();
});

// Close modal
closeModal?.addEventListener('click', hideModal);
cancelBlog?.addEventListener('click', hideModal);

// Handle form submission
blogForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('blogTitle').value;
    const image = document.getElementById('blogImage').value;
    const content = document.getElementById('blogContent').value;

    if (currentBlogId !== null) {
        // Update existing blog
        blogs = blogs.map(blog => 
            blog.id === currentBlogId 
                ? { ...blog, title, image, content, date: new Date().toISOString() }
                : blog
        );
    } else {
        // Create new blog
        blogs.push({
            id: Date.now(),
            title,
            image,
            content,
            date: new Date().toISOString()
        });
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));
    displayBlogs();
    hideModal();
});

// Edit blog
function editBlog(id) {
    const blog = blogs.find(blog => blog.id === id);
    if (blog) {
        currentBlogId = id;
        document.getElementById('blogTitle').value = blog.title;
        document.getElementById('blogImage').value = blog.image || '';
        document.getElementById('blogContent').value = blog.content;
        showModal('Edit Blog');
    }
}

// Delete blog
function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog?')) {
        blogs = blogs.filter(blog => blog.id !== id);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        displayBlogs();
    }
}

// Initial display
displayBlogs();