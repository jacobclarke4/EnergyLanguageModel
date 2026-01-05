import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeProps {
  className?: string;
  sphereColor?: string;
  /** Secondary color for sphere gradient. Default '#241c45' */
  sphereGradientColor?: string;
  landColor?: string;
  dotSize?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  noiseIntensity?: number;
  animateNoise?: boolean;
  noiseSpeed?: number;
  initialRotationX?: number;
  initialRotationY?: number;
  axialTilt?: number;
  /** 
   * URL to a land mask image (white/light = land, black/dark = water).
   * For accurate coastlines, use a NASA or Natural Earth texture.
   * Example: "/earth-land-mask.png" or a full URL
   */
  landMaskUrl?: string;
  /** Dot density - lower = more dots, higher = fewer dots. Default 1.8 */
  dotSpacing?: number;
  /** Brightness threshold for land detection (0-255). Default 100 */
  landThreshold?: number;
  /** Where the gradient transition occurs (0 = bottom, 1 = top). Default 0.5 */
  gradientMidpoint?: number;
  /** How smooth the transition is (0 = sharp, 1 = very smooth). Default 0.5 */
  gradientSmoothness?: number;
  /** Gradient direction: 'vertical' | 'radial' | 'diagonal'. Default 'vertical' */
  gradientDirection?: 'vertical' | 'radial' | 'diagonal';
}

// ============================================
// SIMPLEX NOISE IMPLEMENTATION
// ============================================
class SimplexNoise {
  private perm: number[] = [];
  private gradP: { x: number; y: number; z: number }[] = [];
  
  private grad3 = [
    {x:1,y:1,z:0}, {x:-1,y:1,z:0}, {x:1,y:-1,z:0}, {x:-1,y:-1,z:0},
    {x:1,y:0,z:1}, {x:-1,y:0,z:1}, {x:1,y:0,z:-1}, {x:-1,y:0,z:-1},
    {x:0,y:1,z:1}, {x:0,y:-1,z:1}, {x:0,y:1,z:-1}, {x:0,y:-1,z:-1}
  ];

  private p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
    8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,
    57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,
    65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,
    164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,
    207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,
    221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,
    104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,
    239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,
    236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

