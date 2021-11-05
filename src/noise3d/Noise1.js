import * as THREE from 'three';
window.THREE = THREE;

const clog = (...params)=> console.log(...params);
const lerp = window.lerp = (x, y, t) => x * (1-t) + y * t;
const clamp = window.clamp = (x, min=0, max=1) => Math.min(max, Math.max(min, x));
const invLerp = window.invLerp = (x, y, t) => clamp( (t - x) / (y - x) );
const range = window.range = (x1, y1, x2, y2, t) => lerp(x2, y2, invLerp(x1, y1, t));


import FastNoiseLite from "../vendors/FastNoiseLite.js";
let noise = new FastNoiseLite( 10);
clog(noise);
noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
noise.SetFrequency(6.0);
noise.SetFractalOctaves(2.0);// default 3
noise.SetFractalLacunarity(3.0);// default 2
noise.SetFractalGain(0.5);// default .5
noise.SetFractalType(FastNoiseLite.FractalType.FBm);


const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, vertexColors: true, flatShading: true, shininess:0 } );
const materialWireframe = new THREE.MeshBasicMaterial( { color: 0x000, wireframe:true, transparent: true, opacity: 0.1 } );

const subdivisions = 100;
const geometry = new THREE.PlaneGeometry( 1, 1 , subdivisions, subdivisions );
const count = geometry.attributes.position.count;

geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );

clog(geometry)

const plane = new THREE.Mesh( geometry, material );
const wireframe = new THREE.Mesh( geometry, materialWireframe );
wireframe.position.z += .001
plane.add(wireframe);
plane.rotateX(-90*(Math.PI/180));
const color = new THREE.Color();
const colors = geometry.attributes.color;

for(let i=0; i< geometry.attributes.position.array.length; i+=3){
    let vec = new THREE.Vector2( geometry.attributes.position.array[i], geometry.attributes.position.array[i+1]);
    let noiseVal = noise.GetNoise(vec.x,vec.y);
    geometry.attributes.position.array[i+2] = clamp(noiseVal, 0, 1)*.1;

    let posZ = clamp(noiseVal, 0.0, 1);

    // if(posZ <= 0)
    //     colors.setXYZ((i/3), 0.05,0.2,0.3);
    // else if(posZ <=.2)
    //     colors.setXYZ((i/3), 1, 1, 0.5);
    // else if(posZ <=.5)
    //     colors.setXYZ((i/3), posZ, 1, posZ);
    // else if(posZ <=.75)
    //     colors.setXYZ((i/3), 0.8, 0.6, 0.4);
    // else
    //     colors.setXYZ((i/3), posZ, posZ, posZ);

    colors.setXYZ((i/3), posZ, posZ, posZ);
    // color.setHSL(1*((i/3+2)/geometry.attributes.position.count), 1, .5);
    // colors.setXYZ((i/3)+2, color.r, color.g, color.b);
}
geometry.attributes.position.needUpdate = true;


plane.scale.set(10,10,10);


function Noise1(scene){
    scene.add( plane );
}

export default Noise1;