<? foreach($transactions as $transaction): ?>
  <div class="transaction">
    <div class="transaction-details">
      <div class="transaction-user transaction-from" data-user-id="<?=$transaction['from']['id']?>">
        <img class="transaction-user-img" src="<?=getUserImage($transaction['from']['id'])?>" width="16" height="16">
        <div class="transaction-user-name"><?=$transaction['from']['name']?></div>
      </div>
      <div class="transaction-user transaction-to" data-user-id="<?=$transaction['to']['id']?>">
        <img class="transaction-user-img" src="<?=getUserImage($transaction['to']['id'])?>" width="16" height="16">
        <div class="transaction-user-name"><?=$transaction['to']['name']?></div>
      </div>
    </div>
    <div class="transaction-amount"><?= $transaction['amount'] ?></div>
    <div class="transaction-msg"><?= $transaction['msg'] ?></div>
  </div>
<? endforeach; ?>
