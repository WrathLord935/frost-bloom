import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Iteration 1: "Fluid Reveal" (Maximum Compatibility)
 * Reverted to HalfFloatType for Intel UHD support, while maintaining high precision.
 */
interface FluidRevealProps {
  winterSrc: string;
  springSrc: string;
  dissipation?: number;
  velocityDissipation?: number;
  splatRadius?: number;
  strength?: number;
}

const FluidReveal: React.FC<FluidRevealProps> = ({
  winterSrc,
  springSrc,
  dissipation = 0.91,
  velocityDissipation = 0.96,
  splatRadius = 0.0012,
  strength = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    
    // --- WebGL Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });

    const updateSize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    // --- Loading ---
    const textureLoader = new THREE.TextureLoader();
    const winterTex = textureLoader.load(winterSrc);
    const springTex = textureLoader.load(springSrc);
    winterTex.minFilter = springTex.minFilter = THREE.LinearFilter;

    // --- High-Performance Buffers ---
    const type = THREE.HalfFloatType; // Safer compatibility
    const simRes = 128;
    const dyeRes = 512;
    function createFBO(res: number, channels: number = 4) {
      return new THREE.WebGLRenderTarget(res, res, {
        type: type,
        format: channels === 4 ? THREE.RGBAFormat : THREE.RGFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      });
    }

    const density = {
      read: createFBO(dyeRes),
      write: createFBO(dyeRes),
      swap() { [this.read, this.write] = [this.write, this.read]; }
    };
    const velocity = {
      read: createFBO(simRes, 2),
      write: createFBO(simRes, 2),
      swap() { [this.read, this.write] = [this.write, this.read]; }
    };
    const divergence = createFBO(simRes, 1);
    const pressure = {
      read: createFBO(simRes, 1),
      write: createFBO(simRes, 1),
      swap() { [this.read, this.write] = [this.write, this.read]; }
    };

    // --- Shaders ---
    const baseVertex = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;
    const commonMatSettings = { vertexShader: baseVertex, depthTest: false, depthWrite: false };

    const advectionMat = new THREE.ShaderMaterial({
      ...commonMatSettings,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform float dt;
        uniform float dissipation;
        void main() {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy;
          coord = clamp(coord, 0.0, 1.0);
          gl_FragColor = dissipation * texture2D(uSource, coord);
        }
      `,
      uniforms: { uVelocity: { value: null }, uSource: { value: null }, dt: { value: 0.016 }, dissipation: { value: 1.0 } }
    });

    const splatMat = new THREE.ShaderMaterial({
      ...commonMatSettings,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec2 point;
        uniform vec3 color;
        uniform float radius;
        void main() {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec4 base = texture2D(uTarget, vUv);
          gl_FragColor = vec4(base.rgb + splat, 1.0);
        }
      `,
      uniforms: { uTarget: { value: null }, aspectRatio: { value: 1.0 }, point: { value: new THREE.Vector2() }, color: { value: new THREE.Vector3() }, radius: { value: splatRadius } }
    });

    const divergenceMat = new THREE.ShaderMaterial({
      ...commonMatSettings,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        void main() {
          float L = texture2D(uVelocity, clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
          float R = texture2D(uVelocity, clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
          float T = texture2D(uVelocity, clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0)).y;
          float B = texture2D(uVelocity, clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0)).y;
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
      uniforms: { uVelocity: { value: null }, texelSize: { value: new THREE.Vector2(1/simRes, 1/simRes) } }
    });

    const pressureMat = new THREE.ShaderMaterial({
      ...commonMatSettings,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        uniform vec2 texelSize;
        void main() {
          float L = texture2D(uPressure, clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
          float R = texture2D(uPressure, clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
          float T = texture2D(uPressure, clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0)).x;
          float B = texture2D(uPressure, clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0)).x;
          float div = texture2D(uDivergence, vUv).x;
          float p = (L + R + B + T - div) * 0.25;
          gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
        }
      `,
      uniforms: { uPressure: { value: null }, uDivergence: { value: null }, texelSize: { value: new THREE.Vector2(1/simRes, 1/simRes) } }
    });

    const gradientSubtractMat = new THREE.ShaderMaterial({
      ...commonMatSettings,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        uniform vec2 texelSize;
        void main() {
          float L = texture2D(uPressure, clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
          float R = texture2D(uPressure, clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
          float T = texture2D(uPressure, clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0)).x;
          float B = texture2D(uPressure, clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0)).x;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          vel -= vec2(R - L, T - B);
          gl_FragColor = vec4(vel, 0.0, 1.0);
        }
      `,
      uniforms: { uPressure: { value: null }, uVelocity: { value: null }, texelSize: { value: new THREE.Vector2(1/simRes, 1/simRes) } }
    });

    const displayMat = new THREE.ShaderMaterial({
      ...commonMatSettings,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tWinter;
        uniform sampler2D tSpring;
        uniform sampler2D tDensity;
        void main() {
          vec4 winter = texture2D(tWinter, vUv);
          vec4 spring = texture2D(tSpring, vUv);
          float mask = texture2D(tDensity, vUv).r;
          mask = smoothstep(0.01, 0.15, mask);
          gl_FragColor = mix(winter, spring, clamp(mask, 0.0, 1.0));
        }
      `,
      uniforms: { tWinter: { value: winterTex }, tSpring: { value: springTex }, tDensity: { value: density.read.texture } }
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displayMat);
    scene.add(quad);

    // --- Zero-Lag Robust ---
    const mouse = { x: 0, y: 0, lx: 0, ly: 0, first: true };
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      if (mouse.first) { mouse.lx = mouse.x; mouse.ly = mouse.y; mouse.first = false; }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- High-Stability Loop ---
    const fixedDt = 1.0 / 60.0;
    const renderLoop = () => {
      // 1. Advection
      quad.material = advectionMat;
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = velocity.read.texture;
      advectionMat.uniforms.dt.value = fixedDt;
      advectionMat.uniforms.dissipation.value = velocityDissipation;
      renderer.setRenderTarget(velocity.write); renderer.render(scene, camera); velocity.swap();

      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = density.read.texture;
      advectionMat.uniforms.dissipation.value = dissipation;
      renderer.setRenderTarget(density.write); renderer.render(scene, camera); density.swap();

      // 2. Interaction
      const dist = Math.hypot(mouse.x - mouse.lx, mouse.y - mouse.ly);
      if (dist > 0) {
        quad.material = splatMat;
        splatMat.uniforms.aspectRatio.value = canvas.clientWidth / canvas.clientHeight;
        const subSteps = Math.min(Math.ceil(dist * 120), 10);
        for (let i = 1; i <= subSteps; i++) {
          const t = i / subSteps;
          const curX = mouse.lx + (mouse.x - mouse.lx) * t;
          const curY = mouse.ly + (mouse.y - mouse.ly) * t;
          const dx = (mouse.x - mouse.lx) / subSteps;
          const dy = (mouse.y - mouse.ly) / subSteps;

          splatMat.uniforms.uTarget.value = velocity.read.texture;
          splatMat.uniforms.point.value.set(curX, curY);
          splatMat.uniforms.color.value.set(dx, dy, 0).multiplyScalar(80.0 * strength);
          renderer.setRenderTarget(velocity.write); renderer.render(scene, camera); velocity.swap();

          splatMat.uniforms.uTarget.value = density.read.texture;
          splatMat.uniforms.color.value.set(1.0, 1.0, 1.0).multiplyScalar(strength);
          renderer.setRenderTarget(density.write); renderer.render(scene, camera); density.swap();
        }
        mouse.lx = mouse.x; mouse.ly = mouse.y;
      }

      // 3. Projection
      quad.material = divergenceMat;
      divergenceMat.uniforms.uVelocity.value = velocity.read.texture;
      renderer.setRenderTarget(divergence); renderer.render(scene, camera);

      quad.material = pressureMat;
      pressureMat.uniforms.uDivergence.value = divergence.texture;
      for (let i = 0; i < 15; i++) {
        pressureMat.uniforms.uPressure.value = pressure.read.texture;
        renderer.setRenderTarget(pressure.write); renderer.render(scene, camera); pressure.swap();
      }

      quad.material = gradientSubtractMat;
      gradientSubtractMat.uniforms.uPressure.value = pressure.read.texture;
      gradientSubtractMat.uniforms.uVelocity.value = velocity.read.texture;
      renderer.setRenderTarget(velocity.write); renderer.render(scene, camera); velocity.swap();

      // 4. Display
      quad.material = displayMat;
      displayMat.uniforms.tDensity.value = density.read.texture;
      renderer.setRenderTarget(null); renderer.render(scene, camera);

      requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
      renderer.dispose();
      winterTex.dispose();
      springTex.dispose();
    };
  }, [winterSrc, springSrc, dissipation, velocityDissipation, splatRadius, strength]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default FluidReveal;
