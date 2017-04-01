<? foreach($threads as $thread): ?>
  <div class="message-thread">
    <div class="message-thread-from"><?= $thread['from'] ?></div>
    <div class="message-thread-count"><div class="message-thread-count-value"><?= $thread['unread'] ?></div></div>
  </div>
<? endforeach; ?>
