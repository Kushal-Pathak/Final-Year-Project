<?php
// Start the session to access session variables
session_start();
$username = "";
// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    // User is logged in, display the username
    $username = $_SESSION['user_name'];
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" type="text/css" href="style.css?v=1.0" />
    <meta charset="utf-8" />
    <title>DL Simulator</title>
    <link rel="stylesheet" href="bootstrap.min.css" />
</head>

<body>
    <main>

        <!-- -------------------------- NAVBAR ----------------------- -->
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

                        <!-- ----------- FILE DROPDOWN STARTS-------------- -->
                        <li class="nav-item dropdown me-2">
                            <a
                                class="nav-link active dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                File
                            </a>
                            <ul class="dropdown-menu">
                                <?php if ($username): ?>
                                    <li>
                                        <a
                                            id="open_btn"
                                            type="button"
                                            class="nav-link active"
                                            data-bs-toggle="modal"
                                            data-bs-target="#circuit-list-modal">
                                            Open
                                        </a>
                                    </li>

                                    <li class="nav-item">
                                        <a class="nav-link active" id="save_btn" href="#" onclick="saveCircuit()">Save</a>
                                    </li>

                                <?php endif; ?>

                                <li class="nav-item">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept=".json"
                                        style="display: none" />
                                    <a
                                        id="uploadButton"
                                        class="nav-link active"
                                        onclick="uploadCircuit()"
                                        aria-current="page"
                                        href="#">Upload</a>
                                </li>

                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        onclick="downloadCircuit()"
                                        aria-current="page"
                                        href="#">Download</a>
                                </li>
                            </ul>
                        </li>
                        <!-- ----------- FILE DROPDOWN ENDS-------------- -->

                        <li class="nav-item me-2">
                            <a
                                id="clear_btn"
                                onclick="clearSimulation()"
                                class="nav-link active"
                                aria-current="page"
                                href="#">Clear</a>
                        </li>

                        <li class="nav-item me-2">
                            <a
                                id="sim_btn"
                                onclick="simulationMode()"
                                class="nav-link active"
                                aria-current="page"
                                href="#">SIMULATION</a>
                        </li>
                        <li class="nav-item me-2">
                            <a
                                id="ic_btn"
                                onclick="ICMode()"
                                class="nav-link active"
                                aria-current="page"
                                href="#">CHIP</a>
                        </li>

                        <!-- ----------- INFO DROPDOWN STARTS-------------- -->
                        <li class="nav-item dropdown me-2">
                            <a
                                class="nav-link active dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Info
                            </a>
                            <ul class="dropdown-menu">
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="modal"
                                        data-bs-target="#syllabus-modal" href="#">Syllabus</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="modal"
                                        data-bs-target="#about-us-modal" href="#">About</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="modal"
                                        data-bs-target="#help-modal" href="#">Help</a>
                                </li>
                            </ul>
                        </li>
                        <!-- ----------- INFO DROPDOWN ENDS-------------- -->

                        <!-- ----------- ACCOUNT DROPDOWN STARTS-------------- -->
                        <li class="nav-item dropdown me-2">
                            <a
                                class="nav-link active dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <?php if ($username) echo $username;
                                else echo "Account"; ?>
                            </a>
                            <ul class="dropdown-menu">
                                <?php if ($username) { ?>
                                    <li class="nav-item">
                                        <a class="nav-link active" href="logout_process.php">Log Out</a>
                                    </li>
                                <?php } else { ?>
                                    <li class="nav-item">
                                        <a class="nav-link active" href="login.php">Log In</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link active" href="register.php">Register</a>
                                    </li>
                                <?php } ?>
                            </ul>
                        </li>
                        <!-- ----------- ACCOUNT DROPDOWN ENDS-------------- -->

                    </ul>
                </div>
            </div>
        </nav>

        

    </main>
    <script src="bootstrap.bundle.js"></script>
</body>

</html>