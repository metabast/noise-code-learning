import * as THREE from 'three';
window.THREE = THREE;

const clog = (...params)=> console.log(...params);
const lerp = window.lerp = (x, y, t) => x * (1-t) + y * t;
const clamp = window.clamp = (x, min=0, max=1) => Math.min(max, Math.max(min, x));
const invLerp = window.invLerp = (x, y, t) => clamp( (t - x) / (y - x) );
const range = window.range = (x1, y1, x2, y2, t) => lerp(x2, y2, invLerp(x1, y1, t));
const pow = Math.pow;
const max = Math.max;
const min = Math.min;
const PI = Math.PI;
const abs = Math.abs;
const cos = Math.cos;
const floor = Math.floor;
const round = Math.round;
const ceil = Math.ceil;


import FastNoiseLite from "../vendors/FastNoiseLite.js";

let noise1 = new FastNoiseLite(6);
noise1.SetNoiseType(FastNoiseLite.NoiseType.Cellular);
noise1.SetFrequency(1.0);
noise1.SetFractalType(FastNoiseLite.FractalType.FBm);
noise1.SetFractalOctaves(4.0);// default 3
noise1.SetFractalLacunarity(3.0);// default 2
noise1.SetFractalGain(0.7);// default .5
noise1.SetFractalWeightedStrength(0.5);// default .5

let noise2 = new FastNoiseLite(4);
noise2.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise2.SetFrequency(2.0);

let noise3 = new FastNoiseLite(10);
noise3.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise3.SetFrequency(0.6);
noise3.SetFractalType(FastNoiseLite.FractalType.FBm);
noise3.SetFractalOctaves(7.0);// default 3
noise3.SetFractalLacunarity(1.9);// default 2
noise3.SetFractalGain(0.2);// default .5


let noise4 = new FastNoiseLite(16);
noise4.SetNoiseType(FastNoiseLite.NoiseType.Cellular);
noise4.SetFrequency(3.0);
noise4.SetFractalType(FastNoiseLite.FractalType.FBm);
noise4.SetFractalOctaves(2.0);// default 3
noise4.SetFractalLacunarity(2.0);// default 2
noise4.SetFractalGain(0.5);// default .5
noise4.SetFractalWeightedStrength(0.4);// default .5

let noiseDomainWarp = new FastNoiseLite(15);
noiseDomainWarp.SetNoiseType(FastNoiseLite.NoiseType.Cellular);
noiseDomainWarp.SetFrequency(0.4);
noiseDomainWarp.SetFractalType(FastNoiseLite.FractalType.FBm);
noiseDomainWarp.SetFractalOctaves(3.0);// default 3
noiseDomainWarp.SetFractalLacunarity(2.0);// default 2
noiseDomainWarp.SetFractalGain(0.5);// default .5
noiseDomainWarp.SetFractalWeightedStrength(0.4);// default .5
noiseDomainWarp.SetDomainWarpType(FastNoiseLite.DomainWarpType.OpenSimplex2);
noiseDomainWarp.SetDomainWarpAmp(2.0);// default 1.0

import {Vector2} from "../vendors/FastNoiseLite.js";

// let coord = new Vector2(.435121, .32516);
// clog(noise4.GetNoise(.435121, .32516));
// noise4.DomainWrap(coord)
// clog(noise4.GetNoise(coord.x, coord.y));


const texture = new THREE.TextureLoader().load( "/textures/uv_checker01.png" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

// const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, vertexColors: true, flatShading: true, shininess:0.0, transparent: true  } );
const material = new THREE.MeshBasicMaterial( { flatShading: true, shininess:0.0, transparent: true  } );
material.map = texture;
const materialWireframe = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe:true, transparent: true, opacity: 0.1 } );

const subdivisions = 200;
const geometry = new THREE.PlaneGeometry( 2, 2 , subdivisions, subdivisions );
const count = geometry.attributes.position.count;

geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 4 ), 4 ) );

const plane = new THREE.Mesh( geometry, material );
const wireframe = new THREE.Mesh( geometry, materialWireframe );
wireframe.position.z += .001
// plane.add(wireframe);
plane.rotateX(-90*(Math.PI/180));
const color = new THREE.Color();
const colors = geometry.attributes.color;

