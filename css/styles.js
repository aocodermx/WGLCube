(function (doc, cssText) {
    var styleEl = doc.createElement("style");
    doc.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText;
        } catch (ignore) {
            styleEl.innerText = cssText;
        }
    }
}(document, ".preview{height:75%;position:relative;width:100%}.square{height:40%;position:absolute;width:40%}.s1{background-color:red;left:10%;top:10%}.s2{background-color:blue;right:10%;top:10%}.s3{background-color:green;bottom:10%;left:10%}.s4{background-color:yellow;bottom:10%;right:10%}.wglcube_player{background:#d8d8d8;cursor:pointer;cursor:hand;overflow:hidden;text-align:center}.cube{bottom:25%;display:none;height:75%;top:0;width:100%}.steps-container{bottom:15%;font-size:15em;height:15%;overflow:hidden;width:100%}.steps-container span{float:left;font-size:inherit;margin-left:2px;margin-right:2px}.hint{font-size:1.2em;font-weight:bold;height:15%;width:100%}.controls{bottom:0;display:none;height:10%;width:100%}.controls button{background-repeat:no-repeat;background-size:contain;border:0;font-size:1em;height:100%;padding:0;width:20%}.current-step{font-weight:bold}.icon-previous{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNOCAyOFY0aDR2MTFMMjIgNXYyMkwxMiAxN3YxMXoiLz48L3N2Zz4=)}.icon-stop{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNNCA0aDI0djI0SDR6Ii8+PC9zdmc+)}.icon-play{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNNiA0bDIwIDEyTDYgMjh6Ii8+PC9zdmc+)}.icon-pause{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNNCA0aDEwdjI0SDR6bTE0IDBoMTB2MjRIMTh6Ii8+PC9zdmc+)}.icon-next{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNMjQgNHYyNGgtNFYxN0wxMCAyN1Y1bDEwIDEwVjR6Ii8+PC9zdmc+)}.util-show{display:block}.util-hide{display:none}.util-cursor-hand{cursor:pointer;cursor:hand}.util-cursor-none{cursor:inherit}"));
