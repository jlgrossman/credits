<? foreach($shares as $share): ?>
  <div class="share" data-stock-id="<?=$share['id']?>">
    <div class="share-name">Name: <?=$share['name']?></div>
    <div class="share-value">Value: <?=$share['value']?></div>
    <div class="share-quantity">Quantity: <?=$share['quantity']?></div>
    <button class="sell-share">Sell</button>
  </div>
<? endforeach; ?>
