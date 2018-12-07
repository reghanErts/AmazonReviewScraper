// Cole Bornemann
var socket = io();

// Clear Error field. and search field.
function clearSearch() {
    $("#searchError").html("");
    $("#searchText").val("");
    $("#SearchText").trigger("blur");
}

// Show the search results div.
function showResults() {
    $("#Product").hide();
    $("#searchResults").show();
    scrollTop();
}

// Show the product div.
function showProduct() {
    $("#searchResults").hide();
    $("#Product").show();
    scrollTop();
}

// Jump to the top of the screen.
function scrollTop() {
    window.scrollTo(0, 0);
}

// Overwrite print for easier console.log()
function print(data) {
    console.log(data);
}

// The stuff enetered matched several products, and should be narrowed (to reduce server load etc.)
socket.on("productList", function (dataFromServer) {
    clearSearch();
    updateTableChoose(dataFromServer);
});

// The word (or words) was narrow enough to be matched to one product.
socket.on("reviews", function (dataFromServer) {
    clearSearch();
    // Only clear product reviews when new ones are coming in.
    $("#ProductReviews").html("");
    // H2
    $("#ProductName").html(dataFromServer.name);
    // Review Ratings. Given our parts came together better, this would also include "good" and "bad" occurances/percentages.
    let a = "<thead><tr><th>5 Star</th><th>4 Star</th><th>3 Star</th><th>2 Star</th><th>1 Star</th></tr></thead><tbody><tr>";
    for (let key in dataFromServer.ratings) {
        a += "<td>" + dataFromServer.ratings[key] + "</td>";
    }
    a += "</tr></tbody>";
    $("#ProductRatings").html(a);
    // Review text
    for (let i = 0; i < dataFromServer.reviews.length; i++) {
        $("#ProductReviews").append(dataFromServer.reviews[i].review_text + "<br><br>");
    }
    showProduct();
});

// Server couldn't find any products containing the word (or words).
socket.on("searchError", function (dataFromServer) {
    scrollTop();
    $("#searchError").html(dataFromServer);
});

function updateTableChoose(dataFromServer) {
    // Clears the previous table.
    $("#searchResults").empty();
    // Top of the table.
    $("#searchResults").append("<thead><tr><th>Products</th></tr></thead><tbody>");
    for (var i = 0; i < dataFromServer.length; i++) {
        let tableText = ""
        tableText += "<tr><td>" + dataFromServer[i] + "</td></tr>";
        $("#searchResults").append(tableText);
    }
    $("#searchResults").append("</tbody>");
    showResults();
}

function setUpEventHandlers() {
    $("#searchForm").submit(function (event) {
        // Text won't automatically disappear, unless good data comes back.
        event.preventDefault();
        socket.emit("findItem", $("#searchText").val());
    });

    // https://stackoverflow.com/questions/13514878/jquery-click-handler-not-working-in-a-table
    // Clicking on a row in the search results table, will ask for that items details.
    $("#bgc").on('click', 'table tr td', function () {
        socket.emit("findItem", $(this).html())
    });
    showResults();

    // Pressing back doesn't requery the server.
    $("#backButton").on('click', function () {
        showResults()
    });

    // Makes the body hidden until everything is loaded.
    $("body").prop("hidden", false);
}

$(setUpEventHandlers);
