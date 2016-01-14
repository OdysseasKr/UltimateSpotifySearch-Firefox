/**
	Simplifies search on Spotify with launchers on popular sites and search from right-click
    Copyright (C) 2015  Odyssefs Krystalakos
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/
var cm = require("sdk/context-menu");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var preferences = require("sdk/simple-prefs").prefs;
var pageMod = require("sdk/page-mod");

// Context menu addition
cm.Item({
    label: "Search on Spotify",
    image: self.data.url("icons/icon64.png"),
    context: cm.SelectionContext(),
    contentScriptFile: self.data.url("contextScript.js"),
    onMessage: openURI
});

// Content scripts
pageMod.PageMod({
    include: ["*.youtube.com", "*.soundcloud.com", "*.bandcamp.com"],
    contentScriptFile: self.data.url("contentScript.js"),
    contentScriptOptions: {
        icons: self.data.url("icons/icon32.png")
    },
    onAttach: function(worker) {
        worker.port.on("openURI", function(term) {
          openURI(term);
        });
    }
});

/*
 * Opens the correct search URI with the given terms
 */
function openURI(term) {
    var curr = tabs.activeTab;
    if (preferences.target == "D") {
        tabs.open({
            "url": "spotify:search:" + term + "",
            onOpen: function onOpen(tab) {
                curr.activate();
                tab.on("activate", function () {
                    tab.close();
                });
            }
        });
    } else {
        tabs.open({
            "url": "https://play.spotify.com/search/" + term
        });
    }
}

// Check for first run and load/save the files and/or open the "first run" dialog
exports.main = function (options, callbacks){
    if (options.loadReason == "install"){
        tabs.open(self.data.url("extensionPages/firstRun.html"));    // Open first run dialog
    }
};
