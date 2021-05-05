/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

 $(document).ready(function() {
  const arrayAnnouncement = $('.AnnouncementBar__Content').text().split('---');
  $('.AnnouncementBar__Content').empty();
  arrayAnnouncement.forEach(announcement => {
    $('.AnnouncementBar__Content').append('<span>' + announcement.trim() + '</span>');
  });

  $('<div class="go-to-top"></div>').insertAfter($('#shopify-section-footer'));
  $('.go-to-top').click(() => {
    $('html').stop().animate({ scrollTop: 0 }, 500, 'swing');
  })
  $(window).on('scroll', _.throttle(() => {
    if ($(window).scrollTop() > 10) {
      $('.go-to-top').fadeIn();
    } else {
      $('.go-to-top').fadeOut();
    }
  }, 150));

  $('.CollectionList .SectionHeader__SubHeading').each(function() {
    if ($(this).text().trim().indexOf('hidden-content') !== -1) {
      $(this).closest('.CollectionList').addClass('CollectionList-No-Content');
    }
  });

  $('.ProductTab__Title').click(function() {
    if ($(this).index() === 1 && $('.scr-open-size-chart').length) {
      $('.scr-open-size-chart').click();
    } else {
      $(this).addClass('active').siblings().removeClass('active');
      $(this).parent().next().children().eq($(this).index()).show().siblings().hide();
    }
  });

  $('.Drawer__TabsTitle').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    $('.Drawer__Container').children().fadeOut();
    $('.Drawer__Container').children().eq($(this).index()).fadeIn();
  });
  
  let formHeader = $('#localization_form_header').clone();
  formHeader.attr('id', 'localization_form_header_mobile').removeClass('hidden-pocket hidden-lap');
  formHeader.find('#header-currency-popover-0').removeAttr('id').find('#header-locale-popover-0').removeAttr('id');
  $('.Drawer__Account').append(formHeader);

  $('.Drawer__Account .SelectButton').click(function() {
    $(this).next().stop().slideToggle();
  });

  $('.shopify-section').each(function() {
    if ($('.SectionHeader__SubHeading', this).text().indexOf('side-by-side') !== -1) {
      if ($('.SectionHeader__SubHeading', this).closest('header').next().length) {
        $(this).addClass('section-one');
      } else {
        $(this).addClass('section-two');
      }
    } else if ($('.SectionHeader__SubHeading', this).text().indexOf('mobile-carousel') !== -1) {
      $(this).addClass('mobile-carousel');
    }
  }).promise().done(function() {
    $('.section-one').each(function() {
      if ($(this).next().hasClass('section-two')) {
        $('.FeatureText__ContentWrapper', $(this).next()).append($('.TabPanel', this));
      }
    });
  });

  let flickitySlider;
  let mobileFlickitySlider;
  createFlickity();
  createMobileFlickitySlider();
  $(window).on('resize', function() {
    if (!flickitySlider) {
      createFlickity();
    } else {
      if ($(window).width() < 1008) {
      } else {
        flickitySlider.flickity('destroy');
        flickitySlider = null;
      }
    }
    if (!mobileFlickitySlider) {
      createMobileFlickitySlider();
    } else {
      if ($(window).width() < 1008) {
      } else {
        mobileFlickitySlider.flickity('destroy');
        mobileFlickitySlider = null;
      }
    }
  });

  function createFlickity() {
    if ($(window).width() < 1008) {
      flickitySlider = $('.section-two .ProductList').flickity({
        prevNextButtons: true,
        pageDots: true,
        draggable: true,
        wrapAround: false,
        groupCells: 2
      });
    }
  }

  function createMobileFlickitySlider() {
    if ($(window).width() < 1008) {
      flickitySlider = $('.mobile-carousel .ProductList').flickity({
        prevNextButtons: true,
        pageDots: true,
        draggable: true,
        wrapAround: false,
        groupCells: 2
      });
    }
  }

  var txtVariable = '--size chart--';
  $('.ProductTab__Content div:nth-child(1) > *').each(function() {
    if ($(this).text().indexOf(txtVariable) !== -1) {
      var splitHtml = '<' + $(this).prop('tagName').toLowerCase() + '>' + txtVariable + '</' + $(this).prop('tagName').toLowerCase() + '>';
      var sp = $(this).parent().html().split(splitHtml);
      var move = '<div class="custom-variations">' + sp[1] + '</div>';
      console.log(move)
      $(this).closest('.ProductTab__Content').find('div:nth-child(2)').empty().append(move);
      $(this).parent().html(sp[0]);
      $(this).remove();
    }
  });
});
