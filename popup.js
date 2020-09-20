let flatten = (children, getChildren, level, parent) => Array.prototype.concat.apply(
    children.map(x => ({ ...x, level: level || 1, parent: parent || null })), 
    children.map(x => flatten(getChildren(x) || [], getChildren, (level || 1) + 1, x.id))
  );

let extractChildren = x => x.children;


    chrome.bookmarks.getTree (([treeStructure]) => {
        console.log(treeStructure)
        let arr = flatten(extractChildren(treeStructure), extractChildren).map(x => delete x.children && x);
        console.log("arr ", arr);
        let item = document.getElementById("totalBookmarks");
        item.innerHTML = `Total bookmarks: ${arr.length} `
    })

// chrome.storage.sync.get('color', function (data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });
// chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log("The color is green.");
//   });

changeColor.onclick = function (element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'document.body.style.backgroundColor = "' + color + '";' });
    });
};