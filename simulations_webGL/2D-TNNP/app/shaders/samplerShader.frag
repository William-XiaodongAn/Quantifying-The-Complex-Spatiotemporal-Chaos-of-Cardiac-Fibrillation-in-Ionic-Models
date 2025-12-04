#version 300 es
#include precision.glsl
 

uniform sampler2D inTexture ;
in vec2 pixPos ;
layout (location = 0) out vec4 ocolor ;

void main(){
	ocolor = texture(inTexture, pixPos) ;
}