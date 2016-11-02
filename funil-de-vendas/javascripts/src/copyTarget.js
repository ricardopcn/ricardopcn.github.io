function copyToClipboard(elem) {
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    var target;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

$(document).ready(function() {
  var copyBt = $('#copyButton');
  copyBt.tooltip({
    trigger: "manual"
  });
  var hiding;
  copyBt.on('show.bs.tooltip', function () {
    hiding = setTimeout(function() {
      copyBt.tooltip('hide');
    }, 4000);
  });
  copyBt.on('click', function(e) {
    if (copyToClipboard(document.getElementById('copyTarget'))) {
      clearTimeout(hiding);
      copyBt.tooltip("show");
    }
    e.preventDefault();
    return false;
  });
});
