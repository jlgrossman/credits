/// <reference path="utils.ts"/>

ready(function(){

  const OPEN:string = 'open';

  // POPUP ////////////////////////////////
  const $popup:$ = $('.overlay');
  const $popupContent:$ = $popup.find('.popup');
  const $closePopup:$ = $popupContent.find('.close');

  $closePopup.on('click', function(){
    $popup.removeClass(OPEN);
  });

  // SIDE MENU ///////////////////////////
  const $sideMenu:$ = $('.flyout > .constraint');

  function loadTransactions(){
    ajax({
      url: 'php/get-transactions.php',
      params: {
        output: 'json'
      },
      success: function(data){
        if(data.success){
          for(var i in data.transactions){
            var transaction = data.transactions[i];
            $sideMenu.append(
              $('<div>').addClass('transaction').text(
                `${transaction.amount} from ${transaction.from.name} to ${transaction.to.name}`
              ).append(
                $('<div>').addClass('transaction-msg').text(transaction.msg)
              )
            );
          }
        }
      }
    });
  }
  loadTransactions();

  // TRANSFER CREDITS ////////////////////
  const $transferForm:$ = $('.transfer.form');
  const $transferUsername:$ = $transferForm.find('.transfer-name');
  const $transferAmount:$ = $transferForm.find('.transfer-amount');
  const $transferMessage:$ = $transferForm.find('.transfer-message');
  const $transferSubmit:$ = $transferForm.find('.submit');
  const $creditCount:$ = $('.credit-count');

  var transferInProgress = false;

  function transferCredits(){
    if(transferInProgress) return;
    const name:string = $transferUsername.text().trim();
    const amount:number = parseInt($transferAmount.text());
    const msg:string = $transferMessage.text();

    if(name.length && !isNaN(amount)){
      transferInProgress = true;
      ajax({
        url: 'php/transfer-credits.php',
        params: {
          to: name,
          amount: amount,
          msg: msg
        },
        success: function(data){
          $transferAmount.text('');
          transferInProgress = false;
          if(data.success){
            $creditCount.text(parseInt($creditCount.text()) - amount);
          }
        }
      });
    }
  }

  $transferUsername.on('keypress', function(e){
    if(e.keyCode == 13) $transferAmount[0].focus();
  });

  $transferAmount.on('keypress', function(e){
    if(e.keyCode == 13) $transferMessage[0].focus();
  });

  $transferSubmit.on('click', transferCredits);

  // LOGIN /////////////////////////
  const $loginForm:$ = $('.login-form');
  const $loginDisplayName:$ = $loginForm.find('.display-name');
  const $loginUsername:$ = $loginForm.find('.username');
  const $loginSubmit:$ = $loginForm.find('.submit');

  function login(){
   const name:string = $loginDisplayName.text();
   const pw:string = $loginUsername.text();
   console.log(`${name} ${pw}`)
   if(name && pw){
     ajax({
       url:'php/login.php',
       params: {
         name: name,
         pw: pw
       },
       success: function(data){
         if(data.success){
           window.location.reload();
         }
       }
     });
   }
 }

  $loginSubmit.on('click', login);

  $loginDisplayName.on('keypress', function(e){
    if(e.keyCode == 13) $loginUsername[0].focus();
  });

  $loginUsername.on('keypress', function(e){
    if(e.keyCode == 13) login();
  })

  if($loginForm.length) $loginDisplayName[0].focus();

});
