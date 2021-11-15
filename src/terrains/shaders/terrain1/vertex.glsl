#define M_PI 3.1415926535897932384626433832795

uniform vec2 uvScale;
varying vec2 vUv;
// 

varying vec3 vColor;

void main()
{
    vUv = uvScale * uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}