#version 300 es

precision highp float ;
precision highp int ;

uniform sampler2D icolor0 ;
in vec2 pixPos ;
out vec4 ocolor ;

void main(){
	ocolor = texture(icolor0,pixPos) ;
}