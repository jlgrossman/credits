<?
// $transaction has amount, from [id, name], to [id, name], msg
foreach($transactions as $transaction): ?>
<div class="transaction">
  <div class="transaction-details">
    <div class="transaction-user transaction-from" data-user-id="<?=$transaction['from']['id']?>"><?=$transaction['from']['name']?></div>
    <div class="transaction-user transaction-to" data-user-id="<?=$transaction['to']['id']?>"><?=$transaction['to']['name']?></div>
  </div>
  <div class="transaction-msg"><?= $transaction['msg'] ?></div>
</div>
<? endforeach;
 ?>
