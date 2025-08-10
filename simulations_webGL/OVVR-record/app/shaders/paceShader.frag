#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * paceShader   :   pace a location of the domain
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 19 Jul 2017 12:31:30 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
precision highp float;
precision highp int ;

/*------------------------------------------------------------------------
 * Interface variables : 
 * varyings change to "in" types in fragment shaders 
 * and "out" in vertexShaders
 *------------------------------------------------------------------------
 */
in vec2 pixPos ;


uniform sampler2D   inMap ;
uniform vec2        pacePosition ;
uniform float       paceValue ;
uniform float       paceRadius ;
uniform float       minVlt, maxVlt ;
uniform bool        circular ;

/*------------------------------------------------------------------------
 * It turns out for my current graphics card the maximum number of 
 * drawBuffers is limited to 8 
 *------------------------------------------------------------------------
 */
layout (location =0)    out vec4 outMap ;

/*========================================================================
 * Main body of the shader
 *========================================================================
 */
void main() {
    vec4 map = texture( inMap, pixPos ) ;
    vec2 diffVec = pixPos - pacePosition ;
    
    if ( circular ){
        if ( length(pixPos-pacePosition)<paceRadius ){
            map.r = paceValue ;
            map.g = (paceValue - minVlt)/(maxVlt-minVlt) ;
        }
    } else{
        if (abs(pixPos.x - pacePosition.x) < paceRadius ){
            map.r = paceValue ;
            map.g = (paceValue - minVlt)/(maxVlt-minVlt) ;
        }
    }

    outMap = map ;
    return ;
}
