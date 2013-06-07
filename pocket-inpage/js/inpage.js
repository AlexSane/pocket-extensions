require(['js/communicate'], function (pocket) {

    function onActionClick(tab) {
        pocket.isAdded(tab.url)
            .then(function (isAdded) {
                var deffer = isAdded ? pocket.remove(tab.url) : pocket.add(tab.url);
                return deffer.then(function () {
                    return isAdded;
                });
            })
            .done(function (isAdded) {
                showIcon(tab.id, !isAdded)
            });
    }


    function onTabUpdate(tabId, changeInfo, tab) {
        if (tab.url.indexOf('chrome://') == 0) {
            chrome.pageAction.hide(tabId);
        }
        else {
            chrome.pageAction.show(tabId);
            pocket.isAdded(tab.url)
                .done(function (isAdded) {
                    showIcon(tabId, isAdded);
                });
        }
    }

    function showIcon(tabId, isAdded) {
        var addedIcon = {"19": "images/added-19.png"};
        var notAddedIcon = {"19": "images/notAdded-19.png"};
        chrome.pageAction.setIcon({
            tabId: tabId,
            path: isAdded ? addedIcon : notAddedIcon
        });
    }


    chrome.tabs.onUpdated.addListener(onTabUpdate);
    chrome.pageAction.onClicked.addListener(onActionClick);
});