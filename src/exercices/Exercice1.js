import * as THREE from 'three';
window.THREE = THREE;

const PI = Math.PI;
const TAU = PI*2;

function PolygonGeometry(sides){
    let geom = new THREE.BufferGeometry();

    let triangulateFromCenter = false;
    if(triangulateFromCenter){
        let positions = [0,0,0]; // Center vertex
        let indexes = [];
        for(let pt = 1; pt <= sides; pt++){
            let angle = TAU - TAU * (pt / sides);

            let x = Math.cos(angle);
            let y = Math.sin(angle);
            positions.push(...[x, y, 0]);

            indexes.push(...[0, pt+1, pt]);
            if(pt == sides){
                indexes.push(...[0, 1, pt]);
            }
        }
        geom.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
        geom.setIndex(indexes);
    }else{
        let positions = [];
        let indexes = [];
        for(let pt = 0; pt < sides; pt++){
            let angle = TAU - TAU * (pt / sides);

            let x = Math.cos(angle);
            let y = Math.sin(angle);
            positions.push(...[x, y, 0]);

            // indexes.push(...[0, pt+1, pt]);
            // if(pt == sides){
            //     indexes.push(...[0, 1, pt]);
            // }
        }
        if(Number.isInteger(sides/2)){
            for(let pt = 0; pt < sides; pt+=2){
                
                if(pt == sides -2){
                    // indexes.push(...[pt, pt+2, pt+1])
                }else{
                    indexes.push(...[pt, pt+2, pt+1])
                }
                
            }
        }else{
            for(let pt = 0; pt < sides; pt+=2){
                
                if(pt == sides -1){
                    // indexes.push(...[pt, pt+2, pt+1])
                }else{
                    indexes.push(...[pt, pt+2, pt+1])
                }
                
            }
        }
        geom.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
        geom.setIndex(indexes);
    }

    const material = new THREE.MeshBasicMaterial({color:0x00D2FF, wireframe: true});
    const polygon = new THREE.Mesh( geom, material );
    return polygon;
}


function Exercice1(scene){
    scene.add(PolygonGeometry(14));
}

export default Exercice1;