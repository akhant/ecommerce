$(function() {
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
