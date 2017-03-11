/// <reference path="utils.ts"/>

ready(function(){

  // CSS CLASSES //////////////////////////
  const OPEN:string = 'open';
  const LOADING:string = 'loading';
  const CHANGE:string = 'change';

  // POPUP ////////////////////////////////
  const $popup:$ = $('.overlay');
  const $popupContent:$ = $popup.find('.popup');
  const $closePopup:$ = $popupContent.find('.close');
  const $popupLogout:$ = $popup.find('.popup-content.logout');
  const $logoutButton:$ = $popup.find('button.logout');

  $closePopup.on('click', () => $popup.removeClass(OPEN));

  const $welcomeUsername:$ = $('.welcome-user-name');

  $welcomeUsername.on('click', function(){
    $popup.addClass(OPEN);
    $popupLogout.addClass(OPEN);
  });

  $logoutButton.on('click', function(){
    $logoutButton.addClass(LOADING);
    ajax({
      url: 'php/logout.php',
      success: (data) => data.success && window.location.reload()
    })
  })

  // SIDE MENU ///////////////////////////
  const $transactionsContainer:$ = $('.flyout .transactions-container');
  const $refreshTransactions:$ = $('.flyout .refresh-transactions-btn');

  function loadTransactions(){
    ajax({
      url: 'php/get-transactions.php',
      responseType: 'text',
      success: (data) => $transactionsContainer.html(data)
    });
  }
  loadTransactions();

  $refreshTransactions.on('click', throttle(5000, compose(loadTransactions, updateCreditCount)));

  // TRANSFER CREDITS ////////////////////
  const $transferForm:$ = $('.transfer.form');
  const $transferError:$ = $transferForm.find('.error-msg');
  const $transferUsername:$ = $transferForm.find('.transfer-name');
  const $transferAmount:$ = $transferForm.find('.transfer-amount');
  const $transferMessage:$ = $transferForm.find('.transfer-message');
  const $transferSubmit:$ = $transferForm.find('.submit');
  const $transferCharacterCount:$ = $transferForm.find('.transfer-character-count');
  const $creditCount:$ = $('.credit-count');

  var transferInProgress:boolean = false;

  function updateCreditCount(){
    ajax({
      url: 'php/get-credits.php',
      success: (data) => data.success && $creditCount.text(data.msg)
    })
  }

  function updateTransferCharacterCount(){
    const left:number = 140 - $transferMessage.text().length;
    $transferCharacterCount.text(`${left < 0 ? 0 : left}/140`);
    if(left < 10) $transferCharacterCount.addClass('few-left');
    else $transferCharacterCount.removeClass('few-left');
  }

  function transferCredits(){
    if(transferInProgress) return;
    const name:string = $transferUsername.text().trim();
    const amount:number = parseInt($transferAmount.text());
    const msg:string = $transferMessage.text();

    if(name.length && !isNaN(amount)){
      $transferSubmit.addClass(LOADING);
      transferInProgress = true;
      ajax({
        url: 'php/transfer-credits.php',
        params: {
          to: name,
          amount: amount,
          msg: msg
        },
        success: function(data){
          $transferAmount.add($transferMessage).add($transferUsername).text('');
          updateTransferCharacterCount();
          $transferSubmit.removeClass(LOADING);
          transferInProgress = false;
          if(data.success){
            $creditCount.text(parseInt($creditCount.text()) - amount);
            loadTransactions();
          } else {
            $transferError.text(data.msg).addClass(OPEN);
          }
        }
      });
    }
  }

  $transferUsername.on('keypress', (e) => e.keyCode == 13 && $transferAmount[0].focus());
  $transferAmount.on('keypress', (e) => e.keyCode == 13 && $transferMessage[0].focus());
  $transferSubmit.on('click', transferCredits);
  $transferMessage.on('input', updateTransferCharacterCount);

  // LOGIN/SIGNUP /////////////////////////
  const $loginForm:$ = $('.login-form');
  const $loginError:$ = $loginForm.find('.error-msg');
  const $loginDisplayName:$ = $loginForm.find('.display-name');
  const $loginUsername:$ = $loginForm.find('.username');
  const $loginSubmit:$ = $loginForm.find('.submit');
  const $register:$ = $('.register');
  var isSignup:boolean = false;

  function toggleSignup(){
    $loginSubmit.addClass(CHANGE).delay(250, function(){
      $(this).html(
        (isSignup = !isSignup) ?
        'Sign up' : 'Log in'
      ).removeClass(CHANGE);
    });
  }

  function login(){
   const name:string = $loginDisplayName.text();
   const pw:string = $loginUsername.text();
   if(name && pw){
     $loginSubmit.addClass(LOADING);
     ajax({
       url: isSignup ? 'php/create-login.php' : 'php/login.php',
       params: {
         name: name,
         pw: pw
       },
       success: function(data){
         if(data.success){
           window.location.reload();
         } else {
           $loginSubmit.removeClass(LOADING);
           $loginError.text(data.msg).addClass(OPEN);
         }
       }
     });
   }
 }

  $loginSubmit.on('click', login);
  $loginDisplayName.on('keypress', (e) => e.keyCode == 13 && $loginUsername[0].focus());
  $loginUsername.on('keypress', (e) => e.keyCode == 13 && login());
  $register.on('click', throttle(1000,toggleSignup));

  if($loginForm.length) $loginDisplayName[0].focus();

  // EARN CREDITS ////////////////////////////////
  function earnCredits(){
    if(parseInt($creditCount.text()) < 10){
      ajax({
        url: 'php/earn-credits.php',
        success: (data) => data.success && updateCreditCount()
      })
    }
  }

  var earnCreditsInterval = setInterval(earnCredits, 600000); // 10 min

});
