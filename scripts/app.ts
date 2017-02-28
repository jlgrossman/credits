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
      params: {key: USER_KEY},
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


});
