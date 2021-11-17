import * as THREE from 'three';
window.THREE = THREE;

const PI = Math.PI;
const TAU = PI*2;

function PolygonGeometry(sides, radius=1, location = new THREE.Vector3(), triangulateFromCenter=true){
    let geom = new THREE.BufferGeometry();

    let positions = []; // Center vertex
    if(triangulateFromCenter) positions.push(...[0,0,0]);
    let indexes = [];
    for(let pt = 1; pt <= sides; pt++){
        let angle = TAU - TAU * (pt / sides);

        let x = Math.cos(angle)*radius;
        let y = Math.sin(angle)*radius;
        positions.push(...[x, y, 0]);

        if(triangulateFromCenter){
            indexes.push(...[0, pt+1, pt]);
            if(pt == sides){
                indexes.push(...[0, 1, pt]);
            }
        }else if(pt < sides-1){
            indexes.push(...[0, pt+1, pt]);
        }
    }
    geom.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
    geom.setIndex(indexes);

    const material = new THREE.MeshBasicMaterial({color:0x00D2FF, wireframe: true});
    const polygon = new THREE.Mesh( geom, material );
    if( location instanceof THREE.Vector3 ){
        polygon.position.x = location.x;
        polygon.position.y = location.y;
        polygon.position.z = location.z;
    }
    return polygon;
}

function Exercice1(scene){
    scene.add(PolygonGeometry(13, 1,new THREE.Vector3(0,0,0)));
}

export default Exercice1;