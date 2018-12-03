// Cole Bornemann

var socket = io();

// Clear Error field. and search field.
function clearSearch() {
    $("#searchError").html("");
    $("#searchText").val("");
    $("#SearchText").trigger("blur");
}

// The stuff enetered matched several products, and should be narrowed (to reduce server load etc.)
socket.on("productList", function (dataFromServer) {
    clearSearch();
    updateTableChoose(dataFromServer);
});

// The word (or words) was narrow enough to be matched to one product.
socket.on("reviews", function (dataFromServer) {
    $('#searchResults').hide();
    clearSearch();
    console.log("Reviews.");
    console.log(dataFromServer);
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
    $("#searchResults").show();
}

function setUpEventHandlers() {
    $("#searchForm").submit(function (event) {
        event.preventDefault();
        socket.emit("findItem", $("#searchText").val());
    });

    $("#searchResults tbody tr").click(function () {
        console.log("The index is: " + $(this).index());
        var currentStudent = $(this).index();
    });

    // Makes the body hidden until everything is loaded.
    $("body").prop("hidden", false);
}

$(setUpEventHandlers);
