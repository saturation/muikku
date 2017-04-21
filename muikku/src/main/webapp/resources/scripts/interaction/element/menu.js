window.interaction.menu = {};
window.interaction.menu.hide = function(menu){
  $(document.body).css({'overflow': ''});
  $(menu).cssAnimate({
    removeClass: 'menu-_visible_',
    callback: function(){
      $('.menu').removeClass('menu-_displayed_');
    }
  });
};
window.interaction.menu.show = function(menu){
  $menu = $(menu);
  $menu.addClass('menu-_displayed_');
  setTimeout(function(){
    $menu.addClass('menu-_visible_');
  }, 10);
  $(document.body).css({'overflow': 'hidden'});
}

window.interaction.register(function(root){
  
  $(root).find('[data-interact-menu]').click(function(e){
    var target = $(e.currentTarget).attr('data-interact-menu');
    window.interaction.menu.show(target);
  });

  $(root).find('.menu').click(function(e){
    if(e.target !== e.currentTarget) return;
    window.interaction.menu.hide($(e.currentTarget));
  });

  $(root).find('.menu').bind('touchstart', function(e){
    var $touchTarget = $(e.target);
    $touchTarget.addClass("active").parent('.link, .button').addClass("active");

    $(e.currentTarget).addClass("menu-_dragging_")
    .data("touchCordX", e.originalEvent.changedTouches[0].pageX)
    .data("touchMovementX", 0)
    .data("touchTarget", $touchTarget);

    e.preventDefault();
  });

  $(root).find('.menu').bind('touchmove', function(e){
    var $menu = $(e.currentTarget);
    var startingPoint = $menu.data("touchCordX");
    $menuCont = $menu.children('.menu-container');
    var diff = e.originalEvent.changedTouches[0].pageX - startingPoint;

    var absoluteDifference = Math.abs(diff - parseInt($menuCont.css('left')));
    $menu.data("touchMovementX", $menu.data("touchMovementX") + absoluteDifference);

    if (diff > 0) {
      diff = 0;
    }
    $menuCont.css({'left': diff});

    e.preventDefault();
  });

  $(root).find('.menu').bind('touchend', function(e){
    var $menu = $(e.currentTarget);
    $menu.removeClass("menu-_dragging_");
    $menuCont = $menu.children('.menu-container');
    var width = $menuCont.width();
    var diff = parseInt($menuCont.css("left"));
    var movement = $menu.data("touchMovementX");

    var $touchTarget = $menu.data("touchTarget");
    $touchTarget.removeClass("active")
    .parent('.link, .button').removeClass("active");

    setTimeout(function(){
      $menuCont.css({'left': ''});
      if (Math.abs(diff) >= width*0.33 || movement <= 5) {
        if (movement <= 5){
          $(e.target).trigger("click");

          var href = $(e.target).attr("href");
          if (href){
            window.location.href = href;
          }
        }
        window.interaction.menu.hide($menu);
      }
    },10);
  });
  
  $(root).find('.menu').click(function(e){
    var $menu = $(e.currentTarget);
    window.interaction.menu.hide($menu);
  });
});