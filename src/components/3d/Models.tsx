import React, { useRef } from 'react'
import { useGLTF, Center } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* 
  ALPHABET BLOCK STACK (J-A-C-K)
*/
export function HangmanModel(props: any) {
  // Path points to public/wooden_alphabet_blocks.glb
  const { nodes, materials } = useGLTF('/wooden_alphabet_blocks.glb') as any
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005
    }
  })

  // Common mesh props to avoid repetition
  const common = {
    material: materials.DCletterblocks,
    rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
    scale: 100 // Models are tiny (avg 0.01 scale in source), 100 sets them to a nice size
  }

  return (
    <group ref={group} {...props} dispose={null} scale={0.07}>
      {/* 'A' - Centered Single Block */}
      <mesh
        geometry={nodes.A_low_DCletterblocks_0.geometry}
        {...common}
        position={[0, 0, 0]}
      />
    </group>
  )
}

/* 
  SINGLE EASTER EGG (Extracted from eggs.glb)
*/
export function EggModel(props: any) {
  // Path points to public/eggs.glb
  const { nodes, materials } = useGLTF('/eggs.glb') as any
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      // Spinning on the Y axis, but we'll tilt the whole group below
      group.current.rotation.y += 0.015
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05
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
  const { nodes, materials } = useGLTF('/ice_cube.glb') as any
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
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
