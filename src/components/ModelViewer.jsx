import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF, Center, Html } from '@react-three/drei'

// Placeholder geometry per product shape, shown until real GLB models are
// uploaded to R2 and wired via product.modelUrl.
function PlaceholderMesh({ shape, hue }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25
  })

  const color = `hsl(${hue}, 6%, 22%)`
  const mat = <meshPhysicalMaterial color={color} roughness={0.35} metalness={0.1} clearcoat={0.6} clearcoatRoughness={0.4} />

  const geo = {
    torusknot: <torusKnotGeometry args={[0.85, 0.28, 220, 36]} />,
    torus: <torusGeometry args={[0.95, 0.34, 32, 96]} />,
    icosahedron: <icosahedronGeometry args={[1.15, 0]} />,
    capsule: <capsuleGeometry args={[0.6, 1.1, 12, 32]} />,
    box: <boxGeometry args={[1.5, 1.1, 1.1]} />,
    wave: <torusKnotGeometry args={[0.85, 0.2, 160, 24, 3, 4]} />,
    knot2: <torusKnotGeometry args={[0.8, 0.3, 200, 32, 2, 5]} />,
    cylinder: <cylinderGeometry args={[0.85, 0.95, 1.5, 48]} />,
    helix: <torusKnotGeometry args={[0.75, 0.22, 200, 28, 4, 3]} />,
    sphere: <sphereGeometry args={[1.05, 48, 48]} />,
  }[shape] || <sphereGeometry args={[1, 48, 48]} />

  return (
    <mesh ref={ref} castShadow>
      {geo}
      {mat}
    </mesh>
  )
}

function GLBModel({ url }) {
  const { scene } = useGLTF(url)
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.2
  })
  return (
    <Center>
      <primitive ref={ref} object={scene} />
    </Center>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', whiteSpace: 'nowrap' }}>
        Loading model…
      </div>
    </Html>
  )
}

export default function ModelViewer({ product, modelUrl }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 4.2], fov: 42 }}
      style={{ touchAction: 'pan-y', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={<Loader />}>
        {modelUrl ? <GLBModel url={modelUrl} /> : <PlaceholderMesh shape={product.shape} hue={product.hue} />}
        <Environment preset="city" />
      </Suspense>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.35} scale={8} blur={2.6} far={3} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.4}
        maxDistance={7}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={false}
      />
    </Canvas>
  )
}
