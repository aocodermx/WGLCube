
JSCC=java -jar ~/Programs/closure.jar
JSCC_FLAGS=--compilation_level SIMPLE_OPTIMIZATIONS

CSSCC=yui-compressor
CSSCC_FLAGS=

VERSION=1.0.1


wglcube_player.min.js:
	$(JSCC) $(JSCC_FLAGS) --js js/wglcube_player.js --js_output_file js/wglcube_player_$(VERSION).min.js

wglcube_player.min.css:
	$(CSSCC) $(CSSCC_FLAGS) -o css/wglcube_player_$(VERSION).min.css css/wglcube_player.css
