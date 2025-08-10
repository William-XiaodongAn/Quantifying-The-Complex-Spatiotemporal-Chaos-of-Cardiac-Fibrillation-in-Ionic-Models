#version 300 es
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * compShader   :   Beeler-Reuter Compute Shader
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 26 Jul 2017 10:36:21 AM EDT
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

uniform sampler2D   inVfs ;

uniform float       ds_x, ds_y ;
uniform float       dt ;
uniform float       diffCoef, C_m ;

uniform float       tau_pv, 
                    tau_v1, 
                    tau_v2, 
                    tau_pw, 
                    tau_mw, 
                    tau_d, 
                    tau_0, 
                    tau_r,
                    tau_si,
                    K,
                    V_sic, 
                    V_c,
                    V_v ;

uniform float   C_si ;

#define vSampler  inVfs 

/*------------------------------------------------------------------------
 * It turns out for my current graphics card the maximum number of 
 * drawBuffers is limited to 8 
 *------------------------------------------------------------------------
 */
layout (location = 0 )  out vec4 outVfs ;

/*========================================================================
 * Tanh
 *========================================================================
 */
float Tanh(float x){
    if ( x < -3.) return -1. ;
    if ( x > 3. ) return 1.  ;
    else return x*(27.+x*x)/(27.+9.*x*x) ;
}

/*========================================================================
 * Main body of the shader
 *========================================================================
 */
void main() {
    vec2    cc = pixPos ;
    vec2    size    = vec2(textureSize( vSampler, 0 ) );
    float   cddx    = size.x/ds_x ;
    float   cddy    = size.y/ds_y ;

    cddx *= cddx ;
    cddy *= cddy ;

/*------------------------------------------------------------------------
 * reading from textures
 *------------------------------------------------------------------------
 */
    vec4    C = texture( inVfs , pixPos ) ;
    float   vlt = C.r ;
    float   fig = C.g ;
    float   sig = C.b ;

/*-------------------------------------------------------------------------
 * Calculating right hand side vars
 *-------------------------------------------------------------------------
 */
    float p = step(V_c, vlt) ;
    float q = step(V_v, vlt) ;

    float tau_mv = (1.0-q)*tau_v1   +  q*tau_v2 ;

    float Ifi  = -fig*p*(vlt - V_c)*(1.0-vlt)/tau_d ;
    float Iso  =  vlt*(1.0  - p )/tau_0 + p/tau_r ;

    float tn = Tanh(K*(vlt-V_sic)) ;
    float Isi  = -sig*(1.0  + tn) /(2.0*tau_si) ;
    Isi *= C_si ;
    float dFig2dt  = (1.0-p)*(1.0-fig)/tau_mv - p*fig/tau_pv ;
    float dSig2dt  = (1.0-p)*(1.0-sig)/tau_mw - p*sig/tau_pw ;

    fig += dFig2dt*dt ;
    sig += dSig2dt*dt ;

/*-------------------------------------------------------------------------
 * Laplacian
 *-------------------------------------------------------------------------
 */
    vec2 ii = vec2(1.0,0.0)/size ;
    vec2 jj = vec2(0.0,1.0)/size ;    
    
    float gamma = 1./3. ;

    float dVlt2dt = (1.-gamma)*((   texture(vSampler,cc+ii).r
                                -   2.0*C.r
                                +   texture(vSampler,cc-ii).r     )*cddx
                            +   (   texture(vSampler,cc+jj).r
                                -   2.0*C.r
                                +   texture(vSampler,cc-jj).r     )*cddy  )

                +   gamma*0.5*(     texture(vSampler,cc+ii+jj).r
                                +   texture(vSampler,cc+ii-jj).r
                                +   texture(vSampler,cc-ii-jj).r
                                +   texture(vSampler,cc-ii+jj).r
                                -   4.0*C.r               )*(cddx + cddy) ;
    dVlt2dt *= diffCoef ;

/*------------------------------------------------------------------------
 * I_sum
 *------------------------------------------------------------------------
 */
    float I_sum = Isi + Ifi + Iso ;

/*------------------------------------------------------------------------
 * Time integration for membrane potential
 *------------------------------------------------------------------------
 */
    dVlt2dt -= I_sum/C_m ;
    vlt += dVlt2dt*dt ;
	
/*------------------------------------------------------------------------
 * 	new_vlt = vlt + dVlt2dt*dt
 *	dVlt2dt = Laplacian*diffCoef - (
 *		-sig*(1.0  + Tanh(K*(vlt-V_sic))) /(2.0*tau_si)
 *		-fig*step(V_c, vlt)*(vlt - V_c)*(1.0-vlt)/tau_d  
 *		+ vlt*(1.0  - step(V_c, vlt) )/tau_0 + step(V_c, vlt)/tau_r
 *	)/C_m
 *------------------------------------------------------------------------
 */	

	float dnew_vlt2dvlt = 1. + (diffCoef * ( (1.-gamma)* (-2.*cddx - 2.*cddy) + 0.5 * gamma * -4.0 * (cddx + cddy) )) * dt ;
	dnew_vlt2dvlt -= (-sig*(1.0 - Tanh(K*(vlt-V_sic)) * Tanh(K*(vlt-V_sic))) /(2.0*tau_si)
		-fig*step(V_c, vlt)*(1.0 - 2.0 * vlt + V_c)/tau_d  
		+ (1.0  - step(V_c, vlt) )/tau_0
	)/C_m * dt ;

/*------------------------------------------------------------------------
 * ouputing the shader
 *------------------------------------------------------------------------
 */

    outVfs = vec4(vlt,fig,sig,1.0);

    return ;
}
