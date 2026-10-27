// 1. Get HTML elements
const bookmarkForm = document.getElementById("bookmarkForm");
const siteTitle = document.getElementById("siteTitle");
const siteUrl = document.getElementById("siteUrl");
const editIndex = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formHeader = document.getElementById("formHeader");
const bookmarkList = document.getElementById("bookmarkList");
const emptyBox = document.getElementById("emptyBox");
const countBadge = document.getElementById("countBadge");

// 2. Load bookmarks from sessionStorage (or start with an empty list)
let bookmarks = JSON.parse(sessionStorage.getItem("bookmarks")) || [];

// 3. Render all bookmarks on screen
function displayBookmarks() {
  bookmarkList.innerHTML = "";

  // Update total count badge
  countBadge.textContent = `${bookmarks.length} ${bookmarks.length === 1 ? "Link" : "Links"}`;

  // If list is empty, show empty box
  if (bookmarks.length === 0) {
    emptyBox.classList.remove("d-none");
    return;
  }
  emptyBox.classList.add("d-none");

  // Loop through bookmarks and build cards
  bookmarks.forEach((item, index) => {
    // Extract domain name (e.g. "https://github.com/test" -> "github.com")
    let domain = item.url.replace("https://", "").replace("http://", "").split("/")[0];

    // Google automatic favicon URL
    let iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    bookmarkList.innerHTML += `
      <div class="bookmark-item">
        <!-- Icon & Website Info -->
        <div class="d-flex align-items-center gap-3 overflow-hidden">
          <div class="favicon-box">
            <img src="${iconUrl}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/84/84380.png'">
          </div>
          <div class="text-truncate">
            <a href="${item.url}" target="_blank" class="fw-semibold text-dark text-decoration-none d-block text-truncate">
              ${item.title} <i class="bi bi-arrow-up-right small text-muted"></i>
            </a>
            <span class="text-muted small text-truncate d-block">${domain}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex align-items-center gap-1 ms-2">
          <button onclick="copyLink('${item.url}', this)" class="btn btn-light border action-btn copy-pill text-secondary" title="Copy URL">
            <i class="bi bi-clipboard"></i>
          </button>
          <button onclick="editBookmark(${index})" class="btn btn-light border action-btn text-primary" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button onclick="deleteBookmark(${index})" class="btn btn-light border action-btn text-danger" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
}

// 4. Handle Form Submit (Add or Edit)
bookmarkForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let title = siteTitle.value.trim();
  let url = siteUrl.value.trim();

  // Automatically prepend https:// if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const currentIndex = editIndex.value;

  if (currentIndex === "") {
    // Add new bookmark to top of list
    bookmarks.unshift({ title: title, url: url });
  } else {
    // Update existing bookmark
    bookmarks[currentIndex] = { title: title, url: url };
  }

  // Save changes to browser memory
  sessionStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // Reset form
  cancelEdit();

  // Refresh UI
  displayBookmarks();
});

// 5. Copy link to clipboard
function copyLink(link, btn) {
  navigator.clipboard.writeText(link);

  btn.innerHTML = `<i class="bi bi-check2 text-success"></i>`;
  setTimeout(() => {
    btn.innerHTML = `<i class="bi bi-clipboard"></i>`;
  }, 1200);
}

// 6. Populate form to edit
function editBookmark(index) {
  siteTitle.value = bookmarks[index].title;
  siteUrl.value = bookmarks[index].url;
  editIndex.value = index;

  formHeader.textContent = "Edit Bookmark";
  submitBtn.innerHTML = `<i class="bi bi-check2-circle me-1"></i> Update Bookmark`;
  cancelBtn.classList.remove("d-none");

  siteTitle.focus();
}

// 7. Cancel edit mode
function cancelEdit() {
  bookmarkForm.reset();
  editIndex.value = "";
  formHeader.textContent = "Add a Website";
  submitBtn.innerHTML = `<i class="bi bi-plus-circle me-1"></i> Save Bookmark`;
  cancelBtn.classList.add("d-none");
}

// 8. Delete bookmark
function deleteBookmark(index) {
  if (confirm("Delete this bookmark?")) {
    bookmarks.splice(index, 1);
    sessionStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
  }
}

// Initial render when page loads
displayBookmarks();