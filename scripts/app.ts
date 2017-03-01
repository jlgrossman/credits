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
  const $transferUsername:$ = $('.transfer-username');
  const $transferAmount:$ = $('.transfer-amount');
  const $creditCount:$ = $('.credit-count');

  var transferInProgress = false;

  function transferCredits(){
    if(transferInProgress) return;
    const name : string = $transferUsername.text().trim();
    const amount : number = parseInt($transferAmount.text());

    if(name.length && !isNaN(amount)){
      transferInProgress = true;
      ajax({
        url: 'php/transfer-credits.php',
        params: {
          to: name,
          amount: amount
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
    if(e.keyCode == 13 && $transferUsername.text().trim().length) transferCredits();
  });

});
