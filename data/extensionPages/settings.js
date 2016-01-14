// Load values
var a;
chrome.storage.sync.get("ultimateSpotifyButton", function (result) {
    if (result.ultimateSpotifyButton == 1) {
        document.getElementById("desktopTarget").checked = true;
    } else {
        document.getElementById("webTarget").checked = true;
    }
});

// Save changes on button click
document.getElementById("saveButton").addEventListener("click", function () {
    if (document.getElementById("desktopTarget").checked) {
        chrome.runtime.sendMessage({target: 1});
    } else {
        chrome.runtime.sendMessage({target: 0});
    }
    
    blinkMessage(document.getElementById("notifier"));
});

function blinkMessage(element) {
    var opac = 1;  // initial opacity
    var timer = setInterval(function () {
        if (opac <= 0.1) {
            clearInterval(timer);
            element.style.opacity = 1;
        }
        element.style.opacity = opac;
        opac -= opac * 0.1;
    }, 50);
}