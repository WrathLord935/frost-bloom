import { useRef, useMemo } from 'react'
import { useGLTF, Center } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// [FIX] GLTF textures must have flipY=false to avoid WebGL texSubImage deprecation warnings
// Drei's useGLTF usually handles this but we'll ensure it here
const fixGltfTextures = (gltf: any) => {
  if (!gltf?.scene) return
  gltf.scene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((mat: any) => {
        Object.keys(mat).forEach(prop => {
          if (mat[prop] && mat[prop].isTexture) {
            mat[prop].flipY = false
          }
        })
      })
    }
  })
}

/* 
  ALPHABET BLOCK STACK (J-A-C-K)
*/
export function HangmanModel({ wrongGuesses = 0, ...props }: { wrongGuesses?: number } & any) {
  // Path points to public/wooden_alphabet_blocks.glb
  const gltf = useGLTF('/wooden_alphabet_blocks.glb') as any
  const { nodes, materials } = gltf
  fixGltfTextures(gltf)
  const group = useRef<THREE.Group>(null)

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (group.current) {
      timeRef.current += delta
      group.current.rotation.y += 0.005
      
      // Shake effect when close to losing
      if (wrongGuesses >= 4) {
        group.current.position.x = Math.sin(timeRef.current * 20) * 0.02
        group.current.position.z = Math.cos(timeRef.current * 15) * 0.02
      } else {
        group.current.position.x = 0
        group.current.position.z = 0
      }
    }
  })

  // Common mesh props
  const common = {
    material: materials.DCletterblocks,
    rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
    scale: 100
  }

  // Dynamic color shift based on wrong guesses (turns icy)
  // [FIX] Memoize to prevent redundant shader recompilation and precision warnings
  const blockMaterial = useMemo(() => {
    const mat = materials.DCletterblocks.clone()
    if (wrongGuesses > 0) {
      const frostiness = wrongGuesses / 6
      mat.emissive = new THREE.Color(0x00a0ef).multiplyScalar(frostiness)
      mat.emissiveIntensity = frostiness * 2
    }
    return mat
  }, [materials.DCletterblocks, wrongGuesses])

  return (
    <group ref={group} {...props} dispose={null} scale={0.07}>
      {/* 'J' - Bottom */}
      {wrongGuesses >= 1 && (
        <mesh geometry={nodes.J_low_DCletterblocks_0.geometry} {...common} material={blockMaterial} position={[0, -5, 0]} />
      )}
      {/* 'A' */}
      {wrongGuesses >= 2 && (
        <mesh geometry={nodes.A_low_DCletterblocks_0.geometry} {...common} material={blockMaterial} position={[0, 0, 0]} />
      )}
      {/* 'C' */}
      {wrongGuesses >= 3 && (
        <mesh geometry={nodes.C_low_DCletterblocks_0.geometry} {...common} material={blockMaterial} position={[0, 5, 0]} />
      )}
      {/* 'K' - Top */}
      {wrongGuesses >= 4 && (
        <mesh geometry={nodes.K_low_DCletterblocks_0.geometry} {...common} material={blockMaterial} position={[0, 10, 0]} />
      )}

      {/* If 0 wrong guesses, maybe show a hint or a ghost of 'A' */}
      {wrongGuesses === 0 && (
         <mesh 
          geometry={nodes.A_low_DCletterblocks_0.geometry} 
          {...common} 
          position={[0, 0, 0]}
        >
          <meshStandardMaterial 
            {...materials.DCletterblocks} 
            transparent={true} 
            opacity={0.3} 
          />
        </mesh>
      )}
    </group>
  )
}

/* 
  SINGLE EASTER EGG (Extracted from eggs.glb)
*/
export function EggModel(props: any) {
  // Path points to public/eggs.glb
  const gltf = useGLTF('/eggs.glb') as any
  const { nodes, materials } = gltf
  fixGltfTextures(gltf)
  const group = useRef<THREE.Group>(null)

  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (group.current) {
      timeRef.current += delta
      // Spinning on the Y axis, but we'll tilt the whole group below
      group.current.rotation.y += 0.015
      group.current.position.y = Math.sin(timeRef.current) * 0.05
    }
  })

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={0.6}
      rotation={[Math.PI / 4, 0, Math.PI / 4]} // 45-degree up-right tilt
    >
      <Center>
        <mesh geometry={nodes.Object_2.geometry} material={materials.EGG1_TEX} rotation={[-Math.PI / 2, 0, 0]} />
      </Center>
    </group>
  )
}

/* 
  ICE CUBE (New Model)
*/
export function IceCubeModel(props: any) {
  // Path points to public/ice_cube.glb
  const gltf = useGLTF('/ice_cube.glb') as any
  const { nodes, materials } = gltf
  fixGltfTextures(gltf)
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.008
      group.current.rotation.x += 0.003
    }
  })

  return (
    <group ref={group} {...props} dispose={null} scale={1.1}>
      <Center>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={0.571}>
          <mesh geometry={nodes['Material_001-material'].geometry} material={materials.Material_001} position={[0, 0, 1]} />
        </group>
      </Center>
    </group>
  )
}

// Preload models for better UX
useGLTF.preload('/wooden_alphabet_blocks.glb')
useGLTF.preload('/eggs.glb')
useGLTF.preload('/ice_cube.glb')
