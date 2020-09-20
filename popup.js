let flatten = (children, getChildren, level, parent) => Array.prototype.concat.apply(
    children.map(x => ({ ...x, level: level || 1, parent: parent || null })),
    children.map(x => flatten(getChildren(x) || [], getChildren, (level || 1) + 1, x.id))
);

let extractChildren = x => x.children;

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

chrome.bookmarks.getTree(([treeStructure]) => {
    console.log(treeStructure)
    let arr = flatten(extractChildren(treeStructure), extractChildren).map(x => delete x.children && x);
    console.log("arr ", arr);
    let totalBookmarks = document.getElementById("totalBookmarks");
    let randomFive = document.getElementById("randomFive");
    totalBookmarks.innerHTML = `<h2> Total bookmarks: ${arr.length} </h2>`
    let random5 = getRandom(arr, 5);
    for (let bookmark of random5) {
        let randomEl = document.createElement("div");
        randomEl.className = "randomElement";
        randomEl.dataset.id = bookmark.id;
        let link = document.createElement("a");
        let buttonsContainer = document.createElement("div");
        let clearButton = document.createElement("button");
        let visitClearButton = document.createElement("button");
        link.href = bookmark.url;
        link.target="_blank"
        link.style.display = "block";
        link.textContent = bookmark.title;
        randomEl.appendChild(link);
        clearButton.textContent = "Clear";
        visitClearButton.textContent = "Visit & Clear";
        clearButton.onclick = (event) => {
            chrome.bookmarks.remove(bookmark.id, () => console.log("deleted", bookmark))
            event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
        }
        visitClearButton.onclick = (event) => {
            let a = document.createElement("a");
            a.href = bookmark.url;
            a.target = "_blank";
            a.click();
            chrome.bookmarks.remove(bookmark.id, () => console.log("deleted", bookmark))
            event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);

        }
        buttonsContainer.appendChild(clearButton)
        buttonsContainer.appendChild(visitClearButton)
        randomEl.appendChild(buttonsContainer);

        randomFive.appendChild(randomEl);
    }
})

// chrome.storage.sync.get('color', function (data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });
// chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log("The color is green.");
//   });

// changeColor.onclick = function (element) {
//     let color = element.target.value;
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id,
//             { code: 'document.body.style.backgroundColor = "' + color + '";' });
//     });
// };