  constructor(seed?: number) {
    if (seed === undefined) seed = Math.random();
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;

    for (let i = 0; i < 256; i++) {
      const v = (i & 1) ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  private dot3(g: { x: number; y: number; z: number }, x: number, y: number, z: number): number {
    return g.x * x + g.y * y + g.z * z;
  }

  noise3D(x: number, y: number, z: number): number {
    const F3 = 1 / 3, G3 = 1 / 6;
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;

    const ii = i & 255, jj = j & 255, kk = k & 255;

    const n = (tx: number, gx: number, gy: number, gz: number, px: number, py: number, pz: number) => {
      if (tx < 0) return 0;
      tx *= tx;
      return tx * tx * this.dot3(this.gradP[ii + gx + this.perm[jj + gy + this.perm[kk + gz]]], px, py, pz);
    };

    return 32 * (
      n(0.6 - x0*x0 - y0*y0 - z0*z0, 0, 0, 0, x0, y0, z0) +
      n(0.6 - x1*x1 - y1*y1 - z1*z1, i1, j1, k1, x1, y1, z1) +
      n(0.6 - x2*x2 - y2*y2 - z2*z2, i2, j2, k2, x2, y2, z2) +
      n(0.6 - x3*x3 - y3*y3 - z3*z3, 1, 1, 1, x3, y3, z3)
    );
  }
}

// ============================================
// FALLBACK CONTINENT DATA (used if no texture provided)
// ============================================
const FALLBACK_CONTINENTS: Record<string, number[][]> = {
  northAmerica: [
    [-168, 65], [-161, 70], [-145, 70], [-130, 70], [-117, 69], [-95, 68],
    [-85, 70], [-75, 76], [-62, 73], [-58, 68], [-64, 64], [-60, 56],
    [-55, 47], [-67, 44], [-74, 40], [-76, 35], [-81, 28], [-88, 25],
    [-97, 26], [-97, 22], [-87, 15], [-78, 8], [-82, 9], [-92, 16],
    [-105, 20], [-110, 27], [-117, 32], [-124, 40], [-124, 48], [-135, 58],
    [-152, 60], [-162, 60], [-168, 65]
  ],
  alaska: [
    [-168, 65], [-172, 62], [-178, 65], [172, 68], [165, 65], [162, 58],
    [155, 56], [165, 54], [-175, 52], [-160, 55], [-152, 60], [-145, 60],
    [-140, 62], [-152, 68], [-165, 68], [-168, 65]
  ],
  southAmerica: [
    [-78, 10], [-71, 12], [-60, 8], [-50, 0], [-44, -3], [-35, -10],
    [-40, -20], [-48, -26], [-53, -32], [-60, -38], [-68, -46], [-74, -52],
    [-68, -55], [-58, -50], [-57, -35], [-62, -28], [-68, -20], [-75, -15],
    [-80, -8], [-80, 0], [-77, 7], [-78, 10]
  ],
  europe: [
    [-10, 36], [-9, 40], [-2, 43], [8, 44], [14, 46], [8, 50], [3, 53],
    [8, 55], [12, 60], [28, 60], [28, 66], [20, 70], [30, 68], [42, 66],
    [50, 58], [55, 56], [52, 50], [45, 46], [40, 40], [32, 36], [25, 40],
    [20, 36], [12, 38], [6, 43], [-2, 40], [-8, 36], [-10, 36]
  ],
  africa: [
    [-18, 28], [-10, 32], [0, 36], [10, 33], [25, 32], [32, 30], [38, 25],
    [50, 12], [48, 5], [42, -5], [38, -18], [32, -28], [22, -35], [15, -30],
    [12, -18], [8, -5], [2, 5], [-10, 8], [-17, 15], [-18, 28]
  ],
  asia: [
    [60, 56], [70, 62], [80, 72], [100, 78], [140, 72], [170, 68],
    [175, 55], [155, 50], [140, 46], [130, 42], [122, 35], [118, 28],
    [110, 20], [105, 12], [98, 5], [105, 0], [120, -8], [135, -2],
    [142, -5], [150, -10], [150, 0], [140, 20], [142, 40], [150, 50],
    [155, 62], [130, 68], [90, 70], [60, 62], [55, 58], [60, 56]
  ],
  india: [[68, 24], [72, 32], [78, 32], [88, 26], [95, 28], [93, 18], [85, 12], [78, 8], [74, 15], [68, 24]],
  australia: [[114, -22], [122, -18], [135, -12], [142, -10], [148, -20], [154, -28], [148, -38], [140, -40], [130, -33], [118, -35], [113, -28], [114, -22]],
  japan: [[130, 32], [135, 35], [140, 38], [145, 44], [142, 38], [138, 33], [130, 32]],
  uk: [[-10, 52], [-6, 55], [-2, 59], [2, 53], [-2, 50], [-6, 52], [-10, 52]],
  greenland: [[-45, 60], [-35, 68], [-22, 76], [-25, 82], [-45, 82], [-60, 74], [-52, 62], [-45, 60]],
  newZealand: [[168, -35], [175, -37], [178, -42], [170, -46], [166, -40], [168, -35]],
  madagascar: [[44, -12], [50, -18], [47, -25], [43, -20], [44, -12]],
  indonesia: [[95, 5], [105, 0], [115, -8], [125, -5], [140, -5], [135, -4], [125, -8], [112, -8], [100, -2], [95, 5]],
  iceland: [[-24, 64], [-15, 66], [-13, 65], [-20, 63], [-24, 64]],
  cuba: [[-85, 22], [-78, 22], [-75, 20], [-82, 21], [-85, 22]],
};

const Globe: React.FC<GlobeProps> = ({ 
  className,
  sphereColor = '#6b21a8',
  sphereGradientColor = '#241c45',
  landColor = '#fbbf24',
  dotSize = 2.5,
  autoRotate = true,
  autoRotateSpeed = 0.003,
  noiseIntensity = 0.5,
  animateNoise = true,
  noiseSpeed = 0.3,
  initialRotationX = 0.1,
  initialRotationY = -0.5,
  axialTilt = 23.5,
  landMaskUrl,
  dotSpacing = 1.8,
  landThreshold = 100,
  gradientMidpoint = 0.5,
  gradientSmoothness = 0.5,
  gradientDirection = 'vertical',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const dotsRef = useRef<THREE.Points | null>(null);
  const landPointsRef = useRef<{ lat: number; lng: number; baseRadius: number; useAltColor: boolean }[]>([]);
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise(42));
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const fitDistance = Math.max(280, 280 * (1 / Math.min(width / height, 1)));
    camera.position.z = fitDistance;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = axialTilt * (Math.PI / 180);
    globeGroup.add(tiltGroup);

    const rotationGroup = new THREE.Group();
    tiltGroup.add(rotationGroup);

    const GLOBE_RADIUS = 100;
    const noise = noiseRef.current;

    // Parse hex colors to RGB values
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 0, g: 0, b: 0 };
    };
    
