/**
 * Function to generate a post card with a comment section
 * @param {string} post_username - Username of the poster
 * @param {string} post_id - Unique ID of the post
 * @param {string} post_date - Date of the post
 * @param {string} post_title - Title of the post
 * @param {string} post_description - Description of the post
 * @returns {HTMLElement} - The generated content wrapper containing the post and comment section
 */

let editor = {
  enabled: false,
  post_id: null,
  post_title: null,
  post_description: null,
  comment_id: null,
  comment_description: null,
};
function appendNewPost(
  root,
  post_id,
  post_title,
  post_description,
  user_id,
  post_username,
  post_date,
  circuit_id,
  post_likes,
  mutable,
  liked
) {
  const rootElement = document.querySelector(root);
  if (!rootElement) {
    console.error(`Root element not found.`);
    return;
  }

  // Create the HTML structure using template literals
  const contentWrapperHTML = `
    <div class="content-wrapper" id="post-${post_id}">
      <div class="post-card">
        <div class="post-title">${post_title}</div>
        <div class="post-meta">Posted by <strong>${post_username}</strong> on ${post_date}</div>
        <div class="post-description">${post_description}</div>
        <div class="mb-1" id="like-count-${post_id}">${post_likes}</div>
        <div class="post-actions d-flex justify-content-start">
        <i class="bi bi-hand-thumbs-up${
          liked ? `-fill` : ``
        } me-4" title="Like" id="like-button-${post_id}">
        </i>
        <i class="bi bi-arrow-down-left-square me-4" id="fork-button-${post_id}" title="Fork"></i>
        <i class="bi bi-chat-left me-4" title="Comment" id="comment-button-${post_id}" data-comment-section="comment-section-${post_id}"></i>
        ${
          mutable
            ? `
            <i class="bi bi-pencil me-4" title="Edit" id="edit-button-${post_id}"></i>
            <i class="bi bi-trash me-4" title="Delete" id="delete-button-${post_id}"></i>
            `
            : ``
        }
        </div>
      </div>
      <div class="comment-section" id="comment-section-${post_id}">
        <div class="comment-box mb-3">
          <textarea id="comment-input-${post_id}" placeholder="Write your comment here..."></textarea>
          <button class="btn btn-outline-light btn-sm submit-comment-btn" id="submit-comment-button-${post_id}">
            Post Comment
          </button>
        </div>
        <div class="comments-list" id="comments-list-${post_id}"></div>
      </div>
    </div>
    <div class="separator"></div>
    
  `;

  // Insert the HTML structure into the DOM
  rootElement.insertAdjacentHTML("beforeend", contentWrapperHTML);

  // Add event listeners for buttons
  const likeBtn = document.getElementById(`like-button-${post_id}`);
  const likeCount = document.getElementById(`like-count-${post_id}`);
  likeBtn.addEventListener("click", () => {
    toggleLike(post_id, likeBtn, likeCount);
  });
  const forkButton = document.getElementById(`fork-button-${post_id}`);
  forkButton.addEventListener("click", () => {
    forkCircuit(post_id);
  });

  const commentButton = document.querySelector(`#comment-button-${post_id}`);
  const commentList = document.getElementById(`comments-list-${post_id}`);
  commentButton.addEventListener("click", () => {
    rowOffset.comment = 0;
    rowOffset.comment_end = false;
    const commentSectionId = `comment-section-${post_id}`;
    commentList.innerHTML = "";
    const newFetch = toggleVisibility(commentSectionId);
    if (newFetch) {
      fetchComments(post_id).then((comments) => {
        comments.forEach((comment) => {
          appendNewComment(
            `#comments-list-${post_id}`,
            comment.first_name,
            comment.comment_description,
            comment.comment_id,
            comment.mutable,
            comment.post_id
          );
        });
      });
    }
  });

  commentList.addEventListener("scroll", async () => {
    if (!rowOffset.comment_end && endOfScrollDetected(commentList)) {
      rowOffset.comment += 4;
      try {
        const comments = await fetchComments(post_id);
        comments.forEach((comment) => {
          appendNewComment(
            `#comments-list-${post_id}`,
            comment.first_name,
            comment.comment_description,
            comment.comment_id,
            comment.mutable,
            comment.post_id
          );
        });
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    }
  });

  const submitCommentButton = document.querySelector(
    `#submit-comment-button-${post_id}`
  );
  const commentInput = document.getElementById(`comment-input-${post_id}`);
  submitCommentButton.addEventListener("click", async () => {
    const cmt_txt = commentInput.value;
    commentInput.value = "";
    const result = await addNewComment(cmt_txt, post_id);
  });

  // Add event listeners for Edit and Delete buttons if mutable
  if (mutable) {
    const editButton = document.getElementById(`edit-button-${post_id}`);
    const deleteButton = document.getElementById(`delete-button-${post_id}`);

    if (editButton) {
      editButton.addEventListener("click", () => {
        editor.enabled = true;
        editor.post_id = post_id;
        editor.post_title = post_title;
        editor.post_description = post_description;
        forkButton.click();
        document
          .querySelectorAll(".post-editor-btns")
          .forEach((el) => (el.style.display = "block"));
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", (btn = deleteButton) => {
        const deleted = deletePost(post_id);
        if (deleted) {
          const parent = deleteButton.parentElement.parentElement.parentElement;
          const nextSeparator = parent.nextElementSibling;
          parent.remove();
          if (nextSeparator) nextSeparator.remove();
        }
      });
    }
  }
}

async function addNewPost(post_title, post_description) {
  let uri = "add_post.php";
  if (mode === IC) {
    chip.name = post_title;
    try {
      minifyChip();
      encapsulateComponents();
    } catch (err) {
      console.log(err);
    }
  }
  if (!gates.length) {
    notify("Can't post, canvas is empty!");
    console.error("Canvas is empty!");
    return;
  }
  if (!post_title) {
    notify("Can't post, title is empty!");
    console.error("Title is empty!");
    return;
  }
  if (!post_description) {
    notify("Can't post, description is empty!");
    console.error("Description is empty!");
    return;
  }
  let postData = {
    post_title: post_title,
    post_description: post_description,
    circuit: serializeCircuit(gates),
  };
  if (editor.enabled) {
    uri = "edit_post.php";
    postData.post_id = editor.post_id;
  }

  try {
    // Send POST request to add_comment.php
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    const msg = data.message;
    notify(msg);
    // Handle the response
    if (data.status === "success") {
      document.querySelector("#cancel-edit-btn").click();
      return true; // Indicate success
    } else {
      console.error("Add post failed:", data.message);
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Error posting:", error);
    return false; // Indicate failure
  }
}

const postTitle = document.getElementById("post-title");
const postDescription = document.getElementById("post-description");
const postBtn = document.getElementById("post-btn");
postBtn.addEventListener("click", () => {
  addNewPost(postTitle.value, postDescription.value);
  document.getElementById("add-post-btn-close").click();
  document.getElementById("post-title").value = "";
  document.getElementById("post-description").value = "";
});

const continue_edit = document.querySelector("#continue-edit-btn");
const cancel_edit = document.querySelector("#cancel-edit-btn");
if (continue_edit) {
  continue_edit.addEventListener("click", () => {
    document.querySelector("#open-add-post").click();
    document.querySelector("#post-title").value = editor.post_title;
    document.querySelector("#post-description").value = editor.post_description;
  });
}
if (cancel_edit) {
  cancel_edit.addEventListener("click", () => {
    editor.enabled = false;
    editor.post_title = "";
    editor.post_description = "false";
    continue_edit.parentElement.style.display = "none";
    cancel_edit.parentElement.style.display = "none";
  });
}

function deletePost(post_id) {
  fetch("delete_post.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify({ post_id }), // Send the post_id in the request body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((data) => {
      if (data.status === "success") {
        const msg = data.message;
        notify(msg);
      } else {
        console.error("Error deleting post:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error); // Log any errors
    });
  return true;
}

function toggleLike(post_id, likeBtn, likeCount) {
  fetch("like_post.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        likeCount.textContent = data.total_likes;
        if (data.action === "liked") {
          likeBtn.className = "bi bi-hand-thumbs-up-fill me-4";
        } else if (data.action === "unliked") {
          likeBtn.className = "bi bi-hand-thumbs-up me-4";
        }
        return data;
      } else {
        console.error("Error:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function notify(msg) {
  document.getElementById("notification").innerText = msg;
  bootstrap.Toast.getOrCreateInstance(toastLiveExample).show();
}
