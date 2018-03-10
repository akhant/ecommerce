$(function(){
    $("input[name=search_term]").keyup(function(){
        let search_term = $(this).val()
        console.log("search_term", search_term)
        $.ajax({
            method: "POST",
            url: '/api/search',
            data: {
                search_term
            },
            dataType: 'json',
            success: (json) => {
              const data = json.hits.hits.map((hit) => {
                return hit
              }
              )

              $("#searchResults").empty();
              for (let i=0; i< data.length; i++ ){
                  let html = '';
                  html += `<div class="col-md-4">
                  <a href="/product/${data[i]._source._id}">
                      <div class="thumbnail">
                          <img src="${data[i]._source.image}" style="width:300px;" alt="">
                          <div class="caption">
                              <h3>${data[i]._source.name}</h3>
                              <p>${data[i]._source.category.name}</p>
                              <p>$ ${data[i]._source.price}</p>
                          </div>
                      </div>
                  </a>
              </div>`

              $('#searchResults').append(html)
              }
            },
            error: ((error) => {
              console.log("error", error)
            }
            )
            
        })
    })
})