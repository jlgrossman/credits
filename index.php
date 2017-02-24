<?php
 include_once 'php/utils.php';
 // $user['name'] and $user['id'] are now vars referencing logged in user
 // $isLoggedIn and $isAdmin are now true/false
 // getCredits($connection, $user['id']); returns number of credits or -1 if error
?>
<!DOCTYPE html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Oleo+Script:400,700|Roboto:300,300i,400,400i,700,700i" rel="stylesheet">
  <link rel="stylesheet" href="styles/reset.css" />
  <link rel="stylesheet" href="styles/styles.css" />
  <script src="scripts/util.js"></script>
  <script src="scripts/app.js"></script>
</head>
<body>
  <header>
    <div class="constraint">
      <div class="logo">Best<span class="tagline"> it's better than Bettr</span></div>
      <div class="login-credits"><?php echo ($isLoggedIn ? $user['name']  : 'Login'); ?><span class="credit-count"><?php echo getCredits($connection, $user['id']); ?></span></div>
    </div>
  </header>
  <div class="main-content">
    <div class="constraint">
      <div class="create">
        <form action="">
          <input type="text" placeholder="Bet Title" name="title" />
          <input type="text" placeholder="Minimum Bet" name="min" />
        </form>
      </div>
      <div class="tasks">
        <div class="task">
          <h2>Task Title</h2>
          <p>Perform a task to earn a small amount of credits.</p>
        </div>
        <div class="task">
          <h2>Task Title 2</h2>
          <p>Perform a different type of task to earn a small amount of credits.</p>
        </div>
        <div class="task">
          <h2>Task Title 3</h2>
          <p>Perform a third type of task to earn a small amount of credits.</p>
        </div>
      </div>
      <div class="bets">
        <div class="bet">
          <h2>At what time is Aprille going to arrive?</h2>
        </div>
        <div class="bet">
          <h2>How many projects has Josh left unfinished?</h2>
        </div>
        <div class="bet">
          <h2>What is his power level?</h2>
        </div>
        <div class="bet">
          <h2>What does the fox say?</h2>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <div class="constraint">
      &copy; Best Enterprises <?php echo date("Y"); ?>
    </div>
  </footer>
</body>
