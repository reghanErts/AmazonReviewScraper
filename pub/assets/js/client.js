// Cole Bornemann

var numberTeams = 0;

function updateGUI(dataFromServer) {
    // Clears the previous table and standings.
    $("#tournamentTable").empty();
    $("#standings").empty();
    var standingsChart = [];
    // For the array going down.
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
        // Add current team to standings.
        if (i != 0) standingsChart[i][0] = dataFromServer[i][0] + ": " + v + "-" + l + "-" + t;
        if (i != 0) standingsChart[i][1] = v + (.5*t);
        $("#tournamentTable").append(a);
    }
    $("#tournamentTable").append("</tbody>");
    // Sort standings.
    standingsChart.sort(compareSecondColumn);
    // Chop off extra
    standingsChart.splice(-1, 1);
    // Display standings.
    for (var i = 0; i < dataFromServer.length-1; i++) {
        $("#standings").append(standingsChart[i][0] + " with " + standingsChart[i][1] + " points.<br>");
    }
    // If the table shrunk, hide the bad selectors for every available field.
    for (var i = dataFromServer.length; i < 11; i++) {
        $("#tn" + i).hide();
        $("#tr" + i).hide();
        $("#tb" + i).hide();
    }
    // If the table grew, show the good selectors for every available field.
    for (var i = 1; i < dataFromServer.length; i++) {
        $("#tn" + i).show();
        $("#tr" + i).show();
        $("#tb" + i).show();
    }
    // Make sure the client doesn't try to send invalid paramaters to the server.
    $("#teamRed").val(1);
    $("#teamBlue").val(2);
    $("#teamNum").val(1);
    // Prevent teams from playing themselves.
    trr();
    tbb();
    // Clear the teamName section.
    $("#teamName").val("");
}

// https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

function setUpEventHandlers() {
    // Send the result of a match to the server.
    $("#matchResult").click(function() {
        $.post("/matchResult", {tb: $("#teamBlue").val(), tr: $("#teamRed").val(), wtv: $("#result").val(), payDay: $("#pin").val()}, updateGUI);
    });

    // Send a name change to the server.
    $("#nameChange").click(function() {
        $.post("/nameChange", {newName: $("#teamName").val(), number: $("#teamNum").val(), payDay: $("#pin").val()}, updateGUI);
    });

    // Wipe the current grid and make a new one of N teams.
    $("#reset").click(function() {
        $.post("/reset", {number: $("#newTeams").val(), payDay: $("#pin").val()}, updateGUI);
    });
}

// Tbb helps makes sure that a team cannot play itself.
function tbb() {
    for(var i = 1; i < numberTeams; i++) {
        $("#tr" + i).show();
    }
    $("#tr" + $("#teamBlue").val()).hide();
}

// Trr helps make sure that a team cannot play itself.
function trr() {
    for(var i = 1; i < numberTeams; i++) {
        $("#tb" + i).show();
    }
    $("#tb" + $("#teamRed").val()).hide();
}

$(setUpEventHandlers);
