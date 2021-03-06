/// <reference path="utils.ts"/>

ready(function(){

  // TAB ACTIONS //////////////////////////
  const tabActions:Object = {
    transactions: ()=>null,
    stocks: loadStocks,
    games: ()=>null,
    lottery: compose(loadTickets, loadPot)
  };

  // CSS CLASSES //////////////////////////
  const OPEN:string = 'open';
  const LOADING:string = 'loading';
  const CHANGE:string = 'change';

  // HTML ELEMENTS /////////////////////////
  const $body:$ = $('body');

  // POPUP ////////////////////////////////
  const $popup:$ = $('.overlay');
  const $popupContent:$ = $popup.find('.popup');
  const $closePopup:$ = $popupContent.find('.close');
  const $popupLogout:$ = $popup.find('.popup-content.logout');
  const $logoutButton:$ = $popup.find('button.logout');

  $closePopup.on('click', () => $popup.removeClass(OPEN));

  const $currentUsername:$ = $('.current-user-name');

  $currentUsername.on('click', function(){
    $popup.addClass(OPEN);
    $popupLogout.addClass(OPEN);
  });

  $logoutButton.on('click', function(){
    $logoutButton.addClass(LOADING);
    ajax({
      url: 'php/logout.php',
      success: (data) => data.success && window.location.reload()
    })
  });


  // MESSAGES ///////////////////////////////
  const $messages:$ = $('.messages');
  const $inboxButton:$ = $('.current-user-messages');
  const $inboxContainer:$ = $messages.find('.inbox');
  var inboxOutdated = true;

  function loadMessages(){

  }

  function loadInbox(){
    ajax({
      url: 'php/messages/get-threads.php',
      responseType: 'text',
      success: function(data){
        $inboxContainer.html(data);
        inboxOutdated = false;
        setTimeout(()=>inboxOutdated=true, 60000);
      }
    });
  }

  function loadUnread(){
    ajax({
      url: 'php/messages/get-threads.php',
      params: {
        output: 'json'
      },
      success: function(data){
        $inboxButton.removeClass('unread');
        if(data.success && data.unread > 0) $inboxButton.addClass('unread');
      }
    });
  }

  $inboxButton.on('click', function(){
    $messages.toggleClass(OPEN);
    if($messages.hasClass(OPEN) && inboxOutdated) loadInbox();
  });

  var loadUnreadInterval = setInterval(loadUnread, 300000); // refresh every 5 min
  loadUnread();

  // SIDE MENU ///////////////////////////
  const $transactionsContainer:$ = $('.flyout .transactions-container');
  const $refreshTransactions:$ = $('.flyout .refresh-transactions-btn');
  const $tabButtons:$ = $('.flyout .tab');
  const $tabContents:$ = $('.main-content .tab-content');

  function openTab(tabName?:string){
    if(!tabName) return;
    $tabContents.removeClass(OPEN);
    $(`.main-content .tab-content.${tabName}`).addClass(OPEN);
    cookie('currentTab', tabName);
    tabActions[tabName]();
  }

  function loadTransactions(){
    ajax({
      url: 'php/get-transactions.php',
      responseType: 'text',
      success: (data) => $transactionsContainer.html(data).find('.transaction-user-name').on('click', function(){
        $transferUsername.text($(this).text().trim());
      })
    });
  }

  $refreshTransactions.on('click', throttle(5000, compose(loadTransactions, updateCreditCount)));

  $tabButtons.on('click', function(e){
    const data:string = $(this).data('tab');
    openTab(data);
  });

  loadTransactions();
  $('.side-menu .notification').removeClass(OPEN);
  openTab(cookie('currentTab'));

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

    if(name.length && !isNaN(amount)) {
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
            $transferError.removeClass(OPEN);
            loadTransactions();
          } else {
            $transferError.text(data.msg).addClass(OPEN);
          }
        },
        error: function(data){
          $transferAmount.add($transferMessage).add($transferUsername).text('');
          $transferSubmit.removeClass(LOADING);
          transferInProgress = false;
          $transferError.text('Transfer failed').addClass(OPEN);
        }
      });
    } else {
      $transferError.text('Invalid data').addClass(OPEN);
    }
  }

  $transferUsername.on('keypress', (e) => e.keyCode == 13 && $transferAmount[0].focus());
  $transferAmount.on('keypress', (e) => e.keyCode == 13 && $transferMessage[0].focus());
  $transferSubmit.on('click', transferCredits);
  $transferMessage.on('input', updateTransferCharacterCount);

  const $emojiContainer:$ = $transferForm.find('.emoji-container');
  const $emojis:$ = $emojiContainer.find('li').addClass('emoji');
  const $emojiButton:$ = $transferForm.find('.emoji-btn');

  function closeEmojiContainer(e:Event){
    if(!e || !e.target) return;
    const $target:$ = $(e.target);
    if(!($target.hasClass('emoji-container') || $target.parent().hasClass('emoji-container') || $target.parent().parent().hasClass('emoji-container'))){
      $emojiContainer.removeClass(OPEN);
      $body.off('click', closeEmojiContainer);
    }
  }

  $emojis.on('click', function(){
    const emoji:string = $(this).text();
    $transferMessage.text($transferMessage.text() + emoji);
    updateTransferCharacterCount();
  });

  $emojiButton.on('click', function(e:Event){
    e.stopPropagation();
    if($emojiContainer.toggleClass(OPEN).hasClass(OPEN)){
      $body.on('click', closeEmojiContainer);
    } else {
      $body.off('click', closeEmojiContainer);
    }
  });

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
           $loginError.removeClass(OPEN);
           window.location.reload();
         } else {
           $loginSubmit.removeClass(LOADING);
           $loginError.text(data.msg).addClass(OPEN);
         }
       }
     });
   } else {
     $loginError.text('All fields required').addClass(OPEN);
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

  // STOCK MARKET /////////////////////////////////
  const $stocksContainer:$ = $('.stocks-container');
  var loadingStockMarket:boolean = false;

  function sellShare(e){
    if(loadingStockMarket) return;
    loadingStockMarket = true;
    const $this:$ = $(this);
    const stockID:number = parseInt($this.parent().parent().data('stockId'));
    ajax({
      url: 'php/stocks/sell-share.php',
      params: {stock: stockID},
      success: function(data){
        if(data.success){
          updateCreditCount();
          loadStocks();
        }
      }
    });
  }

  function buyShare(e){
    if(loadingStockMarket) return;
    loadingStockMarket = true;
    const $this:$ = $(this);
    const stockID:number = parseInt($this.parent().parent().data('stockId'));
    ajax({
      url: 'php/stocks/buy-share.php',
      params: {stock: stockID},
      success: function(data){
        if(data.success){
          updateCreditCount();
          loadStocks();
        }
      }
    });
  }

  function loadStocks(){
    ajax({
      url: 'php/stocks/get-stocks.php',
      responseType: 'text',
      success: function(data){
        $stocksContainer.html(data);
        const $buyShares:$ = $stocksContainer.find('.buy-share');
        const $sellShares:$ = $stocksContainer.find('.sell-share');
        $buyShares.on('click', buyShare);
        $sellShares.on('click', sellShare);
        loadingStockMarket = false;
      }
    });
  }

  function autoUpdateStocks(){
    const next:Date = new Date();
    const mins:number = next.getMinutes();
    const hours:number = next.getHours();
    next.setSeconds(30);
    next.setMinutes(mins < 30 ? 30 : 0);
    next.setHours(mins < 30 ? hours : hours + 1);
    setTimeout(function(){
      loadStocks();
      setInterval(loadStocks, 1800000);
    }, next.getTime() - new Date().getTime());
  }

  autoUpdateStocks();

  // LOTTERY //////////////////////////////
  const $lotteryTab:$ = $('.tab-content.lottery');
  const $ticketContainer:$ = $lotteryTab.find('.ticket-container');
  const $ticketsOwned:$ = $lotteryTab.find('.owned');
  const $lotteryPot:$ = $lotteryTab.find('.pot');
  const $buyTicket:$ = $lotteryTab.find('.submit');
  const $randomTicket:$ = $lotteryTab.find('.random');
  const $lotteryNumbers:$ = $lotteryTab.find('.lottery-num');

  function buyTicket(){
    const numbers:number[] =[];
    for(let lotteryNumber of $lotteryNumbers){
      const num:number = parseInt((lotteryNumber as HTMLInputElement).value);
      if(isNaN(num) || num > 9 || num < 0) return;
      numbers.push(num);
    }
    $lotteryNumbers.text('');
    ajax({
      url:'php/lottery/buy-ticket.php',
      params: {numbers: numbers.join(',') },
      success: function(data){
        if(data.success){
          loadTickets();
          loadPot();
          updateCreditCount();
        }
      }
    });
  }

  function randomTicket(){
    $lotteryNumbers.each((e) => $(e).text(Math.round(Math.random() * 9)));
  }

  function loadTickets(){
    ajax({
      url: 'php/lottery/get-tickets.php',
      responseType: 'text',
      success: function(data){
        $ticketContainer.html(data);
        $ticketsOwned.text($ticketContainer.find('li').length);
      }
    });
  }

  function loadPot(){
    ajax({
      url: 'php/lottery/get-pot.php',
      success: (data) => data.success && $lotteryPot.text(data.msg)
    });
  }

  $buyTicket.on('click', buyTicket);
  $randomTicket.on('click', randomTicket);

});
