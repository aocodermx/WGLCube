
JSCC=closure
JSCC_FLAGS=--compilation_level SIMPLE_OPTIMIZATIONS
RUBIKGL_VER=0.1


rubik:
	$(JSCC) $(JSCC_FLAGS) --js rubikgl-web.js --js_output_file rubikgl-web_$(RUBIKGL_VER).min.js
