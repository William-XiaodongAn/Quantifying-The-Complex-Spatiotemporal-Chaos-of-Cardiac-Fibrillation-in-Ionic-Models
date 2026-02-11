#version 300 es
/*========================================================================
 * clickShader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 14 Sep 2016 03:53:08 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *========================================================================
 */
#include precision.glsl

/*------------------------------------------------------------------------
 * Interface variables
 *------------------------------------------------------------------------
 */

in      vec2        pixPos ;
uniform sampler2D   map ;
uniform vec2        clickPosition ;
uniform vec4        clickValue ;
uniform float       clickRadius ;
uniform float       time ;

/*------------------------------------------------------------------------
 * output colors
 *------------------------------------------------------------------------
 */
layout (location = 0 )  out vec4 FragColor ;

/*=========================================================================
 * Main body of Buffer Swap Shader 
 *=========================================================================
 */
void main()
{
	vec2 clickPosition2 = vec2(-0.2,0);
	float clickRadius2 = 0.;	

	

    vec4 t = texture(map,pixPos) ;
    vec2 diffVec = pixPos - clickPosition ;
    if (length(diffVec) < clickRadius ){
        t.r = clickValue.r ;
    }

	
    vec2 diffVec2 = pixPos - clickPosition2 ;
    if (length(diffVec2) < clickRadius2 ){
        t.r = clickValue.r ;
    }		

    FragColor = t ;
}