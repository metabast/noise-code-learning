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
        let subIndexes = [];
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
                    indexes.push(...[pt, 0, pt+1])
                    subIndexes.push(pt);
                }else{
                    indexes.push(...[pt, pt+2, pt+1])
                    subIndexes.push(pt);
                }
                
            }
        }else{
            for(let pt = 0; pt < sides; pt+=2){
                
                if(pt == sides -1){
                    indexes.push(...[pt-2, 0, pt])
                    subIndexes.push(pt-2);
                }else{
                    indexes.push(...[pt, pt+2, pt+1])
                    subIndexes.push(pt);
                }
            }
        }

        if(subIndexes.length > 3){
            let _subIndexes = polySubIndexer(subIndexes);
            indexes.push( ..._subIndexes );
        }
        geom.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(positions), 3 ) );
        geom.setIndex(indexes);
    }

    const material = new THREE.MeshBasicMaterial({color:0x00D2FF, wireframe: false});
    const polygon = new THREE.Mesh( geom, material );
    return polygon;
}

function polySubIndexer(_subIndexes){
    console.log('polySubIndexer', _subIndexes.length);
    let indexes = [];
    let subIndexes = [];
    if(Number.isInteger(_subIndexes.length/2)){
        for(let pt = 0; pt < _subIndexes.length; pt+=2){
            
            if(pt == _subIndexes.length -2){
                indexes.push(...[_subIndexes[pt], _subIndexes[0], _subIndexes[pt+1]]);
                subIndexes.push(_subIndexes[pt]);
            }else{
                indexes.push(...[_subIndexes[pt], _subIndexes[pt+2], _subIndexes[pt+1]]);
                subIndexes.push(_subIndexes[pt]);
            }
            
        }
    }else{
        for(let pt = 0; pt < _subIndexes.length; pt+=2){
                    
            if(pt == _subIndexes.length -1){
                indexes.push(...[_subIndexes[pt-2], _subIndexes[0], _subIndexes[pt]])
                subIndexes.push(_subIndexes[pt-2]);
            }else{
                indexes.push(...[_subIndexes[pt], _subIndexes[pt+2], _subIndexes[pt+1]])
                subIndexes.push(_subIndexes[pt]);
            }
        }

    }
    console.log(subIndexes);
    if(subIndexes.length == 3)
        indexes.push(...[subIndexes[0], subIndexes[2], subIndexes[1]]);
    else if(subIndexes.length > 3)
        polySubIndexer(subIndexes);
    return indexes;
}


function Exercice1(scene){
    scene.add(PolygonGeometry(13));
}

export default Exercice1;