#version 300 es
precision highp float ;
precision highp int ;

in vec2 pixPos ;

uniform sampler2D inTexture ;

out vec4 ocolor ;

void main(){
    ivec2 isize = textureSize( inTexture, 0) ;
    vec4 color ;

    float sum = 0. ;
    
    for(int i=0; i<isize.x ;i++){
        color = texelFetch( inTexture, ivec2(i,0),0 ) ;
        sum += color.x ;
    }

    ocolor = vec4(sum) ;
	return;
	
}