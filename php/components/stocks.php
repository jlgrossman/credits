<? foreach($stocks as $stock): ?>
  <div class="stock" data-stock-id="<?=$stock['id']?>">
    <div class="stock-detail">
      <div class="stock-name"><span class="stock-detail-label">Name</span><span class="stock-detail-value"><?=$stock['name']?></span></div>
      <div class="stock-value"><span class="stock-detail-label">Value</span><span class="stock-detail-value"><?=$stock['value']?></span></div>
      <div class="stock-quantity shares-owned"><span class="stock-detail-label">Quantity</span><span class="stock-detail-value"><?=$stock['quantity']?></span></div>
    </div>
    <div class="stock-actions">
      <button class="buy-share">Buy</button>
      <button class="sell-share">Sell</button>
    </div>
  </div>
<? endforeach; ?>