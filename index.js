function IdeaCard(title, body, id, importance) {
    this.title = title;
    this.body = body;
    this.id = Date.now();
    this.importance = importance || 'Normal';
    this.read = false;
}

function generateCard(idea) {
    var createCard =
        `<section id="${idea.id}" class="card-content">
                <h2 class="card-title"> ${idea.title}</h2>
                <button class="btn delete-btn" aria-label="Button for deleting a to-do"></button>
                <p class="card-body">"${idea.body}"</p>
                <button class="btn upvote-btn" aria-label="Button for upvoting a to-do"></button>
                <button class="btn downvote-btn" aria-label="Button for downvoting a to-do"></button> 
                <p class="todo-rating">Importance: <span class="importance-quality">${idea.importance}</span></p>
                <button class="btn checked-btn" aria-label="The button for marking a todo as read"></button>
                <hr>
            </section>`;
    $('.card-container').prepend(createCard);
}

$('.save-btn').on('click', function(event) {
    event.preventDefault();
    var newCard = new IdeaCard($('.title-input').val(), $('.body-input').val(), idByDate, null, false);
    var idByDate = Date.now();
    localStorage.setItem(idByDate, JSON.stringify(newCard)) ; 
    generateCard(newCard); 
});

// Event Listeners
$('.container-box').on('click', '.delete-btn', removeCard);
$('.container-box').on('click', '.checked-btn', markedTask);

function removeCard() {
  if ($(this).hasClass('delete-btn')) {
    $(this).parents('.card-content').remove();
  }
  localStorage.removeItem($(this).parents('.card-content').attr('id'));
}

function markedTask(object){
    object.read = !object.read; 
    $(this).parent().toggleClass("marked-as-read");
    var readMark = $(this).closest('.card-content').attr('id');
    var CardfromLocalStorage = JSON.parse(localStorage.getItem(readMark));
    CardfromLocalStorage.read = !CardfromLocalStorage.read;
    var sendToLocalStorage = localStorage.setItem(readMark, JSON.stringify(CardfromLocalStorage));
}


$('.user-input').on('input', ('.title-input, .body-input'), function() {
      if ($('.title-input').val() === "" || $('.body-input').val === "") {
        $('.save-btn').prop('disabled', true);
    } else {
        $('.save-btn').prop('disabled', false);
    }
});

$(window).on('load', function () {
    for(var i = 0; i<localStorage.length; i++) {
        var retrieveFromLocalStorage = localStorage.getItem(localStorage.key(i));
        var parsedLocalStorageData = JSON.parse(retrieveFromLocalStorage);
        // var markedAsRead = 
        generateCard(parsedLocalStorageData);
    }
})

$('.container-box').on('click', ('.upvote-btn, .downvote-btn'), function() {
    var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
    var currentImportance = $(this).closest('section').find('.importance-quality');
    console.log(currentImportance)
    var arrayIndex = importanceArray.indexOf(currentImportance.text());
        if ($(this).attr('class') === "btn upvote-btn" && arrayIndex < 4) {
            currentImportance.text(importanceArray[arrayIndex + 1]);
            console.log(arrayIndex)
        } else if ($(this).attr('class') === "btn downvote-btn" && arrayIndex > -1) {
            currentImportance.text(importanceArray[arrayIndex - 1]);
        }
    var id = $(this).closest('.card-content').attr('id')
    var parsedFromLocalStorage = JSON.parse(localStorage.getItem(id));
    updateImportance = importanceArray[arrayIndex];
    parsedFromLocalStorage.importance = updateImportance;
    var setObject = localStorage.setItem(id, JSON.stringify(parsedFromLocalStorage));
 })

$('.search-ideas').on('keyup', listFilter);

function listFilter(search) {
  var rawSearchInput = $('.search-ideas').val();
  var search = rawSearchInput.trim();
  $.extend($.expr[":"], {
    "contains": function(elem, i, match, array) {
      return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
    $('h2:contains(' + search + ')').closest('.card-content').show();
    $('h2:not(:contains(' + search + '))').closest('.card-content').hide();
    $('p:contains(' + search + ')').closest('.card-content').show();  
}









