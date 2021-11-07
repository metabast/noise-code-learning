import * as THREE from 'three';
window.THREE = THREE;

const clog = (...params)=> console.log(...params);
const lerp = window.lerp = (x, y, t) => x * (1-t) + y * t;
const clamp = window.clamp = (x, min=0, max=1) => Math.min(max, Math.max(min, x));
const invLerp = window.invLerp = (x, y, t) => clamp( (t - x) / (y - x) );
const range = window.range = (x1, y1, x2, y2, t) => lerp(x2, y2, invLerp(x1, y1, t));


import FastNoiseLite from "../vendors/FastNoiseLite.js";
let noise = new FastNoiseLite(10);
noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise.SetFrequency(2.4);
noise.SetFractalType(FastNoiseLite.FractalType.FBm);
noise.SetFractalOctaves(8.0);// default 3
noise.SetFractalLacunarity(2.0);// default 2
noise.SetFractalGain(0.5);// default .5

let noise2 = new FastNoiseLite(7);
noise2.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise2.SetFrequency(1.2);

let noise3 = new FastNoiseLite(10);
noise3.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise3.SetFrequency(1.0);
noise3.SetFractalType(FastNoiseLite.FractalType.FBm);
noise3.SetFractalOctaves(7.0);// default 3
noise3.SetFractalLacunarity(2.5);// default 2
noise3.SetFractalGain(0.5);// default .5


const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, vertexColors: true, flatShading: true, shininess:0 } );
const materialWireframe = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe:true, transparent: true, opacity: 0.1 } );

const subdivisions = 1000;
const geometry = new THREE.PlaneGeometry( 2, 2 , subdivisions, subdivisions );
const count = geometry.attributes.position.count;

geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );

const plane = new THREE.Mesh( geometry, material );
const wireframe = new THREE.Mesh( geometry, materialWireframe );
wireframe.position.z += .001
plane.add(wireframe);
plane.rotateX(-90*(Math.PI/180));
const color = new THREE.Color();
const colors = geometry.attributes.color;
console.log(color)

for(let i=0; i< geometry.attributes.position.array.length; i+=3){
    let vec = new THREE.Vector2( geometry.attributes.position.array[i], geometry.attributes.position.array[i+1]);
    let noiseVal = noise2.GetNoise(vec.x,vec.y);
    let ly = range(-1, 1, 0, 1, noiseVal);
    noiseVal = lerp(clamp(noise.GetNoise(vec.x,vec.y), -1, 1), clamp(noise3.GetNoise(vec.x,vec.y)*0.10, -1, 1), ly)

    // if(noiseVal >= 0)
    //     noiseVal = clamp(noise.GetNoise(vec.x,vec.y), -1, 1);
    // else
    //     noiseVal *= 1-clamp(noise3.GetNoise(vec.x,vec.y), -1, 1);

    let posZ = clamp(noiseVal, -1, 1);
    geometry.attributes.position.array[i+2] = posZ*0.2;

    // let colorZ = clamp(noiseVal, -1, 1);
    let colorZ = range(0, 1, 0, 1, noiseVal);

    if(colorZ <= 0)
        colors.setXYZ((i/3), 0.05,0.2,0.3);
    else if(colorZ <=.05){
        color.setHex(0xD7D7A5);
        colors.setXYZ((i/3), color.r, color.g, color.b);
    }
    else if(colorZ <=0.14){
        color.setHex(0x68A467);
        colors.setXYZ((i/3), color.r, color.g, color.b);
    }
    else if(colorZ >=0.5){
        color.setHex(0xFCFCFC);
        colors.setXYZ((i/3), color.r, color.g, color.b);
    }
    else
        colors.setXYZ((i/3), colorZ, colorZ, colorZ);

    // colors.setXYZ((i/3), colorZ, colorZ, colorZ);
    // color.setHSL(1*((i/3+2)/geometry.attributes.position.count), 1, .5);
    // colors.setXYZ((i/3)+2, color.r, color.g, color.b);
}
geometry.attributes.position.needUpdate = true;


// plane.scale.set(10,10,10);


function Terrain1(scene){
    scene.add( plane );
}

export default Terrain1;