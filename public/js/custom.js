$(function() {

  //----------------------------------------spinner start
  var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    fadeColor: 'transparent',
    opacity: 0.25,
    rotate: 0,
    direction: 1,
    speed: 1,
    trail: 100,
    fps: 20,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: 'none',
    position: 'absolute',
};
var Spinner = /** @class */ (function () {
    function Spinner(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = __assign({}, defaults, opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        var _this = this;
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")",
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        var animator;
        var getNow;
        if (typeof requestAnimationFrame !== 'undefined') {
            animator = requestAnimationFrame;
            getNow = function () { return performance.now(); };
        }
        else {
            // fallback for IE 9
            animator = function (callback) { return setTimeout(callback, 1000 / _this.opts.fps); };
            getNow = function () { return Date.now(); };
        }
        var lastFrameTime;
        var state = 0; // state is rotation percentage (between 0 and 1)
        var animate = function () {
            var time = getNow();
            if (lastFrameTime === undefined) {
                lastFrameTime = time - 1;
            }
            state += getAdvancePercentage(time - lastFrameTime, _this.opts.speed);
            lastFrameTime = time;
            if (state > 1) {
                state -= Math.floor(state);
            }
            if (_this.el.childNodes.length === _this.opts.lines) {
                for (var line = 0; line < _this.opts.lines; line++) {
                    var opacity = getLineOpacity(line, state, _this.opts);
                    _this.el.childNodes[line].childNodes[0].style.opacity = opacity.toString();
                }
            }
            _this.animateId = _this.el ? animator(animate) : undefined;
        };
        drawLines(this.el, this.opts);
        animate();
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            }
            else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}());

function getAdvancePercentage(msSinceLastFrame, roundsPerSecond) {
    return msSinceLastFrame / 1000 * roundsPerSecond;
}
function getLineOpacity(line, state, opts) {
    var linePercent = (line + 1) / opts.lines;
    var diff = state - (linePercent * opts.direction);
    if (diff < 0 || diff > 1) {
        diff += opts.direction;
    }
    // opacity should start at 1, and approach opacity option as diff reaches trail percentage
    var trailPercent = opts.trail / 100;
    var opacityPercent = 1 - diff / trailPercent;
    if (opacityPercent < 0) {
        return opts.opacity;
    }
    var opacityDiff = 1 - opts.opacity;
    return opacityPercent * opacityDiff + opts.opacity;
}
/**
 * Tries various vendor prefixes and returns the first supported property.
 */
function vendor(el, prop) {
    if (el.style[prop] !== undefined) {
        return prop;
    }
    // needed for transform properties in IE 9
    var prefixed = 'ms' + prop.charAt(0).toUpperCase() + prop.slice(1);
    if (el.style[prefixed] !== undefined) {
        return prefixed;
    }
    return '';
}
/**
 * Sets multiple style properties at once.
 */
function css(el, props) {
    for (var prop in props) {
        el.style[vendor(el, prop) || prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = (Math.round(opts.corners * opts.width * 500) / 1000) + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    }
    else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: (opts.length + opts.width) + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)",
        });
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            opacity: opts.opacity,
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8],
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [
        Math.round((x * cos + y * sin) * 1000) / 1000,
        Math.round((-x * sin + y * cos) * 1000) / 1000,
    ];
}


  //----------------------------------------spinner end

  var opts = {
    lines: 20, // The number of lines to draw
    length: 80, // The length of each line
    width: 52, // The line thickness
    radius: 84, // The radius of the inner circle
    scale: 0.9, // Scales overall size of the spinner
    corners: 0, // Corner roundness (0..1)
    color: '#ffffff', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    opacity: 0, // Opacity of the lines
    rotate: 84, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: 'none', // Box-shadow for the lines
    position: 'absolute' // Element positioning
  };



  $("input[name=search_term]").keyup(function() {
    let search_term = $(this).val();
    console.log("search_term", search_term);
    $.ajax({
      method: "POST",
      url: "/api/search",
      data: {
        search_term
      },
      dataType: "json",
      success: json => {
        const data = json.hits.hits.map(hit => {
          return hit;
        });

        $("#searchResults").empty();
        for (let i = 0; i < data.length; i++) {
          let html = "";
          html += `<div class="col-md-4">
                  <a href="/product/${data[i]._source._id}">
                      <div class="thumbnail">
                          <img src="${
                            data[i]._source.image
                          }" style="width:300px;" alt="">
                          <div class="caption">
                              <h3>${data[i]._source.name}</h3>
                              <p>${data[i]._source.category.name}</p>
                              <p>$ ${data[i]._source.price}</p>
                          </div>
                      </div>
                  </a>
              </div>`;

          $("#searchResults").append(html);
        }
      },
      error: error => {
        console.log("error", error);
      }
    });
  });

  $(document).on("click", "#plus", e => {
    e.preventDefault();
    let priceValue = parseFloat($("#priceValue").val());
    let quantity = parseFloat($("#quantity").val());

    priceValue += parseFloat($("#priceHidden").val());
    quantity += 1;
    console.log("Value", priceValue);
    console.log("quantity", quantity);

    $("#quantity").val(quantity);
    $("#total").html(quantity);
    $("#priceValue").val(priceValue.toFixed(2));
  });

  $(document).on("click", "#minus", e => {
    e.preventDefault();
    let priceValue = parseFloat($("#priceValue").val());
    let quantity = parseFloat($("#quantity").val());

    if (quantity == 1) {
      priceValue = parseFloat($("#priceHidden").val());
      quantity = 1;
    } else {
      priceValue -= parseFloat($("#priceHidden").val());
      quantity -= 1;
    }

    console.log("Value", priceValue);
    console.log("quantity", quantity);

    $("#quantity").val(quantity);
    $("#priceValue").val(priceValue.toFixed(2));
    $("#total").html(quantity);
  });


// Create a Stripe client.
var stripe = Stripe('pk_test_d6gPnV18x8I7xS23VCM3UT6S');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);
   
  var target = $("#loading")
  var spinner = new Spinner(opts).spin(target);
 
  // Submit the form
  form.submit();
}








  /* 
  Stripe.setPublishableKey("pk_test_d6gPnV18x8I7xS23VCM3UT6S");

  $("#payment-form").submit(event => {
    let $form = $(this);

    $form.find("button").prop("disabled", true);
    Stripe.card.createToken($form, stripeResponseHandler);
    return false;
  }); */















});
