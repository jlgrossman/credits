<? foreach($stocks as $stock): ?>
  <div class="stock" data-stock-id="<?=$stock['id']?>">
    <div class="stock-name">Name: <?=$stock['name']?></div>
    <div class="stock-value">Price: <?=$stock['value']?></div>
    <button class="buy-stock">Buy</button>
  </div>
<? endforeach; ?>
