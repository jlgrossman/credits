<? foreach($messages as $message): ?>
  <div class="message <?= $message['read'] ? '' : 'unread'?>">
    <div class="message-details">
      <div class="message-user message-from" data-user-id="<?=$message['from']['id']?>">
        <img class="message-user-img" src="<?=getUserImage($message['from']['id'])?>" width="16" height="16">
        <div class="message-user-name"><?=$message['from']['name']?></div>
      </div>
      <div class="message-user message-to" data-user-id="<?=$message['to']['id']?>">
        <img class="message-user-img" src="<?=getUserImage($message['to']['id'])?>" width="16" height="16">
        <div class="message-user-name"><?=$message['to']['name']?></div>
      </div>
    </div>
    <div class="message-body"><?= $message['msg'] ?></div>
  </div>
<? endforeach; ?>
