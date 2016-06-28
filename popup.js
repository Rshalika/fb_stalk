document.addEventListener('DOMContentLoaded', function() {
    var activateButton = document.getElementById('activate');
    var head = document.getElementById('head');

    chrome.storage.sync.get("data" , function(items) {
         if (!chrome.runtime.lastError && items.data){
             activateButton.innerHTML = 'deactivate';
             head.style.color = "green";
         }
    });
    function toggle() {
        if (activateButton.innerHTML == 'activate'){
            activateButton.innerHTML = 'deactivate';
            head.style.color = "green";
        }else{
            activateButton.innerHTML = 'activate';
            head.style.color = "red";
        }
        activateButton.style.display="block";
    }

    activateButton.addEventListener('click', function() {
        if (activateButton.innerHTML == 'activate'){
            activateButton.style.display="none";
            chrome.storage.sync.set({"data" : true}, function(items) {
                toggle();
            });
        }else{
            activateButton.style.display="none";
            chrome.storage.sync.set({"data" : false}, function(items) {
                toggle();
            });
        }

    }, false);


}, false);