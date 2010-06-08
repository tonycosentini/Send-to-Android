var baseUrl = 'http://chrometophone.appspot.com/send';
var req = new XMLHttpRequest();

alert("test");

function performCommand(event)
{
	event.target.browserWindow.activeTab.url = currentURL;
	alert(event.command);
}

function loadHandler() {
  document.getElementById('msg').innerHTML = chrome.i18n.getMessage('sending_message');
  document.getElementById('about').innerHTML = chrome.i18n.getMessage('about_message');

  chrome.tabs.getSelected(null, function(tab) {
    if (tab.url.indexOf('http:') == 0 ||
        tab.url.indexOf('https:') == 0) {
      chrome.tabs.executeScript(null, {file: "content_script.js"});
    } else {
      document.getElementById('msg').innerHTML = chrome.i18n.getMessage('invalid_scheme_message');
    }
  });
}

function sendToPhone(title, url, selection) {
  var sendUrl = baseUrl + '?title=' + encodeURIComponent(title) +
      '&url=' + encodeURIComponent(url) + '&sel=' + encodeURIComponent(selection);
  req.open('GET', sendUrl, true);
  req.setRequestHeader('X-Extension', 'true');  // XSRF protector

  req.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (req.status == 200) {
        if (req.responseText.substring(0, 2) == 'OK') {
          document.getElementById('msg').innerHTML = chrome.i18n.getMessage('sent_message');
        } else {  // most likely login, handle in new tab
          document.getElementById('msg').innerHTML =
              chrome.i18n.getMessage('login_required_message');
          chrome.tabs.create({url: sendUrl});
        }
      } else { 
        document.getElementById('msg').innerHTML =  
            chrome.i18n.getMessage('error_sending_message', req.responseText);
      }
    }
  }
  
  req.send(null);
}

chrome.extension.onConnect.addListener(function(port) {
  var tab = port.sender.tab;
  // This will get called by the content script. We go through
  // these hoops to get the optional text selection.
  port.onMessage.addListener(function(info) {
    var max_length = 256;
    if (info.selection.length > max_length) {
      info.selection = info.selection.substring(0, max_length);
    }
    sendToPhone(info.title, tab.url, info.selection);
  });
});
