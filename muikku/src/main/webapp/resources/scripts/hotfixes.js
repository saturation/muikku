// BUG-2792_connect-field-draggable-issue
// This should be fixed as more development goes to the new ui design
// Don't leave this here after all draggables and droppables are fixed
// currently they don't work on touch devices and instead block the scrolling
// so we disable them overall until they are fixed
if ('ontouchstart' in window || 'onmsgesturechange' in window){
  $.fn.draggable = function(){
    return this;
  }
}