/**
 * Function to generate and append a comment item to a root element
 * @param {string} rootElementId - The ID of the root element to append the comment to
 * @param {string} comment_user - Username of the commenter
 * @param {string} comment_text - The text of the comment
 */
function appendNewComment(
  root,
  comment_user,
  comment_text,
  comment_id,
  mutable,
  post_id
) {
  const rootElement = document.querySelector(root);
  if (!rootElement) {
    console.error(`${root}: Root element not found.`);
    return;
  }
  const commentHTML = `
    <div class="comments-list">
      <div class="comment-item d-flex justify-content-between align-items-center">
        <div class="text-wrap overflow-auto">
          <span class="comment-username w-100">${comment_user}</span>
          ${comment_text}
        </div>
      <div class="ms-3">
      ${
        mutable
          ? `
        <i class="bi bi-pencil me-2" title="Edit" id="edit-${comment_id}"></i>
        <i class="bi bi-trash" title="Delete" id="delete-${comment_id}"></i>
        `
          : ""
      }
      </div>
    </div>
  </div>
`;

  rootElement.insertAdjacentHTML("beforeend", commentHTML);

  const edit_comment_btn = document.getElementById(`edit-${comment_id}`);
  const delete_comment_btn = document.getElementById(`delete-${comment_id}`);
  if (edit_comment_btn)
    edit_comment_btn.addEventListener("click", () => {
      editor.enabled = true;
      editor.comment_description = comment_text;
      editor.comment_id = comment_id;
      const commentInput = document.getElementById(`comment-input-${post_id}`);
      commentInput.value = comment_text;
      commentInput.focus();
    });
  if (delete_comment_btn)
    delete_comment_btn.addEventListener("click", () => {
      deleteComment(comment_id);
    });
}

// Function to toggle visibility of an element
function toggleVisibility(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element not found.`);
    return false;
  }

  // Toggle the display style
  if (element.style.display === "none" || element.style.display === "") {
    element.style.display = "block"; // Show the element
    return true;
  } else {
    element.style.display = "none"; // Hide the element
    return false;
  }
}

async function addNewComment(cmt_txt, post_id) {
  let uri = "add_comment.php";
  comment_data = { comment_description: cmt_txt };
  if (editor.enabled) {
    uri = "edit_comment.php";
    comment_data.comment_id = editor.comment_id;
  } else {
    comment_data.post_id = post_id;
  }
  try {
    // Validate input
    if (!cmt_txt.trim()) {
      notify("Can't comment, comment is empty!")
      console.error("Comment text cannot be empty.");
      return;
    }

    // Send POST request to add_comment.php
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment_data),
    });

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    const msg = data.message;
    notify(msg);
    editor.enabled = false;
    // Handle the response
    if (data.status === "success") {
      return true; // Indicate success
    } else {
      console.error("Comment post failed:", data.message);
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    return false; // Indicate failure
  }
}

async function fetchComments(post_id) {
  try {
    const response = await fetch("fetch_comments.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id, comment_offset: rowOffset.comment }), // Send the post_id in the request body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Assuming the response is in JSON format

    if (data.status === "success") {
      // Process and return comments
      const comments = data.comments;
      if (comments.length === 0) rowOffset.comment_end = true;
      return comments; // Return comments if needed
    } else {
      console.error(`Error fetching comments: ${data.message}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

function deleteComment(comment_id) {
  fetch("delete_comment.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment_id }), // Use the parameter in the request body
  })
    .then((response) => response.json())
    .then((data) => {
      notify(data.message);
    })
    .catch((error) => console.error("Error:", error));
}
