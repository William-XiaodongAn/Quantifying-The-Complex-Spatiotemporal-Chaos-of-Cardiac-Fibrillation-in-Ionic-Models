#version 300 es
#include precision.glsl

uniform float threshold;
uniform sampler2D inTexture ;

in vec2 pixPos ;

layout (location = 0) out vec4 ocolor ;

#define u  color.r

void main() {
    vec4 color = texture( inTexture , pixPos ) ;
    if (u>threshold){
        ocolor = vec4(1.,0.,0.,0.);
    }
    else{
        ocolor = vec4(0.,0.,0.,0.);
    }
}