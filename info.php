<?php
$source = isset($_GET['source']) ? urldecode($_GET['source']) : "";
$msg = isset($_GET['msg']) ? urldecode($_GET['msg']) : "No problem!";
$btntxt = isset($_GET['btntxt']) ? urldecode($_GET['btntxt']) : "Go back";
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
        <div class="text-center mt-5">
            <h3><?php echo $msg ?></h3>
            <div>
                <a href="<?php echo $source ?>.php"><?php echo $btntxt ?></a>
            </div>
        </div>
    </main>
    <script src="bootstrap.bundle.js"></script>
</body>

</html>