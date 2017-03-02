<?
include_once 'php/utils.php';
// $user['name'] and $user['id'] are now vars referencing logged in user
// $isLoggedIn and $isAdmin are now true/false
// getCredits($user['id']); returns number of credits or -1 if error
?>
<!DOCTYPE html>
<head>
  <title>Welcome to Bettr</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#278EC0">
  <link href="https://fonts.googleapis.com/css?family=Oleo+Script:400,700|Roboto:300,300i,400,400i,700,700i" rel="stylesheet">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <link rel="stylesheet" href="styles/styles.css" />
  <link rel="icon" sizes="100x100" href="<?=getUserImage($user['id'])?>">
  <script src="scripts/utils.js"></script>
  <script src="scripts/app.js"></script>
</head>
<body>
  <div class="site-wrap">
    <? if($isLoggedIn) : ?>
    <div class="flyout">
      <div class="constraint">
        <div class="logo">Bettr<span class="tagline"> the better better</span></div>
        <div class="side-menu">
          <ul>
            <li data-url="transactions.php">Transactions</li>
            <li data-url="bets.php">Bets</li>
            <li data-url="games.php">Games</li>
            <li data-url="shop.php">Shop</li>
          </ul>
        </div>
        <div class="transactions-container"></div>
      </div>
    </div>
    <div class="main-wrap">
      <header>
        <div class="constraint">
          <div class="credit-count">
            <? if($isLoggedIn) : ?>
              <?= getCredits($user['id']) ?>
            <? endif; ?>
          </div>
            <div class="welcome">
              Welcome to Bettr, <strong><?= $user['name'] ?></strong>
            </div>
        </div>
      </header>
      <div class="main-content">
        <div class="constraint">
          <div class="create">
            <h1>Welcome to Bettr</h1>
            <h2>Transfer Credits</h2>
            <div class="transfer form">
              <input class="transfer-name" type="text" placeholder="Payee's Name" name="payee" />
              <input class="transfer-amount" type="text" placeholder="Credits" name="transfer" />
              <textarea class="transfer-message" name="message" placeholder="Include a message..." maxlength="140"></textarea>
              <input type="submit" class="submit" value="Send" />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div class="constraint">
          &copy; Best Enterprises <?= date("Y") ?>
        </div>
      </footer>
    </div>
  <? else : ?>
    <div class="login">
      <div class="slogan">Sign in to experience</div>
      <h1>Bettr</h1>
      <div class="login-form form">
        <input type="text" name="name" class="display-name" placeholder="Display Name" />
        <input type="text" name="pw" class="username" placeholder="Username" />
        <input type="submit" class="submit" value="Login" />
      </div>
    </div>
  <? endif; ?>
  </div>
  <div class="overlay">
    <div class="popup">
      <div class="close">X</div>
      <h2>Popup Heading</h2>
      <p>This is where the description of a mini game or something would go. I don't know. Text. Put it here.</p>
    </div>
  </div>
</body>

<? $connection->close(); ?>
