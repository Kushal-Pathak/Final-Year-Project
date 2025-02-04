let postOffset = 0; // To track post pagination
let commentOffset = 0; // To track comment pagination
let fetchMyPosts = false; //To track which posts to fetch

async function fetchPost() {
  let uri = "fetch_post.php";
  let rootElement = "#post-root";
  if (fetchMyPosts) {
    uri = "fetch_my_posts.php";
  }
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_offset: rowOffset.post, // Include offset in the request body
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Assuming the response is in JSON format

    // Update the offset for the next fetch if necessary
    if (data.newPostOffset !== undefined) {
      postOffset = data.newPostOffset;
    }

    if (data.newCommentOffset !== undefined) {
      commentOffset = data.newCommentOffset;
    }
    if (data.posts.length === 0) rowOffset.post_end = true;
    // Handle UI updates here, if required
    if (data.posts && data.posts.length > 0) {
      data.posts.forEach((post) => {
        appendNewPost(
          rootElement,
          post.post_id,
          post.post_title,
          post.post_description,
          post.user_id,
          post.first_name,
          post.created_at,
          post.circuit,
          post.post_likes,
          post.mutable,
          post.liked
        );
      });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

// Add event listener after ensuring the element exists
const open_forum_posts = document.querySelector("#open-forum-posts");
if (open_forum_posts) {
  open_forum_posts.addEventListener("click", async () => {
    fetchMyPosts = false;
    rowOffset.post = 0;
    rowOffset.post_end = false;
    document.querySelector("#post-root").innerHTML = "";
    document.querySelector("#forums-title").textContent = "Forums";
    await fetchPost();
  });
} else {
  console.warn("Element #open-forum-posts not found in the DOM.");
}

const open_my_posts = document.querySelector("#open-my-posts");
if (open_my_posts) {
  open_my_posts.addEventListener("click", async () => {
    fetchMyPosts = true;
    rowOffset.post = 0;
    rowOffset.post_end = false;
    document.querySelector("#post-root").innerHTML = "";
    document.querySelector("#forums-title").textContent = "My Posts";
    await fetchPost();
  });
} else {
  console.warn("Element #open-my-posts not found in the DOM.");
}

const scrollableForum = document.getElementById("scrollable_forum");
scrollableForum.addEventListener("scroll", async () => {
  if (!rowOffset.post_end && endOfScrollDetected(scrollableForum)) {
    rowOffset.post += 3;
    try {
      await fetchPost(); // Wait for the posts to be fetched
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  }
});
