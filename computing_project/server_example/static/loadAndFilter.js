function loadAndFilter(url, destDiv, tabSize) {
    function filterStuff(text, destDiv, tabSize) {

        var tabString = "";
        for (var j = 0; j < tabSize; j++) {
            tabString = tabString + " ";
        }

        var lines = text.split(/\n/);
        var filterIsOn = true;
        var inPre = false;
        var result = "";
        var n = lines.length;
        for (var i = 0; i < n; i++) {
            var curLine = lines[i];
            if (!curLine)
                continue;

            if (curLine.indexOf("<!--hide-->", 0) >= 0 ||
                    curLine.indexOf("//hide", 0) >= 0) {
                filterIsOn = false;
            }
            else if (curLine.indexOf("<!--show-->", 0) >= 0 ||
                    curLine.indexOf("//show", 0) >= 0) {
                filterIsOn = true;
            }
            else if (curLine.indexOf("<!--skip-->", 0) >= 0 ||
                    curLine.indexOf("//skip") >= 0) {
                /* do nothing */
            }
            else if (curLine.indexOf("<pre") >= 0) {
                inPre = true;
            }
            else if (curLine.indexOf("</pre") >= 0) {
                inPre = false;
            }
            else {
                if (filterIsOn && !inPre) {
                    cleanedLine = curLine.replace(/&/g, '&amp;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&quot;");
                    cleanedLine = cleanedLine.replace(/    /g, tabString);
                    result = result + cleanedLine + "\n";
                }
            }
        }

        var thediv = document.getElementById(destDiv);
        if (!thediv) {
            alert("destDiv " + destDiv + " is not in the document");
        }
        else {
            thediv.innerHTML = result;
        }

        if (!window.firePrettyPrintEric) {
            window.firePrettyPrintEric = true;
            setTimeout(function() {
                window.prettyPrint();
            }, 3000);
        }
    }

    if (typeof window.$ === 'undefined') {
        alert("Developer error, jquery wasn't loaded.")
    }
    //
    // We initiate this fetch in a timeout so that it doesn't slow down the download
    // of the elements that actually do useful stuff. 
    //
    setTimeout(function() {
        $.get(url, function(response, status, xhr) {
        
            if (status == "error") {
                var msg = "Sorry there was an error: " + xhr.status + " " + xhr.statusText;
                alert(msg);
                return;
            }
            else {
                filterStuff(response, destDiv, tabSize);
            }
        }, 'text');
    }, 1000);

}

function getHelperPath(suffix) {
    var originalPath = location.href;
    var parts = originalPath.split("/");
    var htmlName = parts[parts.length-1];
    return suffix + "/" + htmlName.replace(/.html$/, '.' + suffix);    
}

