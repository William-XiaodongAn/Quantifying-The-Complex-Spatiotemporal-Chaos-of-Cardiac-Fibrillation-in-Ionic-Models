/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * WEBGL 2.0    :   2D O'Hara-Rudy Model
 *
 * PROGRAMMER   :   ABOUZAR KABOUDIAN
 * DATE         :   Wed 30 Aug 2017 05:44:10 PM EDT
 * PLACE        :   Chaos Lab @ GaTech, Atlanta, GA
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
define([    'require',
            'shader!vertShader.vert',
            'shader!s1initShader.frag',
            'shader!s2initShader.frag',
            'shader!s1compShader.frag',
            'shader!s2compShader.frag',
            'shader!crntShader.frag',
            'shader!bvltShader.frag',
            'shader!clickShader.frag',
            'shader!paceShader.frag',
            'shader!apdShader.frag',
            'shader!apdInit.frag',
			'shader!willShader.frag',
			'shader!will2Shader.frag',
			'shader!sampler.frag'
            ],
function(   require,
            vertShader,
            s1initShader,
            s2initShader,
            s1compShader,
            s2compShader,
            crntShader,
            bvltShader,
            clickShader,
            paceShader,
            apdShader,
            apdInitShader,
			willShader,
			will2Shader,
			samplerShader
            ){
"use strict" ;

/*========================================================================
 * Global Parameters
 *========================================================================
 */
var log = console.log ;
var params ;
var env ;
var version = "OVVR_2.2" ;

/*========================================================================
 * switchEpiEndoMid
 *========================================================================
 */
function switchEpiEndoMid(){

    switch( env.epiEndoMid ){
        case  'Epicardium' :
            env[ 'SGNalate'      ] = 0.6 ;
            env[ 'SGto'          ] = 4.0 ;
            env[ 'SPCa'          ] = 1.2 ;
            env[ 'SGKr'          ] = 1.3 ;
            env[ 'SGKs'          ] = 1.4 ;
            env[ 'SGK1'          ] = 1.2 ;
            env[ 'SGNaCa'        ] = 1.1 ;
            env[ 'SGNaK'         ] = 0.9 ;
            env[ 'SGKb'          ] = 0.6 ;
            env[ 'SJrel'         ] = 1.0 ;
            env[ 'SJup'          ] = 1.3 ;
            env[ 'SCMDN'         ] = 1.3 ;

            env.cellType = env.EPI ;
            env.breakTime = 270 ;

            break ;
        case 'Endocardium' :
            env[ 'SGNalate'      ] = 1.0 ;
            env[ 'SGto'          ] = 1.0 ;
            env[ 'SPCa'          ] = 1.0 ;
            env[ 'SGKr'          ] = 1.0 ;
            env[ 'SGKs'          ] = 1.0 ;
            env[ 'SGK1'          ] = 1.0 ;
            env[ 'SGNaCa'        ] = 1.0 ;
            env[ 'SGNaK'         ] = 1.0 ;
            env[ 'SGKb'          ] = 1.0 ;
            env[ 'SJrel'         ] = 1.0 ;
            env[ 'SJup'          ] = 1.0 ;
            env[ 'SCMDN'         ] = 1.0 ;

            env.cellType    = env.ENDO ;
            env.breakTime   = 270 ;

            break ;

        case    'Mid-Myocardium'    :
            env[ 'SGNalate'      ] = 1.0 ;
            env[ 'SGto'          ] = 4.0 ;
            env[ 'SPCa'          ] = 2.5 ;
            env[ 'SGKr'          ] = 0.8 ;
            env[ 'SGKs'          ] = 1.0 ;
            env[ 'SGK1'          ] = 1.3 ;
            env[ 'SGNaCa'        ] = 1.5 ;
            env[ 'SGNaK'         ] = 0.7 ;
            env[ 'SGKb'          ] = 1.0 ;
            env[ 'SJrel'         ] = 1.7 ;
            env[ 'SJup'          ] = 1.0 ;
            env[ 'SCMDN'         ] = 1.0 ;
            env.breakTime = 350 ;
            env.cellType = env.MID ;
            break ;
    }
    Abubu.setUniformsInSolvers(
            [   'cellType'                  ] ,
            [   env.cellType                ] ,
            [   env.s2comp1, env.s2comp2    ] ) ;
    Abubu.setUniformsInSolvers(
            [
            'SGNalate' ,
            'SGto'     ,
            'SPCa'     ,
            'SGKr'     ,
            'SGKs'     ,
            'SGK1'     ,
            'SGNaCa'   ,
            'SGNaK'    ,
            'SGKb'     ,
            'SJrel'    ,
            'SJup'     ,
            'SCMDN'
            ] ,
            [
            env.SGNalate ,
            env.SGto     ,
            env.SPCa     ,
            env.SGKr     ,
            env.SGKs     ,
            env.SGK1     ,
            env.SGNaCa   ,
            env.SGNaK    ,
            env.SGKb     ,
            env.SJrel    ,
            env.SJup     ,
            env.SCMDN
            ] ,
            [
                env.s1comp1,
            env.s1comp2,
            env.s2comp1,
            env.s2comp2
            ]   ) ;
    return ;
}

/*========================================================================
 * createGui
 *========================================================================
 */
function createGui(){
    env.gui = new Abubu.Gui() ;

    env.gui_1 = env.gui.addPanel({width:300, autoplace:false }) ;
    env.gui_2 = env.gui.addPanel({width:300                  }) ;
    env.gui_3 = env.gui.addPanel({width:300                  }) ;

/*-------------------------------------------------------------------------
 * Model Parameters
 *-------------------------------------------------------------------------
 */
    env.gui_1.mdlPrmFldr  =   env.gui_1.addFolder( 'Model Parameters'   ) ;
    env.gui_1.mdlPrmFldr
            .add( env, 'epiEndoMid',
                [
                    'Endocardium',
                    'Epicardium',
                    'Mid-Myocardium'    ] )
        .name('Cell Type')
        .onChange(function(){
                switchEpiEndoMid() ;
                env.gui_1.vltBreak.breakTime.updateDisplay() ;
        }) ;

    switchEpiEndoMid() ;

    addCoeficients(     env.gui_1.mdlPrmFldr, ['C_m', 'diffCoef'] ,
                        [env.s2comp1,env.s2comp2, env.crnt], {min:0}) ;

/*------------------------------------------------------------------------
 * extracellular concentrations
 *------------------------------------------------------------------------
 */
    env.gui_1.eccFldr = env.gui_1.addFolder('Extra-Cellular Concentrations') ;
    addCoeficients( env.gui_1.eccFldr , [ 'Ca_o', 'Na_o', 'K_o' ] ,
            [ env.s2comp1, env.s2comp2, env.crnt ] ) ;

/*------------------------------------------------------------------------
 * Time Coeficients
 *------------------------------------------------------------------------
 */
    env.gui_2.tcfPrmFldr = env.gui_2.addFolder( 'Time Coeficients' ) ;
    addCoeficients(
        env.gui_2.tcfPrmFldr, [
            'Ct_m'        ,
            'Ct_h'        ,
            'Ct_j'        ,
            'Ct_hCaMKslow',
            'Ct_hslow'    ,
            'Ct_mL'       ,
            'Ct_jCaMK'    ,
            'Ct_hL'       ,
            'Ct_hLCaMK'   ,
            'Ct_a'        ,
            'Ct_ifast'    ,
            'Ct_islow'    ,
            'Ct_aCaMK'    ,
            'Ct_iCaMKfast',
            'Ct_iCaMKslow',
            'Ct_d'        ,
            'Ct_ffast'    ,
            'Ct_fslow'    ,
            'Ct_fCafast'  ,
            'Ct_fCaslow'  ,
            'Ct_jCa'      ,
            'Ct_fCaMKfast',
            'Ct_fCaCaMKfast' ,
            'Ct_n'        ,
            'Ct_xrfast'   ,
            'Ct_xrslow'   ,
            'Ct_xs1'      ,
            'Ct_xs2'      ,
            'Ct_xk1'      ,
            'Ct_relNP'    ,
            'Ct_relCaMK'  ,
            'Ct_tr'       ,
            'Ct_diffCa'   ,
            'Ct_diffNa'   ,
            'Ct_diffK'    ,
        ] ,
        [
            env.s1comp1,
            env.s1comp2,
            env.s2comp1,
            env.s2comp2,
            env.crnt,
        ] , { precision :3 } ) ;

/*------------------------------------------------------------------------
 * Current Multipliers
 *------------------------------------------------------------------------
 */
    env.gui_2.crtPrmFldr = env.gui_2.addFolder( 'Current Multipliers' ) ;
    addCoeficients(
        env.gui_2.crtPrmFldr ,
        [
            'C_Na'       ,
            'C_NaCa'     ,
            'C_to'       ,
            'C_CaL'      ,
            'C_CaNa'     ,
            'C_CaK'      ,
            'C_Kr'       ,
            'C_Ks'       ,
            'C_K1'       ,
            'C_NaCai'    ,
            'C_NaCass'   ,
            'C_NaKNa'    ,
            'C_NaKK'     ,
            'C_NaK'      ,
            'C_Nab'      ,
            'C_Kb'       ,
            'C_Cab'      ,
            'C_pCa'      ,
            'C_relNP'    ,
            'C_relCaMK'  ,
            'C_upNP'     ,
            'C_upCaMK'   ,
            'C_leak'     ,
            'C_up'       ,
            'C_tr'       ,
            'C_rel'      ,
            'C_diffCa'   ,
            'C_diffNa'   ,
            'C_diffK'
        ] ,
        [
            env.s2comp1,
            env.s2comp2,
            env.crnt ,
        ], { precision :3 } ) ;

/*------------------------------------------------------------------------
 * Solver Parameters
 *------------------------------------------------------------------------
 */
    env.gui_1.slvPrmFldr  = env.gui_1.addFolder( 'Solver Parameters' ) ;
    env.gui_1.slvPrmFldr.add( env, 'dt').name('Delta t').onChange(
         function(){
            Abubu.setUniformInSolvers('dt', env.dt,
                    [env.s1comp1,env.s1comp2, env.s2comp1, env.s2comp2 ]) ;
         }
    );

    env.gui_1.slvPrmFldr.add( env, 'ds_x' ).name( 'Domain size-x').onChange(
        function(){
            Abubu.setUniformInSolvers('ds_x', env.ds_x,
                    [env.s2comp1,env.s2comp2, env.fapd, env.sapd ]) ;
        }
    ) ;
    env.gui_1.slvPrmFldr.add( env, 'ds_y' ).name( 'Domain size-y').onChange(
        function(){
            Abubu.setUniformInSolvers('ds_y', env.ds_y,
                    [env.s2comp1,env.s2comp2, env.fapd, env.sapd ]) ;
        }
    ) ;

    env.gui_1.slvPrmFldr.add( env, 'width').name( 'x-resolution' )
    .onChange( function(){
        Abubu.resizeRenderTargets(
                [
                    env.fmhhj,  
                    env.fhjmh,  
                    env.fjhee,  
                    env.fjaii,  
                    env.faiid,  
                    env.fffff,  
                    env.fjffn,  
                    env.fxxxx,  
                    env.fvvxc,  
                    env.fcccc,  
                    env.fkknn,  
                    env.smhhj,  
                    env.shjmh,  
                    env.sjhee,  
                    env.sjaii,  
                    env.saiid,  
                    env.sffff,  
                    env.sjffn,  
                    env.sxxxx,  
                    env.svvxc,  
                    env.scccc,  
                    env.skknn,  
                    env.cica ,  
                    env.cick ,  
                    env.cikn ,  
                    env.cinc ,  
                    env.fttxr, 
                    env.sttxr, 
                    env.fapd0,
                    env.fapd1,
                    env.sapd0,
                    env.sapd1,
            ], env.width, env.height);
            env.disp.setSize( env.width, env.height) ;
    } ) ;

    env.gui_1.slvPrmFldr.add( env, 'height').name( 'y-resolution' )
    .onChange( function(){
       Abubu.resizeRenderTargets(
                [
                    env.fmhhj,  
                    env.fhjmh,  
                    env.fjhee,  
                    env.fjaii,  
                    env.faiid,  
                    env.fffff,  
                    env.fjffn,  
                    env.fxxxx,  
                    env.fvvxc,  
                    env.fcccc,  
                    env.fkknn,  
                    env.smhhj,  
                    env.shjmh,  
                    env.sjhee,  
                    env.sjaii,  
                    env.saiid,  
                    env.sffff,  
                    env.sjffn,  
                    env.sxxxx,  
                    env.svvxc,  
                    env.scccc,  
                    env.skknn,  
                    env.cica ,  
                    env.cick ,  
                    env.cikn ,  
                    env.cinc ,  
                    env.fttxr, 
                    env.sttxr, 
                    env.fapd0,
                    env.fapd1,
                    env.sapd0,
                    env.sapd1,
            ], env.width, env.height);
            env.disp.setSize( env.width, env.height) ;
    } ) ;

/*------------------------------------------------------------------------
 * Increment
 *------------------------------------------------------------------------
 */
    env.gui_1.incPrmFldr = env.gui_1.addFolder( 'Increment Parameter' ) ;
    env.gui_1.incPrmFldr.add( env , 'incrPrm' )
        .name('Param to Increment' ) ;
    env.gui_1.incPrmFldr.add( env , 'incrmnt' )
        .name('Increment'          ) ;
    env.gui_1.incPrmFldr.add( env , 'applyIncrement' )
        .name('Apply Increment' ) ;
    env.gui_1.incPrmFldr.open() ;

/*------------------------------------------------------------------------
 * Display Parameters
 *------------------------------------------------------------------------
 */
    env.gui_1.dspPrmFldr  = env.gui_1.addFolder( 'Display Parameters' ) ;
    env.gui_1.dspPrmFldr.add( env, 'colormap',
            Abubu.getColormapList())
                .onChange(  function(){
                                env.disp.setColormap(env.colormap);
                                refreshDisplay() ;
                            }   ).name('Colormap') ;
    env.gui_1.dspPrmFldr.add( env, 'dispTitleVisible')
        .name('Title Visible?').
        onChange(function(){
                env.dispTitle.setVisiblity(env.dispTitleVisible) ;
                env.dispCredit.setVisiblity(env.dispTitleVisible) ;
                env.disp.initForeground() ;
                refreshDisplay() ;
        } ) ;
    env.gui_1.dspPrmFldr
        .add( env, 'dispClrbVisible')
        .name('Show Colorbar?')
        .onChange(function(){
                env.disp.setColorbarVisiblity(env.dispClrbVisible) ;
                refreshDisplay() ;
                } ) ;
    env.gui_1.dspPrmFldr.add( env, 'probePositionX')
        .onChange( function(){
                env.updateProbePosition() ;
        } ) ;
    env.gui_1.dspPrmFldr.add( env, 'probePositionY')
        .onChange( function(){
                env.updateProbePosition() ;
        } ) ;


    env.gui_1.dspPrmFldr.add( env, 'probeVisiblity')
        .name('Probe Visiblity')
        .onChange(function(){
            env.disp.setProbeVisiblity(env.probeVisiblity);
            refreshDisplay() ;
        } ) ;


    env.gui_1.dspPrmFldr.add( env, 'tiptVisiblity' )
        .name('Plot Tip Trajectory?')
        .onChange(function(){
            env.disp.setTiptVisiblity(env.tiptVisiblity) ;
            refreshDisplay() ;
        } ) ;
    env.gui_1.dspPrmFldr.add( env, 'tiptThickness').min(0)
        .onChange(function(){
            env.disp.setTiptThickness(env.tiptThickness) ;
            refreshDisplay() ;
        } ) ;

    env.gui_1.dspPrmFldr.add( env, 'tiptThreshold')
        .name( 'Tip Threshold [mv]')
        .onChange( function(){
                env.disp.setTiptThreshold( env.tiptThreshold ) ;
                } ) ;

    env.gui_1.dspPrmFldr.add( env, 'frameRate')
        .name('Frame Rate Limit')
        .min(60).max(40000).step(60) ;
    env.gui_1.dspPrmFldr.add( env, 'saveClrPlotPrefix')
        .name('File Name Prefix') ;
    env.gui_1.dspPrmFldr.add( env, 'saveClrPlot' );

/*------------------------------------------------------------------------
 * vltSignal
 *------------------------------------------------------------------------
 */
    env.gui_1.vltSignal = env.gui_1.dspPrmFldr.addFolder('Voltage Signal');
    env.gui_1.vltTimeWindow = env.gui_1.vltSignal.add( env, 'timeWindow')
        .name('Time Window [ms]')
    .onChange( function(){
        env.plot.updateTimeWindow(env.timeWindow) ;
        env.cplt.updateTimeWindow(env.timeWindow) ;
        refreshDisplay() ;
        env.gui_1.crntTimeWindow.updateDisplay() ;
    } ) ;
    env.gui_1.vltSignal.add(env , 'saveVltPlotPrefix').name('File Name Prefix') ;
    env.gui_1.vltSignal.add(env , 'saveVltPlot') ;
   // env.gui_1.vltSignal.open() ;

/*------------------------------------------------------------------------
 * current plot
 *------------------------------------------------------------------------
 */
    env.gui_1.crntFldr = env.gui_1.dspPrmFldr.addFolder('Current Plot') ;
    env.gui_1.crntFldr.add( env, 'dispCurrent', [
            'I_sum',
            'I_CaL',
            'I_CaNa',
            'I_pCa',
            'I_Cab',
            'I_CaK',
            'I_Ks',
            'I_Kr',
            'I_K1',
            'I_Kb',
            'I_NaK',
            'I_Nab',
            'I_Na',
            'I_NaCa',
            'I_to'   ] )
        .onChange(function(){
                env.cplt.visibleCurrent.hide() ;
                env.cplt.visibleCurrent = env.cplt[env.dispCurrent] ;
                env.cplt.visibleCurrent.show() ;
                env.cplt.setTitle(
                        env.dispCurrent+' current at the probe') ;
                env.crntMax = env.cplt.visibleCurrent.maxValue ;
                env.crntMin = env.cplt.visibleCurrent.minValue ;
                env.cplt.setMinValue( env.cplt.visibleCurrent.minValue ) ;
                env.cplt.setMaxValue( env.cplt.visibleCurrent.maxValue ) ;
                env.gui_1.crntMax.updateDisplay() ;
                env.gui_1.crntMin.updateDisplay() ;
        } ) ;
    env.gui_1.crntMax = env.gui_1.crntFldr.add( env , 'crntMax' )
        .onChange(function(){
           env.cplt.setMaxValue( env.crntMax ) ;
           env.cplt.visibleCurrent.setMaxValue(env.crntMax) ;
        } ) ;
    env.gui_1.crntMin = env.gui_1.crntFldr.add( env , 'crntMin' )
        .onChange(function(){
           env.cplt.setMinValue( env.crntMin ) ;
           env.cplt.visibleCurrent.setMinValue(env.crntMin) ;
        } ) ;

    env.gui_1.crntTimeWindow =env.gui_1.crntFldr.add( env, 'timeWindow')
        .name('Time Window [ms]')
    .onChange( function(){
        env.plot.updateTimeWindow(env.timeWindow) ;
        env.cplt.updateTimeWindow(env.timeWindow) ;
        env.gui_1.vltTimeWindow.updateDisplay() ;
        refreshDisplay() ;
    } ) ;

    env.gui_1.crntFldr.add( env ,'cntPltPrefix' ).name('File Name Prefix') ;
    env.gui_1.crntFldr.add( env ,'saveCrntPlot' ) ;

    env.gui_1.dspPrmFldr.open() ;
/*------------------------------------------------------------------------
 * record
 *------------------------------------------------------------------------
 */
    env.gui_1.rec = env.gui_1.addFolder('Record Voltage @ Probe' ) ;
    env.gui_1.rec.recording = env.gui_1.rec.add(env, 'rec_recording')
    .name('recording?').onChange(
        function(){
            env.rec_recorder.setRecordingStatus( env.rec_recording ) ;
            env.current_recorder.setRecordingStatus( env.rec_recording ) ;
        } ).listen() ;
    env.gui_1.rec.add(env, 'rec_toggleRecording' ).name('toggle') ;
    env.gui_1.rec.add(env, 'rec_interval') .onChange(function(){
        env.rec_recorder.setSampleRate(env.rec_interval) ;
        env.current_recorder.setSampleRate(env.rec_interval) ;
    } ) ;
    env.gui_1.rec.add(env, 'rec_reset' ).name('reset') ;
    env.gui_1.rec.add(env, 'rec_fileName').name('file name') ;
    env.gui_1.rec.add(env, 'current_fileName').name('file name for current') ;
    env.gui_1.rec.add(env, 'rec_save' ).name('save') ;

/*------------------------------------------------------------------------
 * apd
 *------------------------------------------------------------------------
 */
    env.gui_1.apdFldr = env.gui_1.addFolder( 'APD Measurement' ) ;
    env.gui_1.apdFldr.add( env.apd , 'measuring').onChange(function(){
        //env.apd.probe.setMeasuring(env.apd.measuring) ;
    } ) ;
    env.gui_1.apdFldr.add( env.apd , 'threshold' ).onChange(function(){
        env.fapd.uniforms.threshold.value = env.apd.threshold ;
        env.sapd.uniforms.threshold.value = env.apd.threshold ;
    } ) ;

    env.gui_1.apdFldr.add( env.apd, 'cvDist').name('CVM [cm]')
        .onChange(function(){
            env.fapd.uniforms.cvDist.value = env.apd.cvDist ;
            env.sapd.uniforms.cvDist.value = env.apd.cvDist ;
 
        } ) ;
    env.gui_1.apdFldr.add( env, 'BCL').listen();
    env.gui_1.apdFldr.add( env, 'DI' ).listen();
    env.gui_1.apdFldr.add( env, 'APD').listen();
    env.gui_1.apdFldr.add( env, 'CV').name('CV [cm/s]').step(0.001).listen() ;
    env.gui_1.apdFldr.add( env.ApdCvRecorder, 'reset' ).name('reset recorder' ) ;
    env.gui_1.apdFldr.add( env.ApdCvRecorder, 'save' ).name('save recorder' ) ;

    env.gui_1.apdFldr.open() ;

/*------------------------------------------------------------------------
 * vltBreak
 *------------------------------------------------------------------------
 */
    env.gui_1.vltBreak = env.gui_1.addFolder( 'Break Voltage' );
    env.gui_1.vltBreak.add( env, 'vltBreak' ).name( 'Autobreak?') ;
    env.gui_1.vltBreak.add( env, 'ry'         ).onChange(function(){
        env.breakVlt.setUniform('ry', env.ry) ;
    } ) ;
    env.gui_1.vltBreak.breakTime = env.gui_1.vltBreak.add( env, 'breakTime').name('Break Time [ms]') ;

/*------------------------------------------------------------------------
 * Simulation
 *------------------------------------------------------------------------
 */
    env.gui_3.smlPrmFldr  = env.gui_3.addFolder(    'Simulation'    ) ;
    env.gui_3.smlPrmFldr.add( env,  'clickRadius' )
        .min(0.01).max(1.0).step(0.01)
        .name('Click Radius')
        .onChange(function(){
                env.click.setUniform('clickRadius',env.clickRadius) ;
                } ) ;
    env.gui_3.smlPrmFldr.clicker = env.gui_3.smlPrmFldr.add( env,
        'clicker',
        [
            'Pace Region',
            'Signal Loc. Picker',
            'Pace-Maker Location'  ] ).name('Clicker Type') ;

    env.gui_3.smlPrmFldr.add( env, 'time').name('Solution Time [ms]')
        .listen() ;

    env.gui_3.smlPrmFldr.add( env, 'solve').name('Solve/Pause') ;

    env.gui_3.smlPrmFldr.add( env, 'restInitCond')
        .name('Uniform Rest Init')
        .onChange(function(){
                Abubu.setUniformsInSolvers(
                        ['restInitCond'],
                        [ env.restInitCond ],
                        [ env.fs2init, env.ss2init ]  ) ;
        } ) ;
    env.gui_3.smlPrmFldr.add( env, 'initialize').name('Initialize') ;
    env.gui_3.smlPrmFldr.open() ;

/*------------------------------------------------------------------------
 * paceMaker
 *------------------------------------------------------------------------
 */
    env.gui_3.pcmkr  = env.gui_3.addFolder( "Pace Maker") ;
    env.gui_3.pcmkr.add(env, 'paceMakerActive').name('Active?')
        .onChange(function(){
                env.paceMakerCaller.setActivity(env.paceMakerActive) ;
        } ) ;

    env.gui_3.pcmkr.add( env, 'paceMakerCircular')
        .onChange( function(){
                env.paceMakerSolver
                    .setUniform('circular', env.paceMakerCircular) ;
        } ) ;

    env.gui_3.pcmkr.add( env, 'paceMakerPeriod' )
        .onChange( function(){
                env.paceMakerCaller.setInterval(env.paceMakerPeriod) ;
        } ) ;

    env.gui_3.pcmkr.add( env, 'paceMakerRadius' )
        .onChange( function(){
                env.paceMakerSolver
                    .setUniform('paceRadius', env.paceMakerRadius ) ;
                }
        ) ;


    env.gui_3.pcmkr.add( env, 'paceMakerPositionX')
        .onChange(function(){
                env.updatePacePosition() ;
        } ) ;
    env.gui_3.pcmkr.add( env, 'paceMakerPositionY')
        .onChange(function(){
                env.updatePacePosition() ;
        } ) ;

    env.gui_3.pcmkr.add( env, 'paceMakerPickPosition')
        .name('Pick Pace Position') ;


/*------------------------------------------------------------------------
 * Inteval Caller
 *------------------------------------------------------------------------
 */
    env.gui_3.intFldr = env.gui_3.addFolder( 'Interval Caller' ) ;
    env.gui_3.intFldr.add(env, 'autocall').name('Active?')
        .onChange(function(){
                env.intervalCaller.setActivity(env.autocall);
                } ) ;
    env.gui_3.intFldr.add(env, 'autoCallback').name('Callback')
        .onChange(function(){
                env.intervalCaller.setCallback(function(){
                        try{ eval(env.autoCallback); }
                        catch(e){log('Error in Interval Caller'); log(e);} } ) } );
    env.gui_3.intFldr.add(env, 'autocallInterval').name('interval')
        .onChange(function(){
                env.intervalCaller
                    .setInterval(env.autocallInterval)
                    } ) ;
    env.gui_3.intFldr.open() ;

/*------------------------------------------------------------------------
 * save and load setup
 *------------------------------------------------------------------------
 */
    env.gui_3.svld = env.gui_3.addFolder( 'Save and load setup' ) ;
    env.gui_3.svld.add( env, 'restoreDefaults' ) ;
    env.gui_3.svld.add( env, 'storeSetup') ;

    env.gui_3.svld.add( env.inputSetup, 'click').name('Load XML File') ;

    env.gui_3.svld.add( env , 'comments' ) ;
    env.gui_3.svld.add( env, 'outputSetupFileName').name('File Name') ;
    env.gui_3.svld.add( env, 'outputSetupClick').name('Save XML File') ;

/*------------------------------------------------------------------------
 * addCoeficients
 *------------------------------------------------------------------------
 */
    function addCoeficients( fldr,
            coefs,
            solvers ,
            options ){
        var coefGui = {} ;
        var min = undefined ;
        var max = undefined ;
        var precision = undefined ;
        if (options != undefined ){
            if (options.min != undefined ){
                min = options.min ;
            }
            if (options.max != undefined ){
                max = options.max ;
            }
            if (options.precision != undefined ){
                precision = options.precision ;
            }
        }
        for(var i=0; i<coefs.length; i++){
            var coef = addCoef(fldr,coefs[i],solvers) ;
            if (min != undefined ){
                coef.min(min) ;
            }
            if (max != undefined ){
                coef.max(max) ;
            }
            if (precision != undefined ){
                coef.__precision=precision ;
            }
            coefGui[coefs[i]] = coef ;
        }
        return coefGui ;

        /* addCoef */
        function addCoef( fldr,
                coef,
                solvers     ){
            var coefGui =   fldr.add( env, coef )
                .onChange(
                        function(){
                        Abubu.setUniformInSolvers(  coef,
                                env[coef],
                                solvers  ) ;
                        } ) ;
            fldr[coef] = coefGui ;
            return coefGui ;

        }
    }
    env.gui.updateDisplay({verbose : false}) ;

    return ;
} /* End of createGui */

/*========================================================================
 * saveList
 *========================================================================
 */
var saveList = [
 'comments',
 'C_m' , 'diffCoef', 'minVlt', 'maxVlt', 'Ca_o', 'Na_o', 'K_o',
 'Ct_m' , 'Ct_h' , 'Ct_j' , 'Ct_hCaMKslow', 'Ct_hslow' , 'Ct_mL' ,
 'Ct_jCaMK' , 'Ct_hL' , 'Ct_hLCaMK' , 'Ct_a' , 'Ct_ifast' ,
 'Ct_islow' , 'Ct_aCaMK' , 'Ct_iCaMKfast', 'Ct_iCaMKslow',
 'Ct_d', 'Ct_ffast', 'Ct_fslow' , 'Ct_fCafast' , 'Ct_fCaslow' ,
 'Ct_jCa', 'Ct_fCaMKfast', 'Ct_fCaCaMKfast' , 'Ct_n' , 'Ct_xrfast',
 'Ct_xrslow' , 'Ct_xs1' , 'Ct_xs2' , 'Ct_xk1' ,
 'Ct_relNP' , 'Ct_relCaMK' , 'Ct_tr' , 'Ct_diffCa' ,
 'Ct_diffNa' , 'Ct_diffK' ,
 'C_Na' ,  'C_NaCa' ,  'C_to' ,  'C_CaL' ,  'C_CaNa' ,  'C_CaK' ,  'C_Kr' ,
 'C_Ks' ,  'C_K1' ,  'C_NaCai' ,  'C_NaCass' ,  'C_NaKNa' ,  'C_NaKK' ,
 'C_NaK' ,  'C_Nab' ,  'C_Kb' ,  'C_Cab' ,  'C_pCa' ,  'C_relNP' ,
 'C_relCaMK' ,  'C_upNP' ,  'C_upCaMK' ,  'C_leak' ,  'C_up' ,  'C_tr' ,
 'C_rel' ,  'C_diffCa' ,  'C_diffNa' ,  'C_diffK' ,
 'epiEndoMid',
 'colormap', 'dispWidth', 'dispHeight', 'frameRate', 'timeWindow',
 'probeVisiblity', 'dispTitleVisible', 'dispClrbVisible',
 'probePositionX', 'probePositionY',
 'saveClrPlotPrefix',
 'tiptVisiblity', 'tiptThreshold','tiptThickness', 'tiptColor',
 'saveVltPlotPrefix', 'dispCurrent', 'crntMin', 'crntMax',
 'cntPltPrefix',
 'rec_recording', 'rec_interval', 'rec_fileName',
 'incrPrm', 'incrmnt',
 'paceMakerPositionX','paceMakerPositionY',
 'paceMakerCircular', 'paceMakerActive', 'paceMakerPeriod',
 'paceMakerRadius', 'paceMakerValue',
 'restInitCond', 'clicker', 'ry', 'vltBreak', 'breakTime',
 'autostop', 'autostopInterval', 'autocall', 'autoCallback',
 'autocallInterval','outputSetupFileName' ] ;

/*========================================================================
 * loadSetupFromXML
 *========================================================================
 */
function loadSetupFromXML(){
    Abubu.loadFromXML({
            input   : env.inputSetup ,
            obj     : env ,
            names   : saveList,
            callback : function(){
                env.gui.updateDisplay({verbose:false});
             } ,
            } ) ;
    env.initialize() ;
}

/*========================================================================
 * saveSetupToXML
 *========================================================================
 */
function saveSetupToXML(){
    storeSetup() ;
    var fn ;

    try{
        fn = eval( env.outputSetupFileName ) ;
    }catch(e){
        fn = env.outputSetupFileName ;
    }

    Abubu.saveToXML({
            fileName : fn ,
            obj     : env,
            names   : saveList,
            } ) ;
}

/*========================================================================
 * store function
 *========================================================================
 */
function storeSetup(){
    env.storage.storeAsXML({ xml : 'setup',
            obj : env, names : saveList } ) ;
}

/*========================================================================
 * restoreSetup
 *========================================================================
 */
function restoreSetup(){
    env.storage.restoreFromXML( { xml: 'setup',
            obj : env, names : saveList } ) ;
}


/*========================================================================
 * Environment
 *========================================================================
 */
function Environment(){
	
	this.skip = 20;
	
    this.storage = new Abubu.Storage({prefix: version}) ;

    this.running = false ;

    /* Model Parameters         */
    this.C_m        = 1.0 ;
    this.diffCoef   = 0.001 ;

    this.minVlt     = -100 ;
    this.maxVlt     = 50 ;

    /* Extra-cellular concenterations */
    this.Ca_o       = 1.8 ;
    this.Na_o       = 140 ;
    this.K_o        = 5.4 ;

    /* Current Multipliers      */
    this.C_Na       = 1.0 ;
    this.C_NaCa     = 1.0 ;
    this.C_to       = 1.0 ;
    this.C_CaL      = 1.0 ;
    this.C_CaNa     = 1.0 ;
    this.C_CaK      = 1.0 ;
    this.C_Kr       = 1.0 ;
    this.C_Ks       = 1.0 ;
    this.C_K1       = 1.0 ;
    this.C_NaCai    = 1.0 ;
    this.C_NaCass   = 1.0 ;
    this.C_NaKNa    = 1.0 ;
    this.C_NaKK     = 1.0 ;
    this.C_NaK      = 1.0 ;
    this.C_Nab      = 1.0 ;
    this.C_Kb       = 1.0 ;
    this.C_Cab      = 1.0 ;
    this.C_pCa      = 1.0 ;
    this.C_relNP    = 1.0 ;
    this.C_relCaMK  = 1.0 ;
    this.C_upNP     = 1.0 ;
    this.C_upCaMK   = 1.0 ;
    this.C_leak     = 1.0 ;
    this.C_up       = 1.0 ;
    this.C_tr       = 1.0 ;
    this.C_rel      = 1.0 ;
    this.C_diffCa   = 1.0 ;
    this.C_diffNa   = 1.0 ;
    this.C_diffK    = 1.0 ;

    /* Time Factor Multipliers  */
    this.Ct_m        =   1.0 ;
    this.Ct_h        =   1.0 ;
    this.Ct_j        =   1.0 ;
    this.Ct_hCaMKslow=   1.0 ;
    this.Ct_hslow    =   1.0 ;
    this.Ct_mL       =   1.0 ;
    this.Ct_jCaMK    =   1.0 ;
    this.Ct_hL       =   1.0 ;
    this.Ct_hLCaMK   =   1.0 ;
    this.Ct_a        =   1.0 ;
    this.Ct_ifast    =   1.0 ;
    this.Ct_islow    =   1.0 ;
    this.Ct_aCaMK    =   1.0 ;
    this.Ct_iCaMKfast=   1.0 ;
    this.Ct_iCaMKslow=   1.0 ;
    this.Ct_d        =   1.0 ;
    this.Ct_ffast    =   1.0 ;
    this.Ct_fslow    =   1.0 ;
    this.Ct_fCafast  =   1.0 ;
    this.Ct_fCaslow  =   1.0 ;
    this.Ct_jCa      =   1.0 ;
    this.Ct_fCaMKfast=   1.0 ;
    this.Ct_fCaCaMKfast =    1.0 ;
    this.Ct_n        =   1.0 ;
    this.Ct_xrfast   =   1.0 ;
    this.Ct_xrslow   =   1.0 ;
    this.Ct_xs1      =   1.0 ;
    this.Ct_xs2      =   1.0 ;
    this.Ct_xk1      =   1.0 ;
    this.Ct_relNP    =   1.0 ;
    this.Ct_relCaMK  =   1.0 ;
    this.Ct_tr       =   1.0 ;
    this.Ct_diffCa   =   1.0 ;
    this.Ct_diffNa   =   1.0 ;
    this.Ct_diffK    =   1.0 ;

    /* Scaling Factors          */
    this.EPI         = 0 ;
    this.ENDO        = 1 ;
    this.MID         = 2 ;
    this.cellType    =  this.MID ;
    this.epiEndoMid  =  'Mid-Myocardium';
    this.SGNalate    =  1.0 ;
    this.SGto        =  4.0 ;
    this.SPCa        =  2.5 ;
    this.SGKr        =  0.8 ;
    this.SGKs        =  1.0 ;
    this.SGK1        =  1.3 ;
    this.SGNaCa      =  1.5 ;
    this.SGNaK       =  0.7 ;
    this.SGKb        =  1.0 ;
    this.SJrel       =  1.7 ;
    this.SJup        =  1.0 ;
    this.SCMDN       =  1.0 ;

    /* Display Parameters       */
    this.colormap    =   'rainbowHotSpring';
    this.dispWidth   =   512 ;
    this.dispHeight  =   512 ;
    this.frameRate   =   1200 ;
    this.timeWindow  =   1000 ;
    this.probeVisiblity = false ;
    this.probePositionX = 0.5 ;
    this.probePositionY = 0.5 ;
    this.updateProbePosition = function(){
        var pos = [ env.probePositionX, env.probePositionY ] ;
        env.plot.setProbePosition( pos ) ;
        env.cplt.setProbePosition( pos ) ;
        env.disp.setProbePosition( pos ) ;
        //env.apd.probe.reset({probePosition : pos }) ;
        env.rec_probe.setPosition( new Float32Array(pos) ) ;
        env.plot.init() ;
        env.cplt.init() ;
        refreshDisplay() ;
    } ;

    this.dispTitleVisible = false ;
    this.dispClrbVisible = false ;

    this.saveClrPlotPrefix = '' ;
    this.saveClrPlot    = function(){
        var prefix ;
        try{
            prefix = eval(env.saveClrPlotPrefix) ;
        }catch(e){
            prefix = this.saveClrPlotPrefix ;
        }

        if (prefix == undefined ){
            prefix = this.saveClrPlotPrefix ;
        }else{
            prefix = prefix + '_' ;
        }

        Abubu.saveCanvas( 'canvas_1',
        {
          //  number  : this.time ,
            postfix : '_'+this.colormap ,
            prefix  : prefix,
            format  : 'png'
        } ) ;
    }

    this.tiptVisiblity= false ;
    this.tiptThreshold=  -70.;
    this.tiptThickness= 5 ;
    this.tiptColor    = "#FFFFFF";

    this.saveVltPlotPrefix = '' ;
    this.saveVltPlot = function(){
        var prefix ;
        try{
            prefix = eval(env.saveVltPlotPrefix) ;
        }catch(e){
            prefix = this.saveVltPlotPrefix ;
        }

        if (prefix == undefined ){
            prefix = this.cntPltPrefix ;
        }else{
            prefix = prefix + '_' ;
        }

        Abubu.saveCanvas( 'canvas_2',
        {
            number  : this.time ,
            postfix : '_vlt',
            prefix  : prefix,
            format  : 'png'
        } ) ;
    }

    /* Current Signal           */
    this.dispCurrent = 'I_sum',
    this.crntMin    = -10 ;
    this.crntMax    = 6 ;
    this.cntPltPrefix = '' ;
    this.saveCrntPlot    = function(){
        var prefix ;
        try{
            prefix = eval(this.cntPltPrefix) ;
        }catch(e){
            prefix = this.cntPltPrefix ;
        }
        if (prefix == undefined ){
            prefix = this.cntPltPrefix ;
        }

        Abubu.saveCanvas( 'canvas_3',
        {
            number  : this.time ,
            prefix  : this.dispCurrent+'_'+prefix+'_' ,
            postfix : '',
            format  : 'png'
        } ) ;
    }

    /* Recording */
    this.rec_recording = false ;
    this.rec_toggleRecording = function(){
        env.rec_recording = !env.rec_recording ;
        env.rec_recorder.setRecordingStatus(this.recording) ;
        env.current_recorder.setRecordingStatus(this.recording) ;

    } ;
    this.rec_reset = function(){
        env.rec_recorder.resetRecording(); 
        env.current_recorder.resetRecording(); 
        
    },
    this.rec_interval = 10 ;
    this.rec_fileName = 'vlt.dat' ;
    this.rec_save = function(){
        var fileName ;
        var current_fileName ;
        try{
            fileName = eval(env.rec_fileName) ;
        }catch(e){
            fileName = env.rec_fileName ;
        }
        if ( fileName == undefined ){
            fileName = 'vlt.dat' ;
        }

        try{
            current_fileName = eval(env.current_fileName) ;
        }catch(e){
            current_fileName = "current.dat" ;
        }

        env.rec_recorder.setFileName(fileName) ;
        env.current_recorder.setFileName(current_fileName) ;
        env.rec_recorder.save() ;
        env.current_recorder.save() ;
    } ;

    /* Increment */
    this.incrPrm = '' ;
    this.incrmnt = 0.1 ;
    this.applyIncrement = function(){
        try{
            eval( this.incrPrm+'+=' + this.incrmnt +';') ;
            for(var i=0; i<env.gui_2.tcfPrmFldr.__controllers.length;i++){
                env.gui_2.tcfPrmFldr.__controllers[i].updateDisplay() ;
                env.gui_2.tcfPrmFldr.__controllers[i].__onChange() ;
            }
            for(var i=0; i<env.gui_2.crtPrmFldr.__controllers.length;i++){
                env.gui_2.crtPrmFldr.__controllers[i].updateDisplay() ;
                env.gui_2.crtPrmFldr.__controllers[i].__onChange() ;
            }
        }catch(e){
            console.log( e,'incrementation failed!') ;
        }
    } ;

    /* APD Measuremnet */
    this.apd = {} ;
    this.apd.measuring = false ;
    this.apd.APD = 0. ;
    this.apd.BCL = 0. ;
    this.apd.DI = 0.0 ;
    this.apd.CV = 0.0 ;
    this.apd.threshold = -75 ;
    this.apd.cvDist = 0.125 ;

    this.runScript = function(){
        /* getting a restitution curve 
        if (env.paceMakerPeriod < 200){ env.running = false ; return ;} 
        if (env.paceMakerNumber < 20 ) return ;
        env.ApdCvRecorder.save() ;
        env.paceMakerNumber = 0 ;
        env.paceMakerPeriod -= 25 ;
        env.gui.updateDisplay({verbose : false}) ;
        env.initialize() ;
        env.ApdCvRecorder.reset() ;
        */
    }

    /* Solver Parameters        */
    this.width       =   512 ;
    this.height      =   512 ;
    this.dt          =   8.e-2 ;
    this.cfl         =   1.0 ;
    this.ds_x        =   16 ;
    this.ds_y        =   16 ;

    /* Autopace                 */
    this.paceMakerNumber = 0 ;
    this.paceMakerValue     = 0. ;
    this.paceMakerCircular = true ;
    this.paceMakerActive   = false ;
    this.paceMakerPeriod   = 1000 ;
    this.paceMakerPositionX = 0.5 ;
    this.paceMakerPositionY = 0.5 ;
    this.paceMakerConstantDI = false ;
    this.updatePacePosition = function(){
        env.paceMakerSolver.setUniform('pacePosition',
                [ env.paceMakerPositionX, env.paceMakerPositionY] ) ;
    }


    this.paceMakerRadius   = 0.01 ;
    this.paceMakerValue    = 10 ;
    this.paceMakerPickPosition = function(){
        env.clicker = 'Pace-Maker Location' ;
        env.gui_3.smlPrmFldr.clicker.updateDisplay() ;
    }

    this.restInitCond   = false ;
    /* Solve                    */
    this.solve       = function(){
        storeSetup() ;
        this.running = !this.running ;
        return ;
    } ;
    this.time        = 0.0 ;
    this.clicker     = 'Pace Region';
    this.oldClicker  = this.clicker;

    this.ry          = 0.5 ;
    this.vltBreak    = false ;
    this.breakTime   = 270 ;
    this.notBreaked  = true ;

    this.autostop    = false;
    this.autostopInterval = 300 ;

    /* Clicker                  */
    this.clickRadius     = 0.1 ;
    this.clickPosition   = [0.5,0.5] ;
    this.conductionValue = [-83.0,0,0] ;
    this.paceValue       = [0,0,0,0] ;


    /* intervalCaller */
    this.autocall = false ;
    this.autoCallback = '' ;
    this.autocallInterval = 300 ;

    this.storeDefaults = function(){
        env.storage.storeAsXML({ xml : 'defaults',
            obj : env, names : saveList } ) ;
    }

    this.restoreDefaults = function(){
        env.storage.restoreFromXML( { xml: 'defaults',
            obj : env, names : saveList } ) ;
        env.gui.updateDisplay() ;
        env.initialize() ;
    }

    this.storeSetup = storeSetup ;

    this.inputSetup = document.createElement('input') ;
    this.inputSetup.setAttribute('type', 'file') ;
    this.inputSetup.onchange = loadSetupFromXML ;

    this.outputSetup = {} ;
    this.comments = '' ;
    this.outputSetupFileName = 'setup.xml' ;
    this.outputSetupClick = saveSetupToXML ;

}
/*========================================================================
 * Initialization of the GPU and Container
 *========================================================================
 */
function loadWebGL()
{
    var canvas_1 = document.getElementById("canvas_1") ;
    var canvas_2 = document.getElementById("canvas_2") ;
    var canvas_3 = document.getElementById("canvas_3") ;

    canvas_1.width = 512 ;
    canvas_1.height = 512 ;

    env = new Environment() ;
    window.env = env; 
    params = env ;

    env.storeDefaults() ;
    restoreSetup() ;

/*-------------------------------------------------------------------------
 * stats
 *-------------------------------------------------------------------------
 */
    var stats       = new Stats() ;
    document.body.appendChild( stats.domElement ) ;

/*------------------------------------------------------------------------
 * defining all render targets
 *------------------------------------------------------------------------
 */
    env.fmhhj   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fhjmh   = new Abubu.Float32Texture(env.width, env.height) ;

    env.fjhee   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fjaii   = new Abubu.Float32Texture(env.width, env.height) ;
    env.faiid   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fffff   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fjffn   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fxxxx   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fvvxc   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fcccc   = new Abubu.Float32Texture(env.width, env.height) ;
    env.fkknn   = new Abubu.Float32Texture(env.width, env.height) ;
    
    env.smhhj   = new Abubu.Float32Texture(env.width, env.height) ;
    env.shjmh   = new Abubu.Float32Texture(env.width, env.height) ;

    env.sjhee   = new Abubu.Float32Texture(env.width, env.height) ;
    env.sjaii   = new Abubu.Float32Texture(env.width, env.height) ;
    env.saiid   = new Abubu.Float32Texture(env.width, env.height) ;
    env.sffff   = new Abubu.Float32Texture(env.width, env.height) ;
    env.sjffn   = new Abubu.Float32Texture(env.width, env.height) ;
    env.sxxxx   = new Abubu.Float32Texture(env.width, env.height) ;
    env.svvxc   = new Abubu.Float32Texture(env.width, env.height) ;
    env.scccc   = new Abubu.Float32Texture(env.width, env.height) ;
    env.skknn   = new Abubu.Float32Texture(env.width, env.height) ;

    env.cica    = new Abubu.Float32Texture(env.width, env.height) ;
    env.cick    = new Abubu.Float32Texture(env.width, env.height) ;
    env.cikn    = new Abubu.Float32Texture(env.width, env.height) ;
    env.cinc    = new Abubu.Float32Texture(env.width, env.height) ;

    env.fttxr   = new Abubu.Float32Texture(env.width, env.height) ;
    env.sttxr   = new Abubu.Float32Texture(env.width, env.height) ;
    
    env.fapd0   = new Abubu.Float32Texture( env.width, env.height ) ;
    env.fapd1   = new Abubu.Float32Texture( env.width, env.height ) ;

    env.sapd0   = new Abubu.Float32Texture( env.width, env.height ) ;
    env.sapd1   = new Abubu.Float32Texture( env.width, env.height ) ;

/*------------------------------------------------------------------------
 * s1 and s2 Targets
 *------------------------------------------------------------------------
 */
    env.s1Targets = function(
            _aiid,
            _ffff,
            _jffn,
            _xxxx   ){
        this.aiidOut = { location : 0, target : _aiid } ;
        this.ffffOut = { location : 1, target : _ffff } ;
        this.jffnOut = { location : 2, target : _jffn } ;
        this.xxxxOut = { location : 3, target : _xxxx } ;
    } ;
    env.s2Targets = function(
            _mhhj,
            _hjmh,
            _jhee,
            _jaii,
            _vvxc,
            _cccc,
            _kknn,
            _ttxr, ){
        this.mhhjOut = { location : 0, target : _mhhj } ;
        this.hjmhOut = { location : 1, target : _hjmh } ;
        this.jheeOut = { location : 2, target : _jhee } ;
        this.jaiiOut = { location : 3, target : _jaii } ;
        this.vvxcOut = { location : 4, target : _vvxc } ;
        this.ccccOut = { location : 5, target : _cccc } ;
        this.kknnOut = { location : 6, target : _kknn } ;
        this.ttxrOut = { location : 7, target : _ttxr } ;
    } ;

/*------------------------------------------------------------------------
 * s1init
 *------------------------------------------------------------------------
 */
    env.fs1init  = new Abubu.Solver( {
       fragmentShader  : s1initShader.value ,
       vertexShader    : vertShader.value ,
       renderTargets   : new env.s1Targets( env.faiid, env.fffff ,
                                            env.fjffn, env.fxxxx  ) ,
    } ) ;
    env.ss1init  = new Abubu.Solver( {
       fragmentShader  : s1initShader.value ,
       vertexShader    : vertShader.value ,
       renderTargets   : new env.s1Targets( env.saiid, env.sffff ,
                                            env.sjffn, env.sxxxx  ) ,
    } ) ;
/*------------------------------------------------------------------------
 * s2init
 *------------------------------------------------------------------------
 */

    env.s2initUniforms = function(){
        this.minVlt = { type : 'f', value : env.minVlt } ;
        this.maxVlt = { type : 'f', value : env.maxVlt } ;
        this.restInitCond = {type : 'b', value : env.restInitCond } ;
    }

    env.fs2init = new Abubu.Solver({
        vertexShader    :   vertShader.value ,
        fragmentShader  :   s2initShader.value ,
        uniforms        :   new env.s2initUniforms() ,
        renderTargets   :   new env.s2Targets(
                                env.fmhhj ,
                                env.fhjmh ,
                                env.fjhee ,
                                env.fjaii ,
                                env.fvvxc ,
                                env.fcccc ,
                                env.fkknn ,
                                env.fttxr ,
        ) ,
    } ) ;

    env.ss2init = new Abubu.Solver({
        vertexShader    :   vertShader.value ,
        fragmentShader  :   s2initShader.value ,
        uniforms        :   new env.s2initUniforms() ,
        renderTargets   :   new env.s2Targets(
                                env.smhhj ,
                                env.shjmh ,
                                env.sjhee ,
                                env.sjaii ,
                                env.svvxc ,
                                env.scccc ,
                                env.skknn ,
                                env.sttxr ,
        ) ,
    } ) ;

/*------------------------------------------------------------------------
 * s1comp1 and s1comp2 solvers for time stepping
 *------------------------------------------------------------------------
 */
    env.s1compUniforms = function(
            _aiid,
            _ffff,
            _jffn,
            _xxxx,
            _jhee,
            _jaii,
            _vvxc,
            _cccc,
            _kknn ){

        /* other            */
        this.dt             = { type : 'f', value : env.dt          } ;

        /* input variable textures */
        this.aiidIn         = { type : 't', value : _aiid           } ;
        this.ffffIn         = { type : 't', value : _ffff           } ;
        this.jffnIn         = { type : 't', value : _jffn           } ;
        this.xxxxIn         = { type : 't', value : _xxxx           } ;
        this.jheeIn         = { type : 't', value : _jhee           } ;
        this.jaiiIn         = { type : 't', value : _jaii           } ;
        this.vvxcIn         = { type : 't', value : _vvxc           } ;
        this.ccccIn         = { type : 't', value : _cccc           } ;
        this.kknnIn         = { type : 't', value : _kknn           } ;

        /* Time Factor Multipliers  */
        this.Ct_m           = { type : 'f', value : env.Ct_m        } ;
        this.Ct_h           = { type : 'f', value : env.Ct_h        } ;
        this.Ct_j           = { type : 'f', value : env.Ct_j        } ;
        this.Ct_hCaMKslow   = { type : 'f', value : env.Ct_hCaMKslow} ;
        this.Ct_hslow       = { type : 'f', value : env.Ct_hslow    } ;
        this.Ct_mL          = { type : 'f', value : env.Ct_mL       } ;
        this.Ct_jCaMK       = { type : 'f', value : env.Ct_jCaMK    } ;
        this.Ct_hL          = { type : 'f', value : env.Ct_hL       } ;
        this.Ct_hLCaMK      = { type : 'f', value : env.Ct_hLCaMK   } ;
        this.Ct_a           = { type : 'f', value : env.Ct_a        } ;
        this.Ct_ifast       = { type : 'f', value : env.Ct_ifast    } ;
        this.Ct_islow       = { type : 'f', value : env.Ct_islow    } ;
        this.Ct_aCaMK       = { type : 'f', value : env.Ct_aCaMK    } ;
        this.Ct_iCaMKfast   = { type : 'f', value : env.Ct_iCaMKfast} ;
        this.Ct_iCaMKslow   = { type : 'f', value : env.Ct_iCaMKslow} ;
        this.Ct_d           = { type : 'f', value : env.Ct_d        } ;
        this.Ct_ffast       = { type : 'f', value : env.Ct_ffast    } ;
        this.Ct_fslow       = { type : 'f', value : env.Ct_fslow    } ;
        this.Ct_fCafast     = { type : 'f', value : env.Ct_fCafast  } ;
        this.Ct_fCaslow     = { type : 'f', value : env.Ct_fCaslow  } ;
        this.Ct_jCa         = { type : 'f', value : env.Ct_jCa      } ;
        this.Ct_fCaMKfast   = { type : 'f', value : env.Ct_fCaMKfast} ;
        this.Ct_fCaCaMKfast = { type : 'f', value : env.Ct_fCaCaMKfast } ;
        this.Ct_n           = { type : 'f', value : env.Ct_n        } ;
        this.Ct_xrfast      = { type : 'f', value : env.Ct_xrfast   } ;
        this.Ct_xrslow      = { type : 'f', value : env.Ct_xrslow   } ;
        this.Ct_xs1         = { type : 'f', value : env.Ct_xs1      } ;
        this.Ct_xs2         = { type : 'f', value : env.Ct_xs2      } ;
        this.Ct_xk1         = { type : 'f', value : env.Ct_xk1      } ;
        this.Ct_relNP       = { type : 'f', value : env.Ct_relNP    } ;
        this.Ct_relCaMK     = { type : 'f', value : env.Ct_relCaMK  } ;
        this.Ct_tr          = { type : 'f', value : env.Ct_tr       } ;
        this.Ct_diffCa      = { type : 'f', value : env.Ct_diffCa   } ;
        this.Ct_diffNa      = { type : 'f', value : env.Ct_diffNa   } ;
        this.Ct_diffK       = { type : 'f', value : env.Ct_diffK    } ;

        /* Scaling Factors          */
        this.SGNalate       = { type : 'f', value : env.SGNalate    } ;
        this.SGto           = { type : 'f', value : env.SGto        } ;
        this.SPCa           = { type : 'f', value : env.SPCa        } ;
        this.SGKr           = { type : 'f', value : env.SGKr        } ;
        this.SGKs           = { type : 'f', value : env.SGKs        } ;
        this.SGK1           = { type : 'f', value : env.SGK1        } ;
        this.SGNaCa         = { type : 'f', value : env.SGNaCa      } ;
        this.SGNaK          = { type : 'f', value : env.SGNaK       } ;
        this.SGKb           = { type : 'f', value : env.SGKb        } ;
        this.SJrel          = { type : 'f', value : env.SJrel       } ;
        this.SJup           = { type : 'f', value : env.SJup        } ;
        this.SCMDN          = { type : 'f', value : env.SCMDN       } ;
    }

    /* s1comp1  */
    env.s1comp1 = new Abubu.Solver({
        vertexShader    :   vertShader.value ,
        fragmentShader  :   s1compShader.value ,
        uniforms        :
            new env.s1compUniforms(
                env.faiid,  env.fffff,  env.fjffn,
                env.fxxxx,  env.fjhee,  env.fjaii,
                env.fvvxc,  env.fcccc,  env.fkknn       ) ,
        renderTargets   :
            new env.s1Targets(
                env.saiid,
                env.sffff,
                env.sjffn,
                env.sxxxx       ) ,
    } ) ;

    /* s1comp1  */
    env.s1comp2 = new Abubu.Solver({
        vertexShader    :   vertShader.value ,
        fragmentShader  :   s1compShader.value ,
        uniforms        :
            new env.s1compUniforms(
                env.saiid,  env.sffff,  env.sjffn,
                env.sxxxx,  env.sjhee,  env.sjaii,
                env.svvxc,  env.scccc,  env.skknn       ) ,
        renderTargets   :
            new env.s1Targets(
                env.faiid,
                env.fffff,
                env.fjffn,
                env.fxxxx       ) ,
    } ) ;

/*------------------------------------------------------------------------
 * s2comp1 and s2comp2 solvers for time stepping
 *------------------------------------------------------------------------
 */
    env.s2compUniforms = function(
            _aiid,
            _ffff,
            _jffn,
            _xxxx,
            _mhhj,
            _hjmh,
            _jhee,
            _jaii,
            _vvxc,
            _cccc,
            _kknn,
            _ttxr,
    ){
        /* input variable textures */
        this.mhhjIn         = { type : 't', value : _mhhj           } ;
        this.hjmhIn         = { type : 't', value : _hjmh           } ;
        this.jheeIn         = { type : 't', value : _jhee           } ;
        this.jaiiIn         = { type : 't', value : _jaii           } ;
        this.aiidIn         = { type : 't', value : _aiid           } ;
        this.ffffIn         = { type : 't', value : _ffff           } ;
        this.jffnIn         = { type : 't', value : _jffn           } ;
        this.xxxxIn         = { type : 't', value : _xxxx           } ;
        this.vvxcIn         = { type : 't', value : _vvxc           } ;
        this.ccccIn         = { type : 't', value : _cccc           } ;
        this.kknnIn         = { type : 't', value : _kknn           } ;
        this.ttxrIn         = { type : 't', value : _ttxr           } ;

        /* uniform tables */
        this.Ca_o           = { type : 'f', value : env.Ca_o        } ;
        this.K_o            = { type : 'f', value : env.K_o         } ;
        this.Na_o           = { type : 'f', value : env.Na_o        } ;

        /* other            */
        this.dt             = { type : 'f', value : env.dt          } ;
        this.diffCoef       = { type : 'f', value : env.diffCoef    } ;
        this.C_m            = { type : 'f', value : env.C_m         } ;
        this.minVlt         = { type : 'f', value : env.minVlt      } ;
        this.maxVlt         = { type : 'f', value : env.maxVlt      } ;
        this.ds_x           = { type : 'f', value : env.ds_x        } ;
        this.ds_y           = { type : 'f', value : env.ds_y        } ;

        /* Time Factor Multipliers  */
        this.Ct_m           = { type : 'f', value : env.Ct_m        } ;
        this.Ct_h           = { type : 'f', value : env.Ct_h        } ;
        this.Ct_j           = { type : 'f', value : env.Ct_j        } ;
        this.Ct_hCaMKslow   = { type : 'f', value : env.Ct_hCaMKslow} ;
        this.Ct_hslow       = { type : 'f', value : env.Ct_hslow    } ;
        this.Ct_mL          = { type : 'f', value : env.Ct_mL       } ;
        this.Ct_jCaMK       = { type : 'f', value : env.Ct_jCaMK    } ;
        this.Ct_hL          = { type : 'f', value : env.Ct_hL       } ;
        this.Ct_hLCaMK      = { type : 'f', value : env.Ct_hLCaMK   } ;
        this.Ct_a           = { type : 'f', value : env.Ct_a        } ;
        this.Ct_ifast       = { type : 'f', value : env.Ct_ifast    } ;
        this.Ct_islow       = { type : 'f', value : env.Ct_islow    } ;
        this.Ct_aCaMK       = { type : 'f', value : env.Ct_aCaMK    } ;
        this.Ct_iCaMKfast   = { type : 'f', value : env.Ct_iCaMKfast} ;
        this.Ct_iCaMKslow   = { type : 'f', value : env.Ct_iCaMKslow} ;
        this.Ct_d           = { type : 'f', value : env.Ct_d        } ;
        this.Ct_ffast       = { type : 'f', value : env.Ct_ffast    } ;
        this.Ct_fslow       = { type : 'f', value : env.Ct_fslow    } ;
        this.Ct_fCafast     = { type : 'f', value : env.Ct_fCafast  } ;
        this.Ct_fCaslow     = { type : 'f', value : env.Ct_fCaslow  } ;
        this.Ct_jCa         = { type : 'f', value : env.Ct_jCa      } ;
        this.Ct_fCaMKfast   = { type : 'f', value : env.Ct_fCaMKfast} ;
        this.Ct_fCaCaMKfast = { type : 'f', value : env.Ct_fCaCaMKfast } ;
        this.Ct_n           = { type : 'f', value : env.Ct_n        } ;
        this.Ct_xrfast      = { type : 'f', value : env.Ct_xrfast   } ;
        this.Ct_xrslow      = { type : 'f', value : env.Ct_xrslow   } ;
        this.Ct_xs1         = { type : 'f', value : env.Ct_xs1      } ;
        this.Ct_xs2         = { type : 'f', value : env.Ct_xs2      } ;
        this.Ct_xk1         = { type : 'f', value : env.Ct_xk1      } ;
        this.Ct_relNP       = { type : 'f', value : env.Ct_relNP    } ;
        this.Ct_relCaMK     = { type : 'f', value : env.Ct_relCaMK  } ;
        this.Ct_tr          = { type : 'f', value : env.Ct_tr       } ;
        this.Ct_diffCa      = { type : 'f', value : env.Ct_diffCa   } ;
        this.Ct_diffNa      = { type : 'f', value : env.Ct_diffNa   } ;
        this.Ct_diffK       = { type : 'f', value : env.Ct_diffK    } ;

        /* current multipliers */
        this.C_Na           = { type : 'f', value : env.C_Na        } ;
        this.C_NaCa         = { type : 'f', value : env.C_NaCa      } ;
        this.C_to           = { type : 'f', value : env.C_to        } ;
        this.C_CaL          = { type : 'f', value : env.C_CaL       } ;
        this.C_CaNa         = { type : 'f', value : env.C_CaNa      } ;
        this.C_CaK          = { type : 'f', value : env.C_CaK       } ;
        this.C_Kr           = { type : 'f', value : env.C_Kr        } ;
        this.C_Ks           = { type : 'f', value : env.C_Ks        } ;
        this.C_K1           = { type : 'f', value : env.C_K1        } ;
        this.C_NaCai        = { type : 'f', value : env.C_NaCai     } ;
        this.C_NaCass       = { type : 'f', value : env.C_NaCass    } ;
        this.C_NaKNa        = { type : 'f', value : env.C_NaKNa     } ;
        this.C_NaKK         = { type : 'f', value : env.C_NaKK      } ;
        this.C_NaK          = { type : 'f', value : env.C_NaK       } ;
        this.C_Nab          = { type : 'f', value : env.C_Nab       } ;
        this.C_Kb           = { type : 'f', value : env.C_Kb        } ;
        this.C_Cab          = { type : 'f', value : env.C_Cab       } ;
        this.C_pCa          = { type : 'f', value : env.C_pCa       } ;
        this.C_relNP        = { type : 'f', value : env.C_relNP     } ;
        this.C_relCaMK      = { type : 'f', value : env.C_relCaMK   } ;
        this.C_upNP         = { type : 'f', value : env.C_upNP      } ;
        this.C_upCaMK       = { type : 'f', value : env.C_upCaMK    } ;
        this.C_leak         = { type : 'f', value : env.C_leak      } ;
        this.C_up           = { type : 'f', value : env.C_up        } ;
        this.C_tr           = { type : 'f', value : env.C_tr        } ;
        this.C_rel          = { type : 'f', value : env.C_rel       } ;
        this.C_diffCa       = { type : 'f', value : env.C_diffCa    } ;
        this.C_diffNa       = { type : 'f', value : env.C_diffNa    } ;
        this.C_diffK        = { type : 'f', value : env.C_diffK     } ;

        /* Scaling Factors          */
        this.SGNalate       = { type : 'f', value : env.SGNalate    } ;
        this.SGto           = { type : 'f', value : env.SGto        } ;
        this.SPCa           = { type : 'f', value : env.SPCa        } ;
        this.SGKr           = { type : 'f', value : env.SGKr        } ;
        this.SGKs           = { type : 'f', value : env.SGKs        } ;
        this.SGK1           = { type : 'f', value : env.SGK1        } ;
        this.SGNaCa         = { type : 'f', value : env.SGNaCa      } ;
        this.SGNaK          = { type : 'f', value : env.SGNaK       } ;
        this.SGKb           = { type : 'f', value : env.SGKb        } ;
        this.SJrel          = { type : 'f', value : env.SJrel       } ;
        this.SJup           = { type : 'f', value : env.SJup        } ;
        this.SCMDN          = { type : 'f', value : env.SCMDN       } ;

        this.cellType       = { type : 'i', value : env.cellType    } ;
    }
    /* s2comp1  */
    env.s2comp1 = new Abubu.Solver({
        vertexShader    :   vertShader.value ,
        fragmentShader  :   s2compShader.value ,
        uniforms        :
            new env.s2compUniforms(
                env.saiid,
                env.sffff,
                env.sjffn,
                env.sxxxx,
                env.fmhhj,
                env.fhjmh,
                env.fjhee,
                env.fjaii,
                env.fvvxc,
                env.fcccc,
                env.fkknn,
                env.fttxr,
            ) ,
        renderTargets   :
            new env.s2Targets(
                env.smhhj,
                env.shjmh,
                env.sjhee,
                env.sjaii,
                env.svvxc,
                env.scccc,
                env.skknn,
                env.sttxr,
            ) ,
    } ) ;

    env.s2comp2 = new Abubu.Solver({
        vertexShader    :   vertShader.value ,
        fragmentShader  :   s2compShader.value ,
        uniforms        :
            new env.s2compUniforms(
                env.faiid,
                env.fffff,
                env.fjffn,
                env.fxxxx,
                env.smhhj,
                env.shjmh,
                env.sjhee,
                env.sjaii,
                env.svvxc,
                env.scccc,
                env.skknn,
                env.sttxr,
            ) ,
        renderTargets   :
            new env.s2Targets(
                env.fmhhj,
                env.fhjmh,
                env.fjhee,
                env.fjaii,
                env.fvvxc,
                env.fcccc,
                env.fkknn,
                env.fttxr,
            ) ,
    } ) ;

/*------------------------------------------------------------------------
 * crnt solver
 *------------------------------------------------------------------------
 */
    env.crnt = new Abubu.Solver({
        vertexShader    : vertShader.value ,
        fragmentShader  : crntShader.value ,
        uniforms        : new env.s2compUniforms(
                env.saiid,
                env.sffff,
                env.sjffn,
                env.sxxxx,
                env.fmhhj,
                env.fhjmh,
                env.fjhee,
                env.fjaii,
                env.fvvxc,
                env.fcccc,
                env.fkknn       ) ,
        renderTargets   : {
          cica  : { location : 0 , target : env.cica } ,
          cick  : { location : 1 , target : env.cick } ,
          cikn  : { location : 2 , target : env.cikn } ,
          cinc  : { location : 3 , target : env.cinc } ,
        }
    } ) ;

/*------------------------------------------------------------------------
 * recorder.probe
 *------------------------------------------------------------------------
 */
    env.rec_probe = new Abubu.Probe( env.fvvxc, { channel : 'r',
            probePosition : [0.5,0.5] } ) ;
    env.rec_recorder = new Abubu.ProbeRecorder(env.rec_probe,
            {
                sampleRate : env.rec_interval,
                recording: env.rec_recording ,
                fileName : env.rec_fileName} ) ;
/*------------------------------------------------------------------------
 * current probe
 *------------------------------------------------------------------------
 */
    env.current_fileName = 'current.dat' ;

    // Choose the chanel you want to record
    // and choose the texture regarding current 
    // env.cica.r : ICaL 
    // env.cica.g : ICaNa
    // env.cica.b : IpCa
    // env.cica.a : ICab
    //
    // env.cick.r : ICaK
    // env.cick.g : IKs
    // env.cick.b : IKr
    // env.cick.a : IK1
    //
    // env.cikn.r : IKb
    // env.cikn.g : INaK
    // env.cikn.b : INab
    // env.cikn.a : INa
    //
    // env.cinc.r : INaCa 
    // env.cinc.g : Ito
    // env.cinc.b : ISum
    // env.cinc.a : ISum
    env.current_probe = new Abubu.Probe( env.cica, { channel : 'r',
            probePosition : [0.5,0.5] } ) ;
    env.current_recorder = new Abubu.ProbeRecorder( env.current_probe, 
        {
            sampleRate : env.rec_interval ,
            recording : env.recording ,
            fileName : env.current_fileName 
        } ) ;

/*------------------------------------------------------------------------
 * apd solver
 *------------------------------------------------------------------------
 */
    env.noAPDs              = 0 ;
    env.noIgnoredPaces      = 2 ;
    env.apdMeasuring        = true ;
    env.cvDist              = 0.1 ;
    env.APD                 = 0. ;
    env.DI                  = 0. ;
    env.BCL                 = 0. ;
    env.CV                  = 0. ;

    env.fapds = [   env.fapd0 , env.fapd1, env.fttxr   ] ;
    env.sapds = [   env.sapd0 , env.sapd1, env.sttxr   ] ;
    
    env.ApdUniforms = function( _at ){
        this.in_colr0   = { type : 's', value : _at[0] ,
            minFilter : 'linear',
            magFilter : 'linear'
        } ;
        this.in_colr1   = { type : 't', value : _at[1]          } ;
        this.in_txtr0   = { 
            type        : 's', 
            value       : _at[2] , 
            minFilter   : 'linear',
            magFilter   : 'linear' 
        } ;
        this.threshold  = { type : 'f', value : env.threshold   } ;
        this.ds_x       = { type : 'f', value : env.ds_x        } ;
        this.ds_y       = { type : 'f', value : env.ds_y        } ;
        this.cvDist     = { type : 'f', value : env.cvDist      } ;
    }
    
    env.ApdTargets = function( _at ){
        this.out_colr0  = { location :0 , target : _at[0] }  ;
        this.out_colr1  = { location :1 , target : _at[1] }  ;
    }
    
    env.fapd = new Abubu.Solver({
        fragmentShader : apdShader ,
        uniforms : new env.ApdUniforms( env.sapds ) ,
        targets : new env.ApdTargets( env.fapds ) ,
    } ) ;
    
    env.sapd = new Abubu.Solver({
        fragmentShader : apdShader ,
        uniforms : new env.ApdUniforms( env.fapds ) ,
        targets : new env.ApdTargets( env.sapds ) ,
    } ) ;
    
    env.apdProbe = new Abubu.Probe(
        env.fapd1 ,
        {
            probePosition : [ .5,.5] ,
        }
    ) ;
    env.apdEndProbe = new Abubu.Probe(
        env.fapd0 ,{
            probePosition : [.5,.5] ,
        }
    ) ;
// ApdCvRecorder .........................................................
env.ApdCvRecorder = new function(){
    /* recorder defaults */
    this.recording = true ;
    this.sampleRate = 10 ;

    /* header of the tab separated values */
    this.tsvHeader = "data:text;charset=utf-8,"+
        "%Period\tBCL\tDI\tAPD\tCV\n" ;
    this.tsvContent = "" ;      // content of the file
    this.lastline = "" ;        // last recorded line
    this.sampleNo = 0 ;         // current sampel no
    this.lastSampelNo = -1 ;    // last sample no

    this.sample = function(){
        /* ignore the first ignoredPacings */
        //if (env.time < ((this.ignoredPacings+1)*env.paceMakerPeriod) ) return ;
        
        /* if we are not recording don't sample any data */
        if (!this.recording) return ;
        
        this.sampleNo = Math.floor(env.time/this.sampleRate ) ;

        /* only issue a get pixel command if appropriate sample rate is
         * achieved */
        if ( this.sampleNo != this.lastSampleNo ){
            this.lastSampleNo = this.sampleNo ;
            var pb = env.apdProbe.getPixel() ;
            var ep = env.apdEndProbe.getPixel() ;
            var apEnded = (ep[2] < 0.5) ;
            var CL  = env.paceMakerPeriod ;
            var CDI = env.paceMakerDi ;
            var BCL = pb[0] ;
            var DI  = pb[1] ;
            var APD = pb[2] ;
            var CV  = pb[3] ;

            /* create a string line out of the probe data */
            var newline ;
            newline = 
                CL.toPrecision (4)  + '\t' +
                BCL.toPrecision(6)  + '\t' +
                DI.toPrecision (6)  + '\t' +
                APD.toPrecision(6)  + '\t' +
                CV.toPrecision (6)  + '\n' ;
                

            /* only record a new line if it is different from the last
             * recording & action potential is finished */
            if ( Math.abs(this.lastline.localeCompare(newline)) >0.5 &&
                 apEnded ){

                this.lastline = newline ;
                if ( env.noAPDs > env.noIgnoredPaces ){ 
                    this.tsvContent += newline ;
                    console.log(env.noAPDs,newline) ;
                }
                env.noAPDs++ ;
            }
        }
    }
    /* reset the recorder */
    this.reset = function(){
        this.tsvContent = "" ;
        this.lastline ="" ;
        this.lastSampelNo = -1 ;
        return this.tsvContent ;
    }

    /* save the recorded data to disk */
    this.save = function(){
        var link =  document.createElement('a') ;
        var tsvEncoded = encodeURI(this.tsvHeader + this.tsvContent ) ;
        link.setAttribute('href', tsvEncoded ) ;
        link.setAttribute('download', 
                "BCL_"
                +env.paceMakerPeriod + '.tsv' ) ;
        link.click() ;
    }
}
env.apdInit = new Abubu.Solver({
            vertexShader: vertShader.value ,
            fragmentShader: apdInitShader.value ,
            targets: { 
               colr0: { location : 0 , target : env.fapd0  } , 
               colr1: { location : 1 , target : env.fapd1  } , 
               colr2: { location : 2 , target : env.sapd0  } , 
               colr3: { location : 3 , target : env.sapd1  } , 
            } 
    } ) ;
    env.apdInit.render() ;

/*------------------------------------------------------------------------
 * apd
 *------------------------------------------------------------------------
 */
    env.apd.probe = new Abubu.Probe(
            env.fapd ,
            {
                probePosition : [0.5,0.5] 
            } ) ;
    env.apd.cvprobe = new Abubu.Probe(
            env.fcv ,
            {
                probePosition : [0.5,0.5] ,
            } 
    ) ;
    
/*------------------------------------------------------------------------
 * click solver
 *------------------------------------------------------------------------
 */
    env.click = new Abubu.Solver( {
        vertexShader    : vertShader.value ,
        fragmentShader  : clickShader.value ,
        uniforms        : {
            map         : { type: 't',  value : env.fvvxc           } ,
            clickValue   : { type: 'v4', value : [0,0,0,0 ]         } ,
            clickPosition: { type: 'v2', value : env.clickPosition  } ,
            clickRadius  : { type: 'f',  value : env.clickRadius    } ,
        } ,
        renderTargets   : {
            FragColor   : { location : 0,   target : env.svvxc      } ,
        } ,
        clear           : true ,
    } ) ;
    env.clickCopy = new Abubu.Copy(env.svvxc, env.fvvxc ) ;

/*------------------------------------------------------------------------
 * pace
 *------------------------------------------------------------------------
 */
    env.paceMakerSolver = new Abubu.Solver({
        vertexShader    : vertShader.value ,
        fragmentShader  : paceShader.value ,
        uniforms : {
            inMap       : { type : 't', value : env.fvvxc               } ,
            pacePosition: { type : 'v2',value :
                [ env.paceMakerPositionX, env.paceMakerPositionY]  } ,
            paceRadius  : { type : 'f', value : env.paceMakerRadius    } ,
            paceValue   : { type : 'f', value : env.paceMakerValue     } ,
            minVlt      : { type : 'f', value : env.minVlt              } ,
            maxVlt      : { type : 'f', value : env.maxVlt              } ,
            circular    : { type : 'b', value : env.paceMakerCircular  } ,
        } ,
        renderTargets :{
            outMap  : { location : 0 , target : env.svvxc   } ,
        } ,
        clear : true ,
    } ) ;

    env.paceMakerCaller = new Abubu.IntervalCaller({
        interval : env.paceMakerPeriod,
        callback : function(){
            env.paceMakerSolver.render() ;
            env.clickCopy.render() ;
            env.paceMakerNumber++ ;
        } ,
        active  : env.paceMakerActive
    } ) ;

/*------------------------------------------------------------------------
 * break
 *------------------------------------------------------------------------
 */
    env.breakVlt = new Abubu.Solver({
        vertexShader    : vertShader.value ,
        fragmentShader  : bvltShader.value ,
        uniforms: {
            map     : { type : 't', value : env.fvvxc   } ,
            minVlt  : { type : 'f', value : env.minVlt  } ,
            maxVlt  : { type : 'f', value : env.maxVlt  } ,
            ry      : { type : 'f', value : env.ry      } ,
        } ,
        targets : {
            FragColor : { location : 0 , target : env.svvxc } ,
        } ,
    } ) ;
    env.breakCopy = new Abubu.Copy( env.svvxc, env.fvvxc  ) ;

    env.breakVltNow = function(){
        env.breakVlt.render() ;
        env.breakCopy.render() ;
        env.notBreaked = false ;
        refreshDisplay() ;
    }

/*------------------------------------------------------------------------
 * Signal Plot
 *------------------------------------------------------------------------
 */
    env.plot = new Abubu.SignalPlot( {
            noPltPoints : 1024,
            grid        : 'on' ,
            nx          : 5 ,
            ny          : 6 ,
            xticks : { mode : 'auto', unit : 'ms', font:'11pt Times'} ,
            yticks : { mode : 'auto', unit : 'mv' } ,
            canvas      : canvas_2,
    });

    env.plot.addMessage(
            'Membrane Potential at the Probe',
                        0.5,0.05,
                    {   font : "12pt Times",
                        style : "#000000",
                        align: "center"                          } ) ;
    env.vsgn = env.plot.addSignal( env.fvvxc, {
            channel : 'r',
            minValue : -100 ,
            maxValue : 50 ,
            restValue: -87.84,
            color : [0.5,0,0],
            visible: true,
            linewidth : 3,
            timeWindow: env.timeWindow,
            probePosition : [0.5,0.5] , } ) ;

/*-------------------------------------------------------------------------
 * current plot
 *-------------------------------------------------------------------------
 */
    env.cplt = new Abubu.SignalPlot( {
            noPltPoints : 1024,
            grid        : 'on' ,
            nx          : 5 ,
            ny          : 10 ,
            xticks : { mode : 'auto', unit : 'ms', font:'11pt Times'} ,
            yticks : { mode : 'auto', unit : '', precision : 4, font:'12pt Times' } ,
            canvas      : canvas_3,
            callback    : function(){ env.crnt.render(); } ,
    });
    function addSignals ( signalList=[] ){
        for( var i=0; i < signalList.length ; i++){
            var signal = signalList[i] ;
            env.cplt[signal.name] = env.cplt.addSignal(
                    signal.txt, {
                        channel : signal.channel ,
                        minValue : -10 ,
                        maxValue : 6,
                        color : [0,0,0] ,
                        linewidth : 3,
                        probePosition : [0.5,0.5] ,
                        visible : false ,
                        } ) ;
        }
        return ;
    }

    addSignals( [
        { name: 'I_NaCa',    txt: env.cinc, channel: 'r' } ,
        { name: 'I_to',      txt: env.cinc, channel: 'g' } ,
        { name: 'I_sum',     txt: env.cinc, channel: 'b' } ,

        { name: 'I_CaL',     txt: env.cica, channel: 'r' } ,
        { name: 'I_CaNa',    txt: env.cica, channel: 'g' } ,
        { name: 'I_pCa',     txt: env.cica, channel: 'b' } ,
        { name: 'I_Cab',     txt: env.cica, channel: 'a' } ,

        { name: 'I_CaK',     txt: env.cick, channel: 'r' } ,
        { name: 'I_Ks',      txt: env.cick, channel: 'g' } ,
        { name: 'I_Kr',      txt: env.cick, channel: 'b' } ,
        { name: 'I_K1',      txt: env.cick, channel: 'a' } ,

        { name: 'I_Kb',      txt: env.cikn, channel: 'r' } ,
        { name: 'I_NaK',     txt: env.cikn, channel: 'g' } ,
        { name: 'I_Nab',     txt: env.cikn, channel: 'b' } ,
        { name: 'I_Na',      txt: env.cikn, channel: 'a' } ,

    ] ) ;
    env.cplt.visibleCurrent = env.cplt[env.dispCurrent] ;
    env.cplt.setTitle(env.dispCurrent+' current at the probe') ;
    env.cplt.visibleCurrent.show() ;

/*------------------------------------------------------------------------
 * disp
 *------------------------------------------------------------------------
 */
    env.disp= new Abubu.Plot2D({
        target : env.svvxc ,
        prevTarget : env.fvvxc ,
        colormap : env.colormap,
        canvas : canvas_1 ,
        minValue: env.minVlt ,
        maxValue: 30. ,
        tipt : false ,
        tiptThreshold : env.tiptThreshold ,
        tiptThickness : env.tiptThickness ,
        probeVisible : false ,
        colorbar : env.dispClrbVisible ,
        cblborder: 52 ,
        cbrborder: 40 ,
        unit : 'mv',
    } );

    env.dispTitle = env.disp.addMessage(  'OR-TP Model',
                        0.05,   0.05, /* Coordinate of the
                                         message ( x,y in [0-1] )   */
                        {   font: "Bold 14pt Arial",
                            style:"#ffffff",
                            align : "start" ,
                            visible : env.dispTitleVisible  }   ) ;
    env.dispCredit = env.disp.addMessage(  'Simulation by Abouzar Kaboudian @ CHAOS Lab',
                        0.05,   0.1,
                        {   font: "italic 10pt Arial",
                            style: "#ffffff",
                            align : "start",
                            visible : env.dispTitleVisible  }  ) ;
/*------------------------------------------------------------------------
 * intervalCaller
 *------------------------------------------------------------------------
 */
    env.intervalCaller = new Abubu.IntervalCaller({
        interval : env.autocallInterval  ,
        callback : function(){
            try{
                eval(env.autoCallback) ;
            }catch(e){
            }
        } ,
        active : env.autocall ,
    } ) ;

/*------------------------------------------------------------------------
 * initialize
 *------------------------------------------------------------------------
 */
    env.initialize = function(){
        env.time = 0 ;
        env.paceTime = 0 ;
        env.noAPD = 0 ;
        env.paceMakerNumber = 0 ;
        env.breaked = false ;
        env.fs1init.render() ;
        env.ss1init.render() ;
        env.fs2init.render() ;
        env.ss2init.render() ;
        env.plot.init(0) ;
        env.cplt.init(0) ;
        env.disp.initialize() ;
        env.notBreaked = true ;
        env.rec_reset() ;
        env.intervalCaller.reset() ;
        env.paceMakerCaller.reset() ;
        env.apdInit.render() ;
        refreshDisplay() ;
    }
	
 	env.sample 	 = new Abubu.FloatRenderTarget(8,8) ;
	env.sample.pairable = true ;
	
     env.sampler = new Abubu.Solver({
		fragmentShader : samplerShader.value ,
		vertexShader    : vertShader.value ,
		uniforms:{
			icolor0 : { type : 't', value : env.fvvxc } ,
		} ,
		targets:{
			ocolor : { location : 0 , target : env.sample } ,
		}
	} ) ;
	
    env.will  = new Abubu.Solver( {
       fragmentShader  : willShader.value ,
       vertexShader    : vertShader.value ,
        uniforms        : {
			time     : { type: 'f',  value : env.time    } ,
            inFvfs    : { type : 't', value: env.fvvxc     } ,			
        } ,
       targets   : {
           outFvfs    : { location : 0, target: env.svvxc     } ,
       }	   
    } ) ;	
	
    env.will2  = new Abubu.Solver( {
       fragmentShader  : will2Shader.value ,
       vertexShader    : vertShader.value ,
        uniforms        : {
			time     : { type: 'f',  value : env.time    } ,
            inFvfs    : { type : 't', value: env.fvvxc     } ,			
        } ,
       targets   : {
           outFvfs    : { location : 0, target: env.svvxc     } ,
       }	   
    } ) ;	
/*-------------------------------------------------------------------------
 * Render the programs
 *-------------------------------------------------------------------------
 */
   env.initialize() ;

/*------------------------------------------------------------------------
 * createGui
 *------------------------------------------------------------------------
 */
   createGui() ;

/*------------------------------------------------------------------------
 * clicker
 *------------------------------------------------------------------------
 */
    canvas_1.addEventListener("click",      onClick,        false   ) ;
    canvas_1.addEventListener('mousemove',
            function(e){
                if ( e.buttons >=1 ){
                    onClick(e) ;
                }
            } , false ) ;

/*------------------------------------------------------------------------
 * rendering the program ;
 *------------------------------------------------------------------------
 */	var will_length = 512;
	var tau_pw_will = [1.0]; //C_Na
	var tau_d_will = [0.88,0.9,0.92,0.94,0.96,0.98,1,1.02,1.04]; //C_CaL
	
	env.C_CaL = 0.86
    

	Abubu.setUniformInSolvers('C_CaL', env.C_CaL,[env.s2comp1,env.s2comp2, env.crnt]) ;
	
    var tau_pw_will_order = 0;
    var tau_d_will_order = 0;
	
	var willDataForOnePoint
	
	willDataForOnePoint = "data:text;charset=utf-8,";
	
	var countWill2 = 0;
	var countWill = 0;
	var countWill3 = 0;	
	var turn_red = 0;
	var determine_sustain_value = 0;
	env.svvxc.pairable = true
	env.fvvxc.pairable = true
	var will_m = 0
    env.render = function(){
        if (env.running){
            for(var i=0 ; i< env.frameRate/120 ; i++){
                env.s1comp1.render() ;
                env.s2comp1.render() ;
                stats.update();
                if ( env.apd.measuring ) {
                    env.fapd.render() ;
                }

                env.s1comp2.render() ;
                env.s2comp2.render() ;
				
				countWill2 += 1

				if (env.time < 520000 && env.time > 200000 && countWill2%env.skip == 0 ){
					env.sampler.render() ;
					willDataForOnePoint += ',' + env.sample.value ;
					willDataForOnePoint += ';'
				} 	

				if (env.time < 850000 && env.time > 530000 && countWill2%env.skip == 0 ){
					env.sampler.render() ;
					willDataForOnePoint += ',' + env.sample.value ;
					willDataForOnePoint += ';'
				} 

				if (env.time < 1180000 && env.time > 860000 && countWill2%env.skip == 0 ){
					env.sampler.render() ;
					willDataForOnePoint += ',' + env.sample.value ;
					willDataForOnePoint += ';'
				} 

				if (env.time < 1510000 && env.time > 1190000 && countWill2%env.skip == 0 ){
					env.sampler.render() ;
					willDataForOnePoint += ',' + env.sample.value ;
					willDataForOnePoint += ';'
				} 

				if (env.time < 1830000 && env.time > 1520000 && countWill2%env.skip == 0 ){
					env.sampler.render() ;
					willDataForOnePoint += ',' + env.sample.value ;
					willDataForOnePoint += ';'
				} 
				
                env.time += 2.0*env.dt ;
                env.paceTime += 2.0*env.dt ;
                stats.update();
                if ( env.apd.measuring ) env.sapd.render() ;
/*
                env.plot.update(env.time) ;
                env.cplt.update(env.time) ;
                env.disp.updateTipt() ;
                env.rec_recorder.record(env.time) ;
                env.current_recorder.record(env.time) ;

                env.intervalCaller.call(env.time) ;
                env.paceMakerCaller.call(env.time) ;

                env.ApdCvRecorder.sample() ;*/
				
				if (env.time > 520200  && env.time < 520200 + 2.0*env.dt){

					saveCsvFile(willDataForOnePoint,env.C_Na,env.C_CaL,'_spatial_20e4_32e4_8_8')

					willDataForOnePoint = null;
					
					willDataForOnePoint = "data:text;charset=utf-8,";
					
					env.running = false;
					
					setTimeout(function(){
						env.running = true;
					}, 60*1000 * 1);		// 0.6 mins				
				
					
				}
				
				
				if (env.time > 850200 && env.time < 850200 + 2.0*env.dt){

					saveCsvFile(willDataForOnePoint,env.C_Na,env.C_CaL,'_spatial_20e4_32e4_8_8')

					willDataForOnePoint = null;
					
					willDataForOnePoint = "data:text;charset=utf-8,";
					
					env.running = false;
					
					setTimeout(function(){
						env.running = true;
					}, 60*1000 * 1);		// 0.6 mins				
				
					
				}
				
				if (env.time > 1180200 && env.time < 1180200 + 2.0*env.dt){

					saveCsvFile(willDataForOnePoint,env.C_Na,env.C_CaL,'_spatial_20e4_32e4_8_8')

					willDataForOnePoint = null;
					
					willDataForOnePoint = "data:text;charset=utf-8,";
					
					env.running = false;
					
					setTimeout(function(){
						env.running = true;
					}, 60*1000 * 1);		// 0.6 mins				
				
					
				}
				
				if (env.time > 1510200 && env.time < 1510200 + 2.0*env.dt){

					saveCsvFile(willDataForOnePoint,env.C_Na,env.C_CaL,'_spatial_20e4_32e4_8_8')

					willDataForOnePoint = null;
					
					willDataForOnePoint = "data:text;charset=utf-8,";
					
					env.running = false;
					
					setTimeout(function(){
						env.running = true;
					}, 60*1000 * 1);		// 0.6 mins				
				
					
				}	
				
				if (env.time > 1830200 && env.time < 1830200 + 2.0*env.dt){

					saveCsvFile(willDataForOnePoint,env.C_Na,env.C_CaL,'_spatial_20e4_32e4_8_8')

					willDataForOnePoint = null;
					
					willDataForOnePoint = "data:text;charset=utf-8,";
					
					env.running = false;
					
					setTimeout(function(){
						env.running = true;
					}, 60*1000 * 1);		// 0.6 mins				
				
					
				}
				
				if ( countWill2%50 == 0 && turn_red == 0 && env.time>200 && countWill == 0 && env.svvxc.value[Math.floor( will_length *1/2) * 4] > 0.3 ){
				//env.will.uniforms.time.value = env.time;
					turn_red = 1
					
				}
			
				
				if ( countWill2%50 == 0 && env.time>200 && countWill == 0 && env.svvxc.value[Math.floor( will_length *1/2) * 4] < 0.05 && turn_red == 1){
				//env.will.uniforms.time.value = env.time;
					env.will.render()	
					countWill += 1
					env.clickCopy.render()

				}
								
				
				if (countWill3 == 0 && countWill2%50 == 0  && countWill == 1 && env.svvxc.value[Math.floor( will_length *12/13) * 4] < 0.05 && env.svvxc.value[Math.floor( will_length *3/4) * 4] < 0.05){
					
					env.will2.render()	
					countWill3 += 1
					countWill += 1
					env.clickCopy.render()						
					
					
				}
				
				if (countWill == 2 &&  env.time>3000){
					
					env.will.render()	
					countWill += 1
					env.clickCopy.render()						
					
					
				}
				
				if (countWill == 3 &&  env.time>4000){
					
					env.will.render()	
					countWill += 1
					env.clickCopy.render()						
					
					
				}

				if (countWill == 4 &&  env.time>5000){
					
					env.will.render()	
					countWill += 1
					env.clickCopy.render()						
					
					
				}
				
				if (env.time > 1850200 && tau_d_will_order != tau_d_will.length){
					
					env.initialize() ;
					countWill2 = 0;
					countWill = 0;
					countWill3 = 0;	
					turn_red = 0;						
					

					
					env.C_Na = tau_pw_will[tau_pw_will_order]
					env.C_CaL = tau_d_will[tau_d_will_order]
					
					Abubu.setUniformInSolvers('C_Na', env.C_Na,[env.s2comp1,env.s2comp2, env.crnt]) ;						
					Abubu.setUniformInSolvers('C_CaL', env.C_CaL,[env.s2comp1,env.s2comp2, env.crnt]) ;
					
					
					tau_pw_will_order += 1
					
					if (tau_pw_will_order == tau_pw_will.length){
						tau_d_will_order += 1
						tau_pw_will_order = 0
					}

				}
				
            }
            if ( env.time > env.breakTime
                    && env.notBreaked
                    && env.vltBreak     ){
                env.breakVltNow() ;
            }

			  if (env.time > 1900000){
				  env.running = !env.running;
			  }
			  
            refreshDisplay();
        }
        env.runScript() ;
        requestAnimationFrame(env.render) ;
    }

/*------------------------------------------------------------------------
 * add environment to document
 *------------------------------------------------------------------------
 */
    document.env = env ;

/*------------------------------------------------------------------------
 * render the webgl program
 *------------------------------------------------------------------------
 */
    env.render();

}/*  End of loadWebGL  */

/*========================================================================
 * refreshDisplay
 *========================================================================
 */
 
function saveCsvFile(willDataForOnePoint, tau_pw, tau_r, lya_type) {
    const blob = new Blob([willDataForOnePoint], { type: 'text/csv;charset=utf-8' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const name_download = 'C_Na_' + tau_pw +  '_C_CaL_' + tau_r + lya_type + '_APD_step_' + (2*env.frameRate/120*env.dt) + '.csv';

    link.href = url;
    link.download = name_download;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Cleanup
}

 
function refreshDisplay(){
    env.disp.render() ;
    if ( env. apdMeasuring && env.running ){
        if ( Math.floor(env.time) % 50 < 2 ){
            var prb = env.apdProbe.getPixel()
            env.BCL = prb[0] ;
            env.DI  = prb[1] ;
            env.APD = prb[2] ;
            env.CV  = prb[3] ;
        }
        env.ApdCvRecorder.sample() ;
    }

    env.plot.render() ;
    env.cplt.render() ;
    env.paceMakerCaller.call(env.time) ;
}

/*========================================================================
 * onClick
 *========================================================================
 */
function onClick(e){
    env.clickPosition[0] =
        ((e.clientX+e.view.scrollX)-canvas_1.offsetLeft) / env.dispWidth ;
    env.clickPosition[1] =  1.0-
        ((e.clientY+e.view.scrollY)-canvas_1.offsetTop) / env.dispWidth ;

    env.click.setUniform('clickPosition',env.clickPosition) ;

    if (    env.clickPosition[0]   >   1.0 ||
            env.clickPosition[0]   <   0.0 ||
            env.clickPosition[1]   >   1.0 ||
            env.clickPosition[1]   <   0.0 ){
        return ;
    }
    clickRender() ;
    return ;
}

/*========================================================================
 * Render and display click event
 *========================================================================
 */
function clickRender(){
    switch( env['clicker']){
    case 'Pace Region':
        env.click.setUniform('clickValue',env.paceValue) ;
        clickSolve() ;
        requestAnimationFrame(clickSolve) ;
        env.oldClicker = env.clicker ;
        break ;

   case 'Signal Loc. Picker':
        env.probePositionX = env.clickPosition[0] ;
        env.probePositionY = env.clickPosition[1] ;

        env.plot.setProbePosition( env.clickPosition ) ;
        env.cplt.setProbePosition( env.clickPosition ) ;
        env.disp.setProbePosition( env.clickPosition ) ;
        env.apd.probe.setPosition( env.clickPosition ) ;
        env.apd.cvprobe.setPosition( env.clickPosition ) ;
        env.rec_probe.setPosition( new Float32Array(env.clickPosition) ) ;
        env.plot.init() ;
        env.cplt.init() ;
        refreshDisplay() ;
        env.oldClicker = env.clicker ;
        env.gui.updateDisplay() ;
        break ;

    case 'Pace-Maker Location':
        env.paceMakerPositionX = env.clickPosition[0] ;
        env.paceMakerPositionY = env.clickPosition[1] ;
        env.paceMakerSolver.setUniform('pacePosition',
                [env.paceMakerPositionX,env.paceMakerPositionY] ) ;
        env.clicker = env.oldClicker ;
        env.gui_3.smlPrmFldr.clicker.updateDisplay() ;
        env.gui.updateDisplay() ;
    }

    return ;
}
/*========================================================================
 * solve click event
 *========================================================================
 */
function clickSolve(){
    env.click.render() ;
    env.clickCopy.render() ;
    refreshDisplay() ;
}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * End of require()
 *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
loadWebGL() ;
} ) ;
