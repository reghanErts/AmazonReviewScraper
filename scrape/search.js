var asins = [];
var pos = 0;
var fileName = "\\ASINs.txt"; //dump file name
var path = ""; //defined in runItAll via getPath function

function writeToFile(text) { //function for writing to machine
    var systemObject = new ActiveXObject("Scripting.FileSystemObject");
    var file = systemObject.OpenTextFile(path, 8, true, 0); //dumps ASINs to a textfile at PATH
    file.WriteLine(text);
    file.Close();
}

function uniq(array) { //function for removing duplicate ASINS
    return array.sort().filter(function (item, pos, self) {
        return !pos || item != self[pos - 1];
    })
}

function getPath() { //returns the path to the project directory
    var loc = location.pathname.split('/');
    if (loc[loc.length - 1].indexOf('.html') > -1) {
        loc.length = loc.length - 1;
    }
    loc = loc.join('\\');
    loc = loc.substring(1);
    return loc;
}

function runPython(){ //fires the python script
    var cmd = new ActiveXObject('WSCRIPT.shell').run(""+getPath()+"\\runPython.bat");
}

function runItAll() { //HTML is scraped from the search results of the keyword
    path = getPath();
    path += fileName;
    $("#queryButton").click(function () {
        keyword = $("#queryWord").val();
        $.get('https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=' + keyword, function (response) {
            pos = response.search("/dp/");
            while (pos != -1) { //ASINs are pulled from the code. They all begin with /dp/ which makes it easy
                pos += 4;
                asins.push(response.substring(pos, pos + 10));
                response = response.substring(pos + 10);
                pos = response.search("/dp/");
            }
            asins = uniq(asins);
            for (var x = 0; x < asins.length; x++) { //The ASINs are written to a text file
                writeToFile(asins[x]);
            }
            alert("Ended with " + asins.length + " results!"); //useless alert
            runPython();
        });
    });
}
$(runItAll);