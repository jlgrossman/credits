<? foreach($threads as $thread): ?>
  <div class="message-thread">
    <div class="message-thread-from"><?= $thread['from'] ?></div>
    <div class="message-thread-count"><?= $thread['unread'] ?></div>
  </div>
<? endforeach; ?>
