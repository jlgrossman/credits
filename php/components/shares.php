<? foreach($shares as $share): ?>
  <div class="share" data-stock-id="<?=$share['id']?>">
    <div class="share-name"><?=$share['name']?></div>
    <div class="share-value"><?=$share['value']?></div>
    <div class="share-quantity"><?=$share['quantity']?></div>
  </div>
<? endforeach; ?>
