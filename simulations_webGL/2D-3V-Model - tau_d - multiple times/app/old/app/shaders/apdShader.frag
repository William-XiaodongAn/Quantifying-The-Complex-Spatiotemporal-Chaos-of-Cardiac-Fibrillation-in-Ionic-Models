#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * apdAndCvShader.frag
 * -------------------
 * Calculate action potential duration and the conduction velocity using
 * this shader.
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Thu 11 Jun 2020 17:21:44 (EDT)
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
#include precision.glsl

in vec2 cc, pixPos ;

uniform float       threshold ;
uniform float       ds_x ;
uniform float       ds_y ;
uniform float       cvDist ;

uniform sampler2D   in_txtr0 ;
uniform sampler2D   in_colr0 ;
uniform sampler2D   in_colr1 ;

// output colors .........................................................
layout (location = 0 ) out vec4 out_colr0 ;
layout (location = 1 ) out vec4 out_colr1 ;

/*------------------------------------------------------------------------
 * macros
 *------------------------------------------------------------------------
 */
#define v               colrt.r
#define time            colrt.g

// Action potential start time
#define apStartTime     colr0.r
#define AP_START_TIME   r

// Action potential end time
#define apEndTime       colr0.g
#define AP_END_TIME     g

// Action potential has started
#define apStarted       colr0.b
#define AP_STARTED      b 

// Last Action Potential Start Time
#define lastApStartTime     colr0.a 
#define LAST_AP_START_TIME  a 

// Basic Cycle Length
#define bcl             colr1.r
#define BCL             r 

// Diastolic interval
#define di              colr1.g
#define DI              g

// Action Potential Duration
#define apd             colr1.b
#define APD             b

// Conduction velocity
#define cv              colr1.a
#define CV              a

/*========================================================================
 * gradient of voltage signal 
 *========================================================================
 */
vec2 gradient(sampler2D _t, vec2 i, vec2 j){
    float dv2dx = (texture(_t, cc + i ) - texture(_t, cc-i)).r ;
    float dv2dy = (texture(_t, cc + j ) - texture(_t, cc-j)).r ;
    return normalize(vec2(dv2dx,dv2dy)) ; 
}

/*========================================================================
 * main body of the shader
 *========================================================================
 */
void main(){
    // localize values ...................................................
    vec4 colrt = texture(in_txtr0 , cc ) ;
    vec4 colr0 = texture(in_colr0 , cc ) ;
    vec4 colr1 = texture(in_colr1 , cc ) ;

    // unit vectors ......................................................
    vec2 size  = vec2(textureSize(in_txtr0 , 0).xy) ;
    vec2 ii = vec2(1.,0.)/size ;
    vec2 jj = vec2(0.,1.)/size ;

    if ( apStarted > 0.5 ){
        if ( v < threshold ){
            apStarted = 0. ;
            apEndTime = time ; 
            apd = apEndTime - apStartTime ;
            bcl = apStartTime - lastApStartTime ;
            lastApStartTime = apStartTime ;
        }
    }else{
        if ( v > threshold ){
            apStarted = 1.0 ;
            apStartTime = time ;
            di = apStartTime - apEndTime ;

            vec2    gv = gradient( in_txtr0, ii,jj) ;
            float   lx = cvDist/ds_x ;
            float   DT ;
            DT = time -
                texture( in_colr0, cc+lx*gv ).AP_START_TIME  ;
            cv = 1000.*cvDist/DT ;
        }
    }

    // output calculated colors ..........................................
    out_colr0 = vec4(   colr0  ) ;
    out_colr1 = vec4(   colr1   ) ;
    return ;
}
