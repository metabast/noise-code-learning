<template>
  <div id="scene" ref="scene">
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Noise1 from '../noise3d/Noise1.js'
export default {

  name: 'Scene',

  data () {
    return {

    }
  },

  mounted(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.$refs.scene.appendChild( renderer.domElement );


    const controls = new OrbitControls(camera, renderer.domElement);

    const camDist = 5;
    camera.position.set(camDist,camDist,camDist);

    controls.update();

    scene.add(new THREE.AxesHelper(1))

    const directionalLight = new THREE.PointLight( 0xffffff, 1 );
    directionalLight.translateY(4)
    // scene.add(directionalLight);

    new Noise1(scene);

    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    }
    animate();
  }
}
</script>

<style lang="css" scoped>
  #scene canvas{
    background-color: #CCC;
  }
</style>