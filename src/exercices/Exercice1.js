import * as THREE from 'three';
window.THREE = THREE;

const PI = Math.PI;
const TAU = PI*2;

function PolygonGeometry(sides, radius=1, location = new THREE.Vector3(), triangulateFromCenter=true){
    let geom = new THREE.BufferGeometry();

    let positions = []; // Center vertex
    if(triangulateFromCenter) positions.push(...[location.x,location.y,location.z]);
    let indexes = [];
    for(let pt = 1; pt <= sides; pt++){
        let angle = TAU - TAU * (pt / sides);

        let x = Math.cos(angle)*radius + location.x;
        let y = Math.sin(angle)*radius + location.y;
        positions.push(...[x, y, location.z]);

        if(triangulateFromCenter){
            if(pt < sides){
                indexes.push(...[0, pt+1, pt]);
            }else if(pt == sides){
                indexes.push(...[0, 1, pt]);
            }
        }else if(pt < sides-1){
            indexes.push(...[0, pt+1, pt]);
        }
    }
    geom.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
    geom.setIndex(indexes);

    // const material = new THREE.MeshBasicMaterial({color:0xFFFFFF, wireframe: false});
    // const polygon = new THREE.Mesh( geom, material );
    // if( location instanceof THREE.Vector3 ){
    //     polygon.position.x = location.x;
    //     polygon.position.y = location.y;
    //     polygon.position.z = location.z;
    // }
    return geom;
}

function RgbTriangle(){
    let geom = PolygonGeometry(3);
    geom.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( geom.attributes.position.count * 4 ), 4 ) );
    
    const material = new THREE.MeshBasicMaterial({color:0xFFFFFF, vertexColors:true, wireframe: false});

    const mesh = new THREE.Mesh( geom, material );

    const color = new THREE.Color();
    const colors = geom.attributes.color;
    color.setHex(0xFF0000);
    colors.setXYZW(0, 1.0, 1.0, 1.0);
    colors.setXYZW(1, 1.0, .0, .0);
    colors.setXYZW(2, .0, 1.0, .0);
    colors.setXYZW(3, .0, .0, 1.0);

    return mesh
}

function Exercice1(scene){
    let p1Geom = PolygonGeometry(6, .25, new THREE.Vector3(1,1,0), true);
    let p1Mat = new THREE.MeshBasicMaterial({color:0x00E4FF});
    let p1Mesh = new THREE.Mesh(p1Geom, p1Mat);
    scene.add(p1Mesh);
    scene.add(RgbTriangle());
}

export default Exercice1;