    const c1 = hexToRgb(sphereColor);
    const c2 = hexToRgb(sphereGradientColor);

    // Get direction value for shader
    const getDirectionValue = () => {
      switch (gradientDirection) {
        case 'vertical': return 0;
        case 'radial': return 1;
        case 'diagonal': return 2;
        default: return 0;
      }
    };

    // Solid sphere with enhanced gradient controls
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 0.5, 64, 64);
    
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Vector3(c1.r, c1.g, c1.b) },
        color2: { value: new THREE.Vector3(c2.r, c2.g, c2.b) },
        midpoint: { value: gradientMidpoint },
        smoothness: { value: gradientSmoothness },
        direction: { value: getDirectionValue() },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float midpoint;
        uniform float smoothness;
        uniform int direction;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          float t;
          
          // Calculate base gradient value based on direction
          if (direction == 0) {
            // Vertical (top to bottom)
            t = (vPosition.y + 100.0) / 200.0;
          } else if (direction == 1) {
            // Radial (center outward based on viewing angle)
            t = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
          } else {
            // Diagonal
            t = (vPosition.y + vPosition.x + 200.0) / 400.0;
          }
          
          t = clamp(t, 0.0, 1.0);
          
          // Apply midpoint shift
          // Remap t so that midpoint becomes 0.5
          float mp = clamp(midpoint, 0.01, 0.99);
          if (t < mp) {
            t = t / mp * 0.5;
          } else {
            t = 0.5 + (t - mp) / (1.0 - mp) * 0.5;
          }
          
          // Apply smoothness (using smoothstep for controllable falloff)
          float sm = clamp(smoothness, 0.01, 1.0);
          float edge0 = 0.5 - sm * 0.5;
          float edge1 = 0.5 + sm * 0.5;
          t = smoothstep(edge0, edge1, t);
          
          vec3 color = mix(color2, color1, t);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    
    rotationGroup.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

    // ============================================
    // LAND DETECTION - TEXTURE OR FALLBACK
    // ============================================
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${url}`));
        img.src = url;
      });
    };

    const createFallbackLandMask = (): ImageData => {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 360;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 720, 360);
      ctx.fillStyle = 'white';
      
      for (const coords of Object.values(FALLBACK_CONTINENTS)) {
        if (coords.length < 3) continue;
        ctx.beginPath();
        ctx.moveTo((coords[0][0] + 180) * 2, (90 - coords[0][1]) * 2);
        for (let i = 1; i < coords.length; i++) {
          ctx.lineTo((coords[i][0] + 180) * 2, (90 - coords[i][1]) * 2);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      return ctx.getImageData(0, 0, 720, 360);
    };

    const createLandDots = async () => {
      let imageData: ImageData;
      let imgWidth: number;
      let imgHeight: number;

      if (landMaskUrl) {
        try {
          console.log(`Loading land mask from: ${landMaskUrl}`);
          const img = await loadImage(landMaskUrl);
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          
          imageData = ctx.getImageData(0, 0, img.width, img.height);
          imgWidth = img.width;
          imgHeight = img.height;
          
          console.log(`Loaded texture: ${imgWidth}x${imgHeight}`);
        } catch (e) {
          console.warn('Failed to load land mask texture, using fallback polygons:', e);
          imageData = createFallbackLandMask();
          imgWidth = 720;
          imgHeight = 360;
        }
      } else {
        console.log('No landMaskUrl provided, using fallback polygons');
        imageData = createFallbackLandMask();
        imgWidth = 720;
        imgHeight = 360;
      }

      const isLand = (lat: number, lng: number): boolean => {
        const u = (lng + 180) / 360;
        const v = (90 - lat) / 180;
        
        const x = Math.floor(u * imgWidth);
        const y = Math.floor(v * imgHeight);
        
        const clampedX = Math.max(0, Math.min(imgWidth - 1, x));
        const clampedY = Math.max(0, Math.min(imgHeight - 1, y));
        
        const index = (clampedY * imgWidth + clampedX) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const brightness = (r + g + b) / 3;
        
        return brightness > landThreshold;
      };

      const landPoints: { lat: number; lng: number; baseRadius: number; useAltColor: boolean }[] = [];
      
      for (let lat = -90; lat <= 90; lat += dotSpacing) {
        const circumference = Math.cos(lat * Math.PI / 180);
        const lngStep = dotSpacing / Math.max(circumference, 0.2);
        
        for (let lng = -180; lng < 180; lng += lngStep) {
          if (isLand(lat, lng)) {
            landPoints.push({ 
              lat, 
              lng, 
              baseRadius: GLOBE_RADIUS + 0.8,
              useAltColor: Math.random() > 0.5
            });
          }
        }
      }

      landPointsRef.current = landPoints;
      console.log(`Generated ${landPoints.length} land dots`);

      const positions = new Float32Array(landPoints.length * 3);
      const colors = new Float32Array(landPoints.length * 3);
      const baseColor = new THREE.Color(landColor);

      updateDotPositions(positions, colors, baseColor, 0);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: dotSize,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
      });

      const dots = new THREE.Points(geometry, material);
      dotsRef.current = dots;
      rotationGroup.add(dots);
    };

    const updateDotPositions = (
      positions: Float32Array, 
      colors: Float32Array, 
      baseColor: THREE.Color, 
      time: number
    ) => {
      const landPoints = landPointsRef.current;
      const maxHeight = 8 * noiseIntensity;
      
      for (let i = 0; i < landPoints.length; i++) {
        const { lat, lng, baseRadius } = landPoints[i];
        
        const latRad = lat * (Math.PI / 180);
        const lngRad = lng * (Math.PI / 180);
        
        const nx = Math.cos(latRad) * Math.cos(lngRad);
        const ny = Math.cos(latRad) * Math.sin(lngRad);
        const nz = Math.sin(latRad);
        
        let noiseValue = 0;
        noiseValue += noise.noise3D(nx * 2 + time, ny * 2 + time, nz * 2) * 0.5;
        noiseValue += noise.noise3D(nx * 4 + time * 0.5, ny * 4 + time * 0.5, nz * 4) * 0.3;
        noiseValue += noise.noise3D(nx * 8, ny * 8, nz * 8) * 0.2;
        
        const height = (noiseValue + 1) * 0.5;
        const r = baseRadius + height * maxHeight;
        
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        positions[i * 3] = -r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi);
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        
        const { useAltColor } = landPoints[i];
        const brightness = 0.85 + height * 0.25;
        
        if (useAltColor) {
          // Rose/pink variant (#b87990)
          colors[i * 3] = (0xb8 / 255) * brightness;
          colors[i * 3 + 1] = (0x79 / 255) * brightness;
          colors[i * 3 + 2] = (0x90 / 255) * brightness;
        } else {
          // Original gold (#fbbf24)
          colors[i * 3] = baseColor.r * brightness;
          colors[i * 3 + 1] = baseColor.g * brightness;
          colors[i * 3 + 2] = baseColor.b * brightness;
        }
      }
    };

    createLandDots();

    globeGroup.rotation.x = initialRotationX;
    globeGroup.rotation.y = initialRotationY;

    // Interaction
    let isDragging = false;
    let prevX = 0, prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      container.style.cursor = 'grabbing';
    };

    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        globeGroup.rotation.y += (e.clientX - prevX) * 0.005;
        globeGroup.rotation.x += (e.clientY - prevY) * 0.005;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => { isDragging = false; };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        globeGroup.rotation.y += (e.touches[0].clientX - prevX) * 0.005;
        globeGroup.rotation.x += (e.touches[0].clientY - prevY) * 0.005;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchmove', onTouchMove);

    // Animation
    const baseColor = new THREE.Color(landColor);
    
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (animateNoise && dotsRef.current) {
        timeRef.current += 0.016 * noiseSpeed;
        const positions = dotsRef.current.geometry.attributes.position.array as Float32Array;
        const colors = dotsRef.current.geometry.attributes.color.array as Float32Array;
        updateDotPositions(positions, colors, baseColor, timeRef.current);
        dotsRef.current.geometry.attributes.position.needsUpdate = true;
        dotsRef.current.geometry.attributes.color.needsUpdate = true;
      }
      
      if (autoRotate && !isDragging) {
        rotationGroup.rotation.y += autoRotateSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.position.z = Math.max(280, 280 * (1 / Math.min(w / h, 1)));
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    sphereColor, 
    sphereGradientColor, 
    landColor, 
    dotSize, 
    autoRotate, 
    autoRotateSpeed, 
    noiseIntensity, 
    animateNoise, 
    noiseSpeed, 
    initialRotationX, 
    initialRotationY, 
    axialTilt, 
    landMaskUrl, 
    dotSpacing, 
    landThreshold,
    gradientMidpoint,
    gradientSmoothness,
    gradientDirection,
  ]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'grab' }}
    />
  );
};

export default Globe;