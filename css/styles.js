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
}(document, ".preview{position:relative;width:100%;height:75%}.square{position:absolute;width:40%;height:40%}.s1{top:10%;left:10%;background-color:red}.s2{top:10%;right:10%;background-color:blue}.s3{bottom:10%;left:10%;background-color:green}.s4{bottom:10%;right:10%;background-color:yellow}.wglcube_player{overflow:hidden;text-align:center;background:#d8d8d8;cursor:pointer;cursor:hand}.cube{display:none;width:100%;height:75%;bottom:25%;top:0}.steps-container{width:100%;height:15%;bottom:15%;overflow:hidden;font-size:15em}.steps-container span{font-size:inherit;margin-left:2px;margin-right:2px;float:left}.hint{width:100%;height:15%;font-size:1.2em;font-weight:bold}.controls{display:none;width:100%;height:10%;bottom:0}.controls button{padding:0;border:0;height:100%;width:18%;font-size:1em;background-repeat:no-repeat;background-size:contain}.current-step{font-weight:bold}.icon-previous{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNOCAyOFY0aDR2MTFMMjIgNXYyMkwxMiAxN3YxMXoiLz48L3N2Zz4=)}.icon-stop{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNNCA0aDI0djI0SDR6Ii8+PC9zdmc+)}.icon-play{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNNiA0bDIwIDEyTDYgMjh6Ii8+PC9zdmc+)}.icon-pause{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNNCA0aDEwdjI0SDR6bTE0IDBoMTB2MjRIMTh6Ii8+PC9zdmc+)}.icon-next{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNMjQgNHYyNGgtNFYxN0wxMCAyN1Y1bDEwIDEwVjR6Ii8+PC9zdmc+)}.icon-eject{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjNDQ0IiBkPSJNMCAyNGgzMnY0SDB6TTE2IDRsMTYgMTZIMHoiLz48L3N2Zz4=)}.util-show{display:block}.util-hide{display:none}.util-cursor-hand{cursor:pointer;cursor:hand}.util-cursor-none{cursor:inherit}"));
