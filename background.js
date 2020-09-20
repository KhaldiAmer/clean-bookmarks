let flatten = (children, getChildren, level, parent) => Array.prototype.concat.apply(
    children.map(x => ({ ...x, level: level || 1, parent: parent || null })), 
    children.map(x => flatten(getChildren(x) || [], getChildren, (level || 1) + 1, x.id))
  );

let extractChildren = x => x.children;

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostContains: ''},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
  });