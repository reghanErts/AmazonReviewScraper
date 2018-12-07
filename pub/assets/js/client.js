// Cole Bornemann
var socket = io();

// Clear Error field. and search field.
function clearSearch() {
    $("#searchError").html("");
    $("#searchText").val("");
    $("#SearchText").trigger("blur");
}

function showResults() {
    $("#Product").hide();
    $("#searchResults").show();
}

function showProduct() {
    $("#searchResults").hide();
    $("#Product").show();
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
    print(dataFromServer);
    // H2
    $("#ProductName").html(dataFromServer.name);
    // Review Ratings
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
        event.preventDefault();
        socket.emit("findItem", $("#searchText").val());
    });

    $("#bgc").on('click', 'table tr td', function () {
        // https://stackoverflow.com/questions/13514878/jquery-click-handler-not-working-in-a-table
        socket.emit("findItem", $(this).html())
    });
    showResults();

    // Makes the body hidden until everything is loaded.
    $("body").prop("hidden", false);
}

$(setUpEventHandlers);
