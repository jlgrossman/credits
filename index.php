<?php
include_once 'php/utils.php';
// $user['name'] and $user['id'] are now vars referencing logged in user
// $isLoggedIn and $isAdmin are now true/false
// getCredits($user['id']); returns number of credits or -1 if error
?>
<!DOCTYPE html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Oleo+Script:400,700|Roboto:300,300i,400,400i,700,700i" rel="stylesheet">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <link rel="stylesheet" href="styles/styles.css" />
  <script src="scripts/utils.js"></script>
  <script src="scripts/app.js"></script>
  <?php if($isLoggedIn): ?>
    <script>var USER_KEY="<?php echo getKey($user['id'], $user['name']);?>"</script>
  <?php endif; ?>
</head>
<body>
  <div class="site-wrap">
    <div class="flyout">
      <div class="logo">Bettr<span class="tagline"> the better better</span></div>
      <div class="side-menu">
        <ul>
          <li>Menu Items 1</li>
          <li>Menu Items 2</li>
          <li>Menu Items 3</li>
          <li>Menu Items 4</li>
          <li>Menu Items 5</li>
          <li>Menu Items 6</li>
        </ul>
      </div>
    </div>
    <div class="main-wrap">
      <header>
        <div class="constraint">
          <div class="credit-count">
            <?php if($isLoggedIn) : ?>
              <?php echo getCredits($user['id']); ?>
            <?php endif; ?>
          </div>
          <div class="login">
            <?php if($isLoggedIn) : ?>
              Welcome to Bettr, <strong><?php echo $user['name']; ?></strong>
            <?php else : ?>
              Login
            <?php endif; ?>
          </div>
        </div>
      </header>
      <div class="main-content">
        <div class="constraint">
          <div class="create">
            <h1>Welcome to Bettr</h1>
            <h2>Make Your First Bet</h2>
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
              <h2>When will Josh arrive?</h2>
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
    </div>
  </div>
  <div class="overlay">
    <div class="popup">
      <div class="close">X</div>
      <h2>Popup Heading</h2>
      <p>This is where the description of a mini game or something would go. I don't know. Text. Put it here.</p>
    </div>
  </div>
</body>
<?php $connection->close(); ?>
