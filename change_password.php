<?php
// Start the session to access session variables
session_start();
// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DL Simulator</title>
    <link rel="stylesheet" href="bootstrap.min.css" />
</head>

<body>
    <main>
        <nav
            class="navbar navbar-expand-lg bg-body-tertiary"
            data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.php">DL SIMULATOR</a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item me-2">
                            <a class="nav-link active" aria-current="page" href="index.php">Simulator</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <form
                        onsubmit="validate(event)"
                        action="change_password_process.php"
                        method="post"
                        id="loginForm"
                        class="p-4 border rounded shadow">
                        <h3 class="text-center mb-4">Change Your Password</h3>
                        <div class="mb-3">
                            <label for="old-password" class="form-label">Old Password</label>
                            <input
                                type="password"
                                class="form-control"
                                id="old-password"
                                name="old_password" />
                        </div>
                        <div class="mb-3">
                            <label for="new-password" class="form-label">New Password</label>
                            <input
                                type="password"
                                class="form-control"
                                id="new-password"
                                name="new_password" />
                        </div>
                        <div class="mb-3">
                            <label for="confirm-new-password" class="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                class="form-control"
                                id="confirm-new-password"
                                name="confirm_new_password" />
                        </div>
                        <button type="submit" class="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>
    <script src="bootstrap.bundle.js"></script>
    <script src="validate_change_password.js"></script>
</body>

</html>