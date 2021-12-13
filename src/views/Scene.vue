<template>
  <div id="scene" ref="scene">
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Terrain1 from '../terrains/Terrain1.js'
// import Exercice1 from '../exercices/Exercice1.js'
export default {

  name: 'Scene',

  data () {
    return {

    }
  },

  mounted(){
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xff0000);
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100000 );

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setClearColorHex( 0xff00ff, 1);
    this.$refs.scene.appendChild( renderer.domElement );


    const controls = new OrbitControls(camera, renderer.domElement);

    const camDist = 0.3;
    camera.position.set( camDist, camDist*0.2, camDist);

    controls.update();

    // scene.add(new THREE.AxesHelper(1))

    const directionalLight = new THREE.PointLight( 0xffffff, 1 );
    directionalLight.translateY(4)
    // scene.add(directionalLight);

    let terrain1 = new Terrain1(scene);
    // new Exercice1(scene);

    function animate() {
      requestAnimationFrame( animate );
      terrain1.update();
      renderer.render( scene, camera );
    }
    animate();
  }
}
</script>

<style lang="css" scoped>
  #scene canvas{
    background-color: #FF0000;
  }
</style>