const vr = new THREE.Vector2(1,1); 
const vrl = vr.length();

function ring(st, r1, r2, x=0, y=0, sc=1){
    st = st.clone();
    st.x += x;
    st.y += y;
    r1 *= sc;
    r2 *= sc;
    let r = range(r1, r1-0.005, -1, 1.0, st.length());
    r -= range(r2, r2-0.005, -1, 1.0, st.length());
    r = range(0,1, -.1, 0.1, r);
    return r
}

for(let i=0; i< geometry.attributes.position.array.length; i+=3){
    //final noise
    let fn = 0;
    let p = new THREE.Vector2( geometry.attributes.position.array[i], geometry.attributes.position.array[i+1]);
    let pl = p.length();
    let pln = pl * (1/vrl);

    // radial gradient
    let rg = pow( min( cos(PI * pln / 2.0), 1.0 - abs(pln)), 3.0 );

    let ly = range(0, 1, -0.5, 1.0, rg);

    // noiseVal = lerp( 0, noise3.GetNoise(p.x,p.y), ly);
    let c = new Vector2(p.x, p.y);

    let noiseVal = noise1.GetNoise(c.x, c.y);
    noiseVal = range(-1.0, 1.0, -1.0, 1.0, noiseVal);

    let noiseVal2 = noise2.GetNoise(c.x, c.y);
    noiseVal2 = range(-1.0, 1.0, -1.0, 1.0, noiseVal2)*.1;

    // fn = noiseVal2;
    // fn += noiseVal;

    let noiseVal3 = noise3.GetNoise(c.x, c.y);
    noiseVal3 = range(-1.0, 1.0, -1.0, 1.0, noiseVal3);

    noiseDomainWarp.DomainWrap(c);
    let noiseVal4 = noise4.GetNoise(c.x, c.y);
    noiseVal4 = range(-1.0, 1.0, 0, 1, noiseVal4);

    // fn = rg*1.0;
    fn = 0;
    fn += noiseVal*0.9+0.35;
    fn += noiseVal2*0.6;
    fn += noiseVal4*1.0;

    fn = lerp( 0.0, fn, ly);

    // fn = noiseVal4;


    // fn = lerp( 0, fn, ly);



    // fn = noiseVal;

    // fn += noiseVal3 *1.41;

    // noiseVal += noiseVal2;
    // noiseVal = noiseVal2;

    // noiseVal = range(1, 0.995, -1, 1, pl);
    // noiseVal -= range(0.7, 0.695, -1, 1, pl);
    // noiseVal = range(0,1, -1, 1, noiseVal)

    // noiseVal += ring(p, 1, .7, 0.1, 0, .25)*.25;
    // noiseVal += ring(p, 1, .7, -0.1, 0, .25)*.25;
    // if(noiseVal <= - 0.984){
    //     noiseVal = range(-1, 0.992, 1, 0.992, noiseVal);
    // }


    let posZ = fn;
    geometry.attributes.position.array[i+2] = posZ;

    // let colorZ = clamp(noiseVal, -1, 1);
    let colorZ = range(-1.0, 1.0, 0.0, 1.0, posZ);

    if(colorZ <= 0.511)
        colors.setXYZW((i/3), 0.05,0.2,0.3, 1);
    else if(colorZ <= 0.52){
        color.setHex(0xD7D7A5);
        colors.setXYZW((i/3), color.r, color.g, color.b, 1);
    }
    else if(colorZ <= 0.54){
        color.setHex(0x68A467);
        colors.setXYZW((i/3), color.r, color.g, color.b, 1);
    }
    else if(colorZ >=0.61){
        color.setHex(0xFCFCFC);
        colors.setXYZW((i/3), color.r, color.g, color.b, 1);
    }
    else
        colors.setXYZW((i/3), colorZ, colorZ, colorZ, 1);

    colors.setXYZW((i/3), colorZ, colorZ, colorZ, 1);
    // color.setHSL(1*((i/3+2)/geometry.attributes.position.count), 1, .5);
    // colors.setXYZ((i/3)+2, color.r, color.g, color.b);
}

geometry.attributes.position.needUpdate = true;


// plane.scale.set(10,10,10);


function Terrain1(scene){
    scene.add( plane );
}

export default Terrain1;