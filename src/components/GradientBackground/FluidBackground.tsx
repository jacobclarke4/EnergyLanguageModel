import { useEffect, useRef } from 'react'
import Globe from '../Globe/Globe'
import earthMask from '../../assets/EarthMask.jpg';

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  uniform float scale;

  vec3 purple = vec3(0.44, 0.22, 1.0);
  vec3 gold = vec3(1.0, 0.73, 0.15);

  float rand(float n) {
    return fract(sin(n * 12.9898) * 43758.5453);
  }
  
  float rand2(float n) {
    return fract(cos(n * 91.3458) * 47453.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv - 0.5;
    float aspect = resolution.x / resolution.y;
    p.x *= aspect;

    // ADD THIS: Keep a non-aspect-corrected x for color gradient
    float rawX = uv.x - 0.5;  // Always ranges from -0.5 to 0.5
    
    vec3 col = vec3(0.129, 0.102, 0.259);
    
    // === WAVE PARAMETERS ===
    float FREQ_SCALE = 4.0 / scale;        // lower freq on mobile = wider waves
    float AMP_SCALE = 0.12 * scale;         // bigger amplitude on mobile
    float SPEED_SCALE = 1.0;
    float WAVE_THICKNESS = 0.007 * scale;   // thicker lines on mobile

    // === PARTICLE PARAMETERS ===
    float PARTICLE_SIZE_MIN = 0.01 * scale;   // bigger particles on mobile
    float PARTICLE_SIZE_MAX = 0.03 * scale;
    float PARTICLE_BLUR_MULT = 5.0;    // how much bigger blurred particles are
    float PARTICLE_BLUR_RATIO = 0.4;   // 0-1, percentage that are blurred
    float PARTICLE_SPEED = 0.15;       // movement speed
    float PARTICLE_DRIFT = 0.25;       // how far particles drift from origin
    float PARTICLE_OPACITY_MIN = 0.4;
    float PARTICLE_OPACITY_MAX = 1.0;
    float PARTICLE_BLUR_OPACITY = 0.67;  // opacity multiplier for blurred particles (0-1)
    
    // === PARTICLES (behind waves) ===
    for(float i = 0.0; i < 70.0; i++) {
      // Spread across full width using aspect ratio
      float px = (rand(i * 13.7) * 2.0 - 1.0) * aspect;
      float py = rand(i * 27.3) * 1.0 - 0.5;
      
      // Movement
      float speedX = (rand(i * 41.1) - 0.5) * PARTICLE_SPEED;
      float speedY = (rand(i * 53.9) - 0.5) * PARTICLE_SPEED;
      px += sin(time * speedX + rand(i * 67.3) * 6.28) * PARTICLE_DRIFT * aspect;
      py += cos(time * speedY + rand(i * 71.9) * 6.28) * PARTICLE_DRIFT * 0.5;
      
      float dist = length(p - vec2(px, py));
      
      // Blur vs sharp
      float isBlurred = step(1.0 - PARTICLE_BLUR_RATIO, rand(i * 97.1));
      
      // Size
      float size = mix(PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX, rand(i * 83.7));
      size = mix(size, size * PARTICLE_BLUR_MULT, isBlurred);
      
      // Shape
      float sharp = smoothstep(size, size * 0.5, dist);
      float blurred = exp(-dist * dist / (size * size * 2.0));
      float particle = mix(sharp, blurred * 0.5, isBlurred);
      
      // Color
      float colorMix = rand(i * 111.3);
      vec3 particleCol = mix(purple, gold, colorMix);
      
      // Opacity
    float opacity = mix(PARTICLE_OPACITY_MIN, PARTICLE_OPACITY_MAX, rand(i * 123.7));
    opacity = mix(opacity, opacity * PARTICLE_BLUR_OPACITY, isBlurred);

      
      col = mix(col, particleCol, particle * opacity);
    }
    
    // === WAVES (in front of particles) ===
    for(float i = 0.0; i < 9.0; i++) {
      float baseOffset = (i - 4.5) * 0.075 * scale;
      float offsetRand = rand(i * 71.7) * 0.04 - 0.02;
      float offset = baseOffset + offsetRand;
      
      float r1 = rand(i * 7.3 + 1.2);
      float r2 = rand2(i * 13.7 + 5.9);
      float r3 = rand(i * 23.1 + 17.4);
      float r4 = rand2(i * 31.9 + 29.3);
      float r5 = rand(i * 47.7 + 41.2);
      float r6 = rand2(i * 59.3 + 53.1);
      float r7 = rand(i * 67.1 + 61.9);
      
      float speedBase = SPEED_SCALE * (0.2 + r1 * 0.6 + r6 * 0.2);
      float oscRate = 0.03 + r5 * 0.12 + r7 * 0.2;
      float oscAmp = 0.5 + r3 * 1.2 + r4 * 0.8;
      float speedOsc = sin(time * oscRate + r2 * 6.28) * oscAmp;
      float t = time * speedBase + speedOsc * SPEED_SCALE;
      
      float phase = r2 * 6.28 + r4 * 3.14 + r7 * 1.57;
      
      float ampOscRate = 0.15 + r4 * 0.4 + r5 * 0.01;
      float ampVar = sin(time * ampOscRate + phase) * 0.5 + 0.3;
      float amp = AMP_SCALE * (0.3 + r3 * 0.5 + r6 * 0.2) * (0.3 + ampVar * 0.7);
      
      float freq1 = FREQ_SCALE * (0.5 + r1 * 0.5 + r4 * 0.3);
      float freq2 = FREQ_SCALE * (0.3 + r2 * 0.4 + r5 * 0.3);
      float freq3 = FREQ_SCALE * (0.8 + r4 * 0.6 + r6 * 0.4);
      
      float speed1 = SPEED_SCALE * (1.0 + r3 * 0.5);
      float speed2 = SPEED_SCALE * (0.3 + r4 * 0.3);
      float speed3 = SPEED_SCALE * (0.2 + r5 * 0.2);
      
      float wave = sin(p.x * freq1 - t * speed1 + phase) * amp;
      wave += sin(p.x * freq2 + t * speed2 + phase * 0.7 + r6 * 3.14) * amp * 0.6;
      wave += sin(p.x * freq3 - t * speed3 + phase * 1.3 + r7 * 2.0) * amp * 0.3;
      
      float y = p.y - offset - wave;
      
      float line = smoothstep(WAVE_THICKNESS, WAVE_THICKNESS * 0.3, abs(y));
      
      line *= smoothstep(-aspect * 0.5 - 0.1, -aspect * 0.5 + 0.3, p.x);
      line *= smoothstep(aspect * 0.5 + 0.1, aspect * 0.5 - 0.3, p.x);
      
      float colorMix = smoothstep(-0.3, 0.1 , rawX);
      vec3 lineCol = mix(purple, gold, colorMix);
      
      col = mix(col, lineCol, line);
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`
const FluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    // Create shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vertexShader)
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, fragmentShader)
    gl.compileShader(fs)

    // Create program
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Create geometry (full-screen quad)
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time')
    const resolutionLocation = gl.getUniformLocation(program, 'resolution')
    const scaleLocation = gl.getUniformLocation(program, 'scale')  // ADD THIS

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      
    // Scale factor: 1.0 at 1200px+, down to 0.6 at 400px
      const scale = Math.max(0.7, Math.min(1.0, window.innerWidth / 1200))
      gl.uniform1f(scaleLocation, scale)
    }
    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    const startTime = Date.now()
    const render = () => {
      const time = (Date.now() - startTime) / 1000
      gl.uniform1f(timeLocation, time)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">

      {/* Background layer */}
      <div className="absolute inset-x-0 top-0 w-full min-h-screen -z-10">
        <canvas
          ref={canvasRef}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
          }}
        />
      </div>
      
      {/* Globe layer */}
      <div 
        className='absolute z-10 pointer-events-none'
        style={{
          width: 'clamp(800px, 80vw, 1100px)',
          height: 'clamp(800px, 80vw, 1100px)',
          right: 'clamp(-600px, -35vw, -550px)',  // was -200px, now -300px (more off-screen on mobile)
          top: 'clamp(-100px, 15vw, 80px)',      // was 0px max, now 150px (lower on mobile)
        }}
      >
        <div className="w-full h-full pointer-events-auto">
          <Globe 
            landMaskUrl={earthMask} 
            dotSize={1.75} 
            dotSpacing={1.0} 
            initialRotationX={0.3} 
            initialRotationY={-0.8} 
            axialTilt={-23.5} 
            autoRotateSpeed={0.00015} 
            noiseSpeed={.035} 
            noiseIntensity={0.6} 
            sphereColor="#7038ff" 
            sphereGradientColor="#221b42"
            gradientMidpoint={0.8}
            gradientSmoothness={0.9}
            gradientDirection='radial'
          />
        </div>
      </div>
    </div>
  )
}

export default FluidBackground