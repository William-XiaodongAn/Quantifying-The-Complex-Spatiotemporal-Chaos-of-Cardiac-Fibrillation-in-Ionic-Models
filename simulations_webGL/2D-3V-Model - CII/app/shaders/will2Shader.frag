#version 300 es

precision highp float;

/*------------------------------------------------------------------------
 * Interface variables : 
 * varyings change to "in" types in fragment shaders 
 * and "out" in vertexShaders
 *------------------------------------------------------------------------
 */
in vec2 pixPos ;
uniform sampler2D   inVfs ;
uniform float       time ;


layout (location = 0 )  out vec4 outFvfs ;

/*========================================================================
 * Main body of the shader
 *========================================================================
 */
void main() {
    vec4    C = texture( inVfs , pixPos ) ;

	if (pixPos.x < 0.99){
		if (pixPos.x > 0.5){
			if (pixPos.y < 0.1){
				if (pixPos.y > 0.){
					C.r = 1.0000001;
				}
			}
		}
	}
	
    outFvfs = C ;	



    return ;
}
