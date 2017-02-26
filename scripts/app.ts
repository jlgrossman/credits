/// <reference path="utils.ts"/>

ready(function(){

  const OPEN : string = 'open';

  const $popup : $ = $('.overlay');
  const $popupContent : $ = $popup.find('.popup');
  const $closePopup : $ = $popupContent.find('.close');

  $closePopup.on('click', function(){
    $popup.removeClass(OPEN);
  });

});
