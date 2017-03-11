<? foreach($shares as $share): ?>
  <div class="share">
    <div class="share-name"><?=$share['name']?></div>
    <div class="share-value"><?=$share['value']?></div>
    <div class="share-quantity"><?=$share['quantity']?></div>
  </div>
<? endforeach; ?>
