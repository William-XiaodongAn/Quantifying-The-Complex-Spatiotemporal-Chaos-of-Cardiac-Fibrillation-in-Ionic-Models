#version 300 es 

precision highp float ;
precision highp int ;

layout (location = 0 ) out vec4 colr0;
layout (location = 1 ) out vec4 colr1;
layout (location = 2 ) out vec4 colr2;
layout (location = 3 ) out vec4 colr3;

void main(){
    colr0 = vec4(0.) ;
    colr1 = vec4(0.) ;
    colr2 = vec4(0.) ;
    colr3 = vec4(0.) ;
}
