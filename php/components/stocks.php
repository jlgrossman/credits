<? foreach($stocks as $stock): ?>
  <div class="stock" data-id="<?=$stock['id']?>">
    <div class="stock-name"><?=$stock['name']?></div>
    <div class="stock-value"><?=$stock['value']?></div>
  </div>
<? endforeach; ?>
