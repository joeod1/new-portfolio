uniform highp float u_time;
// uniform lowp float u_resolution;
uniform lowp vec2 u_mouse;
// in vec4 gl_FragCoord;


// BEGIN MODIFIED PERLIN NOISE SNIPPET
// License: /shaders/webgl-noise/LICENSE

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

lowp vec3 mod289(lowp vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

lowp vec2 mod289(lowp vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

lowp vec3 permute(lowp vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

lowp float snoise(lowp vec2 v)
  {
  const lowp vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  lowp vec2 i  = floor(v + dot(v, C.yy) );
  lowp vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  lowp vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  lowp vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  lowp vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  lowp vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  lowp vec3 x = 2.0 * fract(p * C.www) - 1.0;
  lowp vec3 h = abs(x) - 0.5;
  lowp vec3 ox = floor(x + 0.5);
  lowp vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  lowp vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// END SNIPPET


void main() {
    lowp float test = snoise(gl_FragCoord.xy / 1000.0 - u_time * 0.01);
//   lowp float test = sin((u_time / 10. + gl_FragCoord.x + gl_FragCoord.y / 50000.0)) + 0.5;
//   test *= sqrt(
//     (u_mouse.x - gl_FragCoord.x) * (u_mouse.x - gl_FragCoord.x)
//     + (u_mouse.y - gl_FragCoord.y) * (u_mouse.y - gl_FragCoord.y)
//     ) / 100.;
    test = mod(test, 1.0);
    // test *= sqrt(
    // (u_mouse.x - gl_FragCoord.x) * (u_mouse.x - gl_FragCoord.x)
    // + (u_mouse.y - gl_FragCoord.y) * (u_mouse.y - gl_FragCoord.y)
    // ) / 100.;
    // gl_FragColor = vec4(1. - test, 1. - test, 1. - test, 0.1);
  gl_FragColor = vec4(test - 0.9, test - 0.9, test - 0.9, 0.4);
}