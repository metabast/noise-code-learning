varying vec4 vColor;
uniform sampler2D texture1;

varying vec2 vUv;
void main()
{
    vec4 color = texture2D( texture1, vUv );
    gl_FragColor = vec4( color );
}