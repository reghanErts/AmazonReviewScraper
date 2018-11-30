// Cole Bornemann

var socket = io();

socket.on("searchError", function(dataFromServer) {
    console.log(dataFromServer);
    $("#searchError").html(dataFromServer);
});

function updateGUI(dataFromServer) {
    // Clears the previous table and standings.
    $("#searchResults").empty();
    for(var i = 0; i < dataFromServer.length; i++) {
        // Reset all variables.
        var a = "", v = 0, t = 0, l = 0;
        // Set local variable that tracks while not constantly talking to the server.
        numberTeams = dataFromServer.length;
        // Top of the table.
        if (i == 0) {
            a+= "<thead>"
        }
        // New table row.
        a += "<tr>";
        // For the array going across.
        for (var j = 0; j < dataFromServer[i].length; j++) {
            if (i == 0) {
                a += "<th>" + dataFromServer[i][j] + "</th>";
                // Change all html for the team names.
                $("#tr" + j).html(dataFromServer[i][j]);
                $("#tb" + j).html(dataFromServer[i][j]);
                $("#tn" + j).html(dataFromServer[i][j]);
                standingsChart[j] = [];
            } else {
                // https://www.w3schools.com/tags/att_td_bgcolor.asp
                if (dataFromServer[i][j] == "Won against") {
                    // Winning color and increase victory count.
                    a += "<td bgcolor=\"green\">" + dataFromServer[i][j] + "</td>";
                    v += 1;
                } else if (dataFromServer[i][j] == "Lost against") {
                    // Losing color and increase losing count.
                    a += "<td bgcolor=\"red\">" + dataFromServer[i][j] + "</td>";
                    l += 1;
                } else if (dataFromServer[i][j] == "Tied with") {
                    // Tie color and increase tie count.
                    a += "<td bgcolor=\"yellow\">" + dataFromServer[i][j] + "</td>";
                    t += 1;
                } else if (i == j) {
                    // Invalid color (playing your own team).
                    a += "<td bgcolor=\"black\">" + dataFromServer[i][j] + "</td>";
                } else {
                    // No result yet.
                    a += "<td>" + dataFromServer[i][j] + "</td>";
                }
            }
        }
        a += "</tr>";
        if (i == 0) {
            a+= "</thead><tbody>"
        }
        $("#tournamentTable").append(a);
    }
    $("#tournamentTable").append("</tbody>");
}

function setUpEventHandlers() {
    $("#searchForm").submit(function(event) {
        event.preventDefault();
		socket.emit("findItem", $("#searchText").val(), function(dataFromServer) {
            console.log("Searching.");
            // If the JSON comes back that's good.
			if(dataFromServer != 'null') {
                // Clear Error field.
                $("#searchError").val("");
                // Clear the serach field.
                $("#searchText").val("");
                // Update the table.
                updateGUI(dataFromServer);
			} else {
                $("#searchError").val("There was an error communicating with the server. Please try again.");
            }
		});
	});
}

$(setUpEventHandlers);
