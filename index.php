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
  <link rel="icon" href="dls-icon.png" type="image/png">
  <link rel="stylesheet" type="text/css" href="style.css?v=1.0" />
  <link rel="stylesheet" type="text/css" href="./font/bootstrap-icons.css?v=1.0" />
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

            <!-- ----------- FORUMS DROPDOWN STARTS-------------- -->
            <?php if ($username) { ?>
              <li class="nav-item dropdown me-2">
                <a
                  class="nav-link active dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Forums
                </a>
                <ul class="dropdown-menu">
                  <li class="nav-item">
                    <a class="nav-link active" id="open-add-post" data-bs-toggle="modal"
                      data-bs-target="#add-post-modal" href="#">Add Post</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" id="open-my-posts" data-bs-toggle="modal"
                      data-bs-target="#forums-modal" href="#">My Posts</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" id="open-forum-posts" data-bs-toggle="modal"
                      data-bs-target="#forums-modal" href="#">Forum Posts</a>
                  </li>
                </ul>
              </li>
            <?php } ?>
            <!-- ----------- FORUMS DROPDOWN ENDS-------------- -->
            <li class="active me-2 post-editor-btns">
              <button class="btn btn-outline-primary btn-sm" id="continue-edit-btn">Continue Editing</button>
            </li>
            <li class="active me-2 post-editor-btns">
              <button class="btn btn-outline-danger btn-sm" id="cancel-edit-btn">Cancel Editing</button>
            </li>


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
                    <a class="nav-link active" href="change_password.php">Change Password</a>
                  </li>
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

    <!-- ----------------------- CIRCUIT LIST MODAL STARTS ------------------------ -->
    <div
      class="modal fade"
      id="circuit-list-modal"
      tabindex="-1">
      <div class="modal-dialog modal-md modal-dialog-scrollable">
        <div class="modal-content circuit-list-modal-content bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Open Saved Circuits
            </h1>
            <button
              type="button"

              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body circuit-list-modal-body" id="scrollable">
            <div id="modal-list">
            </div>
          </div>
          <div class="modal-footer">
            <button
              id="btn-close"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ----------------------- CIRCUIT LIST MODAL ENDS ------------------------ -->

    <!-- ---------------- ABOUT US MODAL STARTS ----------------------- -->
    <div class="modal fade modal-lg" id="about-us-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="circuit-list-title">
              About Simulator
            </h1>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body about-us-help-modal-body">
            <p>
              Thank you for choosing our Digital Logic Simulator, a versatile and user-friendly platform for designing, simulating, and experimenting with digital circuits.
              This tool is ideal for students, teachers, and digital logic enthusiasts. Whether you're learning the basics or working on advanced projects, our simulator offers
              everything you need to bring your ideas to life.
            </p>

            <h2>Features</h2>
            <h3>Circuit Design and Simulation</h3>
            <ul>
              <li>Build digital logic circuits with ease using drag-and-drop functionality.</li>
              <li>Simulate circuits in real time to observe their behavior and debug issues.</li>
            </ul>

            <h3>Integrated Chip Components</h3>
            <ul>
              <li>Combine circuits into reusable single-chip components, enabling modular design and scalability.</li>
            </ul>

            <h3>File Management</h3>
            <ul>
              <li>Download simulation files to share your work or keep local backups.</li>
              <li>Upload previously saved files to continue working on your circuits seamlessly.</li>
            </ul>

            <h3>Cloud Storage</h3>
            <ul>
              <li>Register and log in to save your simulations in the cloud.</li>
              <li>Access your designs from any device, anywhere, anytime.</li>
            </ul>

            <h3>Educational Support</h3>
            <ul>
              <li>A valuable learning tool for students to explore digital logic concepts interactively.</li>
              <li>Teachers can use it to create engaging lessons and demonstrations.</li>
              <li>Enthusiasts can experiment with innovative designs and test ideas.</li>
            </ul>

            <h3>User Accounts</h3>
            <ul>
              <li>Create a personal account to manage your simulations and settings.</li>
              <li>Save progress, organize projects, and retrieve them with ease.</li>
            </ul>

            <h3>Compatibility</h3>
            <ul>
              <li>Works on any modern web browser—no installation required.</li>
              <li>Fully responsive design ensures smooth usage on desktops, tablets, and smartphones.</li>
            </ul>

            <h2>Benefits</h2>
            <ul>
              <li><strong>Learn by Doing:</strong> Experiment with real-world digital logic concepts.</li>
              <li><strong>Collaborate and Share:</strong> Easily share designs with classmates, instructors, or colleagues.</li>
              <li><strong>Enhance Creativity:</strong> Test complex ideas in a risk-free environment.</li>
              <li><strong>Save Time:</strong> Focus on design and learning without worrying about setup or installation.</li>
            </ul>

            <h2 id="faq">FAQs</h2>
            <h3>1. Do I need to install anything to use the simulator?</h3>
            <p>No, the simulator works entirely in your web browser. Just visit the website and start designing!</p>

            <h3>2. Can I use the simulator on my phone or tablet?</h3>
            <p>Yes, the simulator is fully responsive and works on all modern devices, including desktops, tablets, and smartphones.</p>

            <h3>3. What file formats are supported for uploading/downloading simulations?</h3>
            <p>Simulations are saved and loaded in a compatible file format that ensures easy sharing and reusability.</p>

            <h3>4. How secure is my data in the cloud?</h3>
            <p>We prioritize user data security. All saved designs are encrypted and accessible only to you.</p>

            <h3>5. Is the simulator free to use?</h3>
            <p>Basic features are free, but advanced features may require a subscription (in future).</p>

            <h2>Contact Support</h2>
            <p>If you have any questions, need assistance, or want to report an issue, feel free to reach out to us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:kushalpathak80@gmail.com">kushalpathak80@gmail.com</a></li>
              <li><strong>Phone:</strong> +977 9812209974</li>
              <li><strong>Support Hours:</strong> Sunday to Thursday, 9:00 AM - 5:00 PM (KTM)</li>
              <li><strong>FAQs:</strong> Visit our <a href="#faq">FAQ section</a> for quick answers.</li>
              <li><strong>Community Forum:</strong> Join the discussion and find solutions in our <a href="https://kushalpathak.com.np" target="_blank">Community Forum</a>.</li>
            </ul>
            <p>We’re here to help you get the most out of the Digital Logic Simulator!</p>

            <h2>Start Your Journey in Digital Logic Design Today!</h2>
            <p>
              Explore, design, simulate, and innovate. The possibilities are endless!
            </p>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ---------------- ABOUT US MODAL ENDS ----------------------- -->

    <!-- ---------------- HELP MODAL STARTS ----------------------- -->
    <div class="modal fade modal-lg" id="help-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="help-title">
              Help Center
            </h1>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body about-us-help-modal-body">
            <p>
              Welcome to the Help Center! Find quick guides, FAQs, and tips to make the most of the Digital Logic Simulator. Still stuck? Contact our support team—we’re here to help!
              <br>
              Happy Simulating!
            </p>
            <h2>Quick Start Guide</h2>
            <ul>
              <li>Click <strong>"Clear"</strong> to create a blank circuit design.</li>
              <li>Drag and drop components (e.g., AND, OR gates) onto the canvas.</li>
              <li>Connect components by dragging wires from source to target node.</li>
              <li>Simulation runs automatically.</li>
              <li>Observe the circuit behavior in real time.</li>
            </ul>
            <h2>Common Features</h2>
            <ul>
              <li>Add or delete components effortlessly.</li>
              <li>Connect or disconnect wires between components.</li>
              <li>Use switches to toggle signals (0/1).</li>
              <li>Split signals with the node component.</li>
              <li>Encapsulate circuits into single-chip components with input and output pins.</li>
              <li>Download or upload your simulations for easy sharing.</li>
              <li>Register and log in to access advanced features.</li>
              <li>Save simulations to the cloud or load them anytime.</li>
              <li>Drag, move, and organize components seamlessly.</li>
              <li>Explore digital logic concepts in our <strong>Syllabus</strong> section.</li>
            </ul>
            <h2 id="faq">FAQ</h2>
            <div>
              <h3>1. How do I add or delete components?</h3>
              <ul>
                <li><strong>To add components:</strong> Drag the desired component (e.g., AND gate, OR gate) from the gate menu onto the canvas.</li>
                <li><strong>To delete components:</strong> Mousepress on the component on the canvas and press the <strong>X</strong> key.</li>
              </ul>

              <h3>2. How do I connect or disconnect wires between components?</h3>
              <ul>
                <li><strong>To connect wires:</strong> Drag from the output node of one component to the input node of another.</li>
                <li><strong>To disconnect wires:</strong> Mousepress on target node and press <strong>D</strong> key.</li>
              </ul>

              <h3>3. How do I use switches to toggle signals (0/1)?</h3>
              <ul>
                <li>Add a <strong>Switch</strong> component from the gate menu.</li>
                <li>Click the switch on the canvas to toggle its state between <strong>0</strong> and <strong>1</strong>.</li>
              </ul>

              <h3>4. How do I split signals using the node component?</h3>
              <ul>
                <li>Drag the <strong>Node</strong> component onto the canvas.</li>
                <li>Connect the output of a signal source to the node.</li>
                <li>Drag from node to multiple inputs to distribute the signal to different components.</li>
              </ul>

              <h3>5. How do I encapsulate a circuit into a single-chip component?</h3>
              <ul>
                <li>Click <strong>CHIP</strong> in the navigation bar to enter IC mode.</li>
                <li>An empty chip structure with an area of input pins, a circuit area, and an area of output pins will appear.</li>
                <li>Drag and drop nodes into the input pin area.</li>
                <li>Create a circuit or load an existing circuit/chip into the circuit area.</li>
                <li>Drag and drop nodes into the output pin area.</li>
                <li>Connect input pins to the circuit's input nodes.</li>
                <li>Connect the circuit's output nodes to the output pins.</li>
                <li>Save or download the chip from <strong>File</strong> menu.</li>
              </ul>

              <h3>6. How do I download or upload simulations?</h3>
              <ul>
                <li><strong>To download:</strong> Go to the <strong>File</strong> menu and click the <strong>Download</strong> button to save your simulation as a file.</li>
                <li><strong>To upload:</strong> Go to the <strong>File</strong> menu, click the <strong>Upload</strong> button, select your saved file, and it will load onto the canvas.</li>
              </ul>

              <h3>7. How do I register and log in?</h3>
              <ul>
                <li>Click the <strong>Account</strong> menu, select the <strong>Register</strong> button, and fill in the required details to create an account.</li>
                <li>Log in using your credentials via the <strong>Login</strong> button under the <strong>Account</strong> menu.</li>
              </ul>


              <h3>8. How do I save or load simulations in/from the cloud?</h3>
              <ul>
                <li><strong>To save to the cloud:</strong> After logging in, go to the <strong>File</strong> menu, click the <strong>Save</strong> button, and name your simulation.</li>
                <li><strong>To load from the cloud:</strong> Go to the <strong>File</strong> menu, click the <strong>Open</strong> button, select your saved simulation from the list, and it will load onto the canvas.</li>
              </ul>

              <h3>9. How do I move and organize components?</h3>
              <ul>
                <li>Click and drag components to reposition them on the canvas.</li>
                <li>Select multiple components by clicking and dragging in an open area to create a selection box.</li>
              </ul>

              <h3>10. How do I explore digital logic concepts?</h3>
              <ul>
                <li>Visit the <strong>Syllabus</strong> section in the menu.</li>
                <li>Access curated topics, interactive examples, and tutorials to enhance your understanding of digital logic.</li>
              </ul>
            </div>

            <h2>Keyboard Shortcuts</h2>
            <p>Use these shortcuts to quickly interact with the simulator:</p>
            <ul>
              <li><strong>1 + Mouse Click:</strong> Add an OR gate.</li>
              <li><strong>2 + Mouse Click:</strong> Add an AND gate.</li>
              <li><strong>3 + Mouse Click:</strong> Add a NOT gate.</li>
              <li><strong>4 + Mouse Click:</strong> Add a NOR gate.</li>
              <li><strong>5 + Mouse Click:</strong> Add a NAND gate.</li>
              <li><strong>6 + Mouse Click:</strong> Add an XOR gate.</li>
              <li><strong>S + Mouse Click:</strong> Add a switch.</li>
              <li><strong>N + Mouse Click:</strong> Add a node.</li>
              <li><strong>X + Mouse Click:</strong> Delete the selected component.</li>
              <li><strong>D + Mouse Click:</strong> Disconnect the target with source node.</li>
            </ul>
            <p>These shortcuts make adding and managing components faster and more efficient!</p>

            <h2>Contact Support</h2>
            <p>If you have any questions, need assistance, or want to report an issue, feel free to reach out to us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:kushalpathak80@gmail.com">kushalpathak80@gmail.com</a></li>
              <li><strong>Phone:</strong> +977 9812209974</li>
              <li><strong>Support Hours:</strong> Sunday to Thursday, 9:00 AM - 5:00 PM (KTM)</li>
              <li><strong>FAQs:</strong> Visit our <a href="#faq">FAQ section</a> for quick answers.</li>
              <li><strong>Community Forum:</strong> Join the discussion and find solutions in our <a href="https://kushalpathak.com.np" target="_blank">Community Forum</a>.</li>
            </ul>
            <p>We’re here to help you get the most out of the Digital Logic Simulator!</p>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ---------------- HELP MODAL ENDS ----------------------- -->

    <!-- ---------------- ADD POST MODAL STARTS ----------------------- -->
    <div class="modal fade modal-lg" id="add-post-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="add-post-title">
              Add Post
            </h1>
            <button
              id="add-post-btn-close"
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body about-us-help-modal-body">
            <div class="add-post-container">
              <div class="mb-3">
                <label for="post-title" class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  id="post-title"
                  placeholder="Enter the title" />
              </div>
              <div class="mb-3">
                <label for="post-description" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="post-description"
                  rows="4"
                  placeholder="Enter the description"></textarea>
              </div>
              <button class="btn btn-outline-light w-100" id="post-btn">ADD POST</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ---------------- ADD POST MODAL ENDS ----------------------- -->

    <!-- ---------------- FORUM POSTS MODAL STARTS ----------------------- -->
    <div class="modal fade modal-md" id="forums-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="forums-title">
              FORUMS
            </h1>
            <button
              type="button"
              class="btn-close btn-close-white"
              id="forums-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body about-us-help-modal-body" id="scrollable_forum">
            <div class="container" id="post-root">

            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ---------------- FORUMS MODAL ENDS ----------------------- -->

    <!-- ---------------- SYLLABUS MODAL STARTS ----------------------- -->
    <div class="modal fade modal-xl" id="syllabus-modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="help-title">
              Learn Digital Logic
            </h1>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body about-us-help-modal-body">

            <!-- ---------------------- MICRO SYLLABUS STARTS -------------------------------- -->
            <h3><a href="#s-1" id="combinational-circuits"><strong>1. Combinational Circuits</strong></a></h3>
            <ul>
              <li>
                <a href="#s-1.1" id="intro-combinational"><strong>1.1 Introduction to Combinational Logic</strong></a>
                <ul>
                  <li><a href="#s-1.1.1" id="definition-combinational">1.1.1 Definition and Characteristics</a></li>
                  <li><a href="#s-1.1.2" id="difference-combinational-sequential">1.1.2 Difference Between Combinational and Sequential Circuits</a></li>
                </ul>
              </li>
              <li>
                <a href="#s-1.2" id="basic-circuits"><strong>1.2 Basic Circuits</strong></a>
                <ul>
                  <li><a href="#s-1.2.1" id="adders">1.2.1 Adders: Half Adder, Full Adder</a></li>
                  <li><a href="#s-1.2.2" id="subtractors">1.2.2 Subtractors: Half Subtractor, Full Subtractor</a></li>
                  <li><a href="#s-1.2.3" id="mux">1.2.3 Multiplexers (MUX)</a></li>
                  <li><a href="#s-1.2.4" id="demux">1.2.4 Demultiplexers (DEMUX)</a></li>
                  <li><a href="#s-1.2.5" id="decoders">1.2.5 Decoders</a></li>
                  <li><a href="#s-1.2.6" id="encoders">1.2.6 Encoders</a></li>
                </ul>
              </li>
              <li>
                <a href="#s-1.3" id="simplification"><strong>1.3 Simplification Techniques</strong></a>
                <ul>
                  <li><a href="#s-1.3.1" id="karnaugh-maps">1.3.1 Karnaugh Maps (K-Maps)</a></li>
                  <li><a href="#s-1.3.2" id="truth-tables">1.3.2 Truth Tables and Boolean Expression Simplification</a></li>
                </ul>
              </li>
            </ul>

            <h3><a href="#s-2" id="sequential-circuits"><strong>2. Sequential Circuits</strong></a></h3>
            <ul>
              <li>
                <a href="#s-2.1" id="intro-sequential"><strong>2.1 Introduction to Sequential Logic</strong></a>
                <ul>
                  <li><a href="#s-2.1.1" id="definition-sequential">2.1.1 Definition and Characteristics</a></li>
                  <li><a href="#s-2.1.2" id="clocked-unclocked">2.1.2 Clocked vs. Unclocked Circuits</a></li>
                </ul>
              </li>
              <li>
                <a href="#s-2.2" id="storage-elements"><strong>2.2 Basic Storage Elements</strong></a>
                <ul>
                  <li><a href="#s-2.2.1" id="sr-flipflop">2.2.1 SR Flip-Flop</a></li>
                  <li><a href="#s-2.2.2" id="d-flipflop">2.2.2 D Flip-Flop</a></li>
                  <li><a href="#s-2.2.3" id="jk-flipflop">2.2.3 JK Flip-Flop</a></li>
                  <li><a href="#s-2.2.4" id="t-flipflop">2.2.4 T Flip-Flop</a></li>
                </ul>
              </li>
              <li>
                <a href="#s-2.3" id="registers-counters"><strong>2.3 Registers and Counters</strong></a>
                <ul>
                  <li><a href="#s-2.3.1" id="shift-registers">2.3.1 Types of Registers: Shift Registers</a></li>
                  <li><a href="#s-2.3.2" id="counters">2.3.2 Types of Counters: Synchronous and Asynchronous Counters</a></li>
                </ul>
              </li>
            </ul>
            <!-- ---------------------- MICRO SYLLABUS ENDS -------------------------------- -->

            <!-- ------------------------- SYLLABUS CONTENT STARTS --------------------------------- -->

            <h2 id="s-1">1. Combinational Circuits</h2>
            <p>Combinational circuits are logic circuits whose output depends only on the current input values. They are the building blocks of digital systems and include devices like adders, multiplexers, and encoders.</p>

            <h3 id="s-1.1">1.1 Introduction to Combinational Logic</h3>
            <p>Combinational logic involves circuits where outputs are determined solely by present inputs, without memory or feedback loops. Common examples include arithmetic circuits and data selectors.</p>
            <ul>
              <li id="s-1.1.1"><strong>Definition and Characteristics:</strong> These circuits have no storage element; their behavior is defined by Boolean expressions and truth tables.</li>
              <li id="s-1.1.2"><strong>Difference Between Combinational and Sequential Circuits:</strong> Combinational circuits rely only on inputs, whereas sequential circuits depend on both inputs and previous states.</li>
            </ul>

            <h3 id="s-1.2">1.2 Basic Circuits</h3>
            <p>Basic combinational circuits perform specific logic operations like addition, selection, and encoding of data. They are the foundation for more complex digital systems.</p>
            <ul>
              <li id="s-1.2.1"><strong>Adders:</strong> Half adders and full adders perform binary addition. A half adder adds two bits, while a full adder adds three bits (including carry).</li>
              <li id="s-1.2.2"><strong>Subtractors:</strong> Half and full subtractors handle binary subtraction. A half subtractor operates on two bits, while a full subtractor includes borrow handling.</li>
              <li id="s-1.2.3"><strong>Multiplexers (MUX):</strong> Data selectors that route one of several inputs to a single output based on control signals.</li>
              <li id="s-1.2.4"><strong>Demultiplexers (DEMUX):</strong> Split a single input into multiple outputs based on control signals.</li>
              <li id="s-1.2.5"><strong>Decoders:</strong> Convert binary inputs into distinct output lines, often used in memory addressing.</li>
              <li id="s-1.2.6"><strong>Encoders:</strong> Perform the reverse operation of decoders, converting multiple inputs into a single binary code.</li>
            </ul>

            <h3 id="s-1.3">1.3 Simplification Techniques</h3>
            <p>Simplification techniques are used to reduce the complexity of Boolean expressions, making circuits easier to design, implement, and optimize. These methods help minimize the number of gates and connections required.</p>
            <ul>
              <li id="s-1.3.1"><strong>Karnaugh Maps (K-Maps):</strong> A graphical method for simplifying Boolean expressions by grouping adjacent cells representing minterms to eliminate redundant variables.</li>
              <li id="s-1.3.2"><strong>Truth Tables:</strong> A tabular representation of a Boolean function that lists all possible input combinations and their corresponding outputs.</li>
              <li id="s-1.3.3"><strong>Boolean Algebra:</strong> Use laws and theorems (e.g., De Morgan's laws, distributive law) to algebraically simplify Boolean expressions.</li>
            </ul>


            <h2 id="s-2">2. Sequential Circuits</h2>
            <p>Sequential circuits are logic circuits whose output depends not only on the current inputs but also on the past inputs or previous states. They use memory elements to store state information, making them suitable for more complex operations.</p>

            <h3 id="s-2.1">2.1 Introduction to Sequential Logic</h3>
            <p>Sequential logic involves circuits where outputs depend on both current inputs and past states, achieved through feedback mechanisms. These circuits are commonly used in counters, registers, and memory systems.</p>
            <ul>
              <li id="s-2.1.1"><strong>Definition and Characteristics:</strong> Sequential circuits include memory elements, rely on feedback, and operate synchronously or asynchronously.</li>
              <li id="s-2.1.2"><strong>Clocked vs. Unclocked Circuits:</strong> Clocked circuits use a clock signal to synchronize state changes, while unclocked circuits depend solely on input changes.</li>
            </ul>

            <h3 id="s-2.2">2.2 Basic Storage Elements</h3>
            <p>Storage elements are the foundation of sequential circuits, used to store and transfer data. Flip-flops are the most common type of storage elements.</p>
            <ul>
              <li id="s-2.2.1"><strong>SR Flip-Flop:</strong> A basic flip-flop with Set (S) and Reset (R) inputs to control the stored value.</li>
              <li id="s-2.2.2"><strong>D Flip-Flop:</strong> A data flip-flop that stores the input value (D) at the rising or falling edge of the clock.</li>
              <li id="s-2.2.3"><strong>JK Flip-Flop:</strong> An enhanced flip-flop with toggling capabilities when both J and K inputs are high.</li>
              <li id="s-2.2.4"><strong>T Flip-Flop:</strong> A toggle flip-flop that changes its state with each clock pulse when enabled.</li>
            </ul>

            <h3 id="s-2.3">2.3 Registers and Counters</h3>
            <p>Registers and counters are sequential circuits used for data storage and counting operations. They form the basis for many digital systems.</p>
            <ul>
              <li id="s-2.3.1"><strong>Types of Registers:</strong> Shift registers allow data to be shifted serially or parallelly, enabling data manipulation and transfer.</li>
              <li id="s-2.3.2"><strong>Types of Counters:</strong> Synchronous counters update all flip-flops simultaneously, while asynchronous counters update sequentially based on the previous state.</li>
            </ul>
            <!-- ------------------------- SYLLABUS CONTENT ENDS --------------------------------- -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- ---------------- SYLLABUS MODAL ENDS ----------------------- -->

    <!-- ----------------- TOAST NOTIFICATION STARTS ------------------------- -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-dark text-light">
          <img src="dls-icon.png" width="20px" class="rounded me-2" alt="DLS">
          <strong class="me-auto">DL SIMULATOR</strong>
          <small>1 second ago</small>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body bg-dark text-light" id="notification">
          Circuit saved successfully!
        </div>
      </div>
    </div>
    <!-- ----------------- TOAST NOTIFICATION STARTS ------------------------- -->

  </main>
  <script src="bootstrap.bundle.js"></script>
  <script src="_99p5.min.js"></script>
  <script src="_01constants.js"></script>
  <script src="_02node.js"></script>
  <script src="_03switch.js"></script>
  <script src="_04gate.js"></script>
  <script src="_05chip.js"></script>
  <script src="_06component.js"></script>
  <script src="_07generate_gate.js"></script>
  <script src="_08select_multiple.js"></script>
  <script src="_09download_upload.js"></script>
  <script src="_10helpers.js"></script>
  <script src="_11undo_redo.js"></script>
  <script src="_12optimize.js"></script>
  <script src="_13sketch.js"></script>
  <script src="_14save_load.js"></script>
  <script src="_15delete.js"></script>
  <script src="./ui_components/post.js"></script>
  <script src="./ui_components/comment.js"></script>
  <script src="./ui_components/forum.js"></script>
  <script src="./ui_components/fork.js"></script>
</body>

</html>