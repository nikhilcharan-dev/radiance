'use client'

import React, {Suspense, useRef, useState} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import HUD from "@/components/3DComponents/3DHelpers/HUD";
import SpaceShip from "@/components/3DComponents/SpaceShip";
import {poisData, RandomObjects} from "@/components/3DComponents/3DHelpers/RandomObjects";


function FollowCamera({shipPosition, shipRotation, shipVelocity }) {
    const { camera } = useThree();
    const offsetRef = useRef(new THREE.Vector3(0, 1, 5));
    const baseFov = 75;
    const maxFov = 95;

    useFrame(() => {
        if (!shipPosition || !shipRotation || !shipVelocity) return;

        const offset = offsetRef.current.clone();
        const rotation = new THREE.Euler().setFromQuaternion(shipRotation, 'YXZ');
        const desiredPosition = shipPosition.clone().add(offset.applyEuler(rotation));

        camera.position.lerp(desiredPosition, 0.1);
        camera.lookAt(shipPosition);

        // Dynamic FOV zoom
        const speed = shipVelocity.length(); // 0 - ~10 in your case
        const fov = THREE.MathUtils.lerp(baseFov, maxFov, Math.min(speed / 10, 1));
        camera.fov = THREE.MathUtils.lerp(camera.fov, fov, 0.1);
        camera.updateProjectionMatrix();
    });

    return null;
}

function ClickToStart() {
    const [started, setStarted] = useState(false);

    const handleClick = () => {
        if (document.pointerLockElement !== document.body) {
            document.body.requestPointerLock();
        }
        setStarted(true);
    };

    if (started) return null;

    return (
        <div
            onClick={handleClick}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[5px] text-white text-xl cursor-pointer"
        >
            <div className="border-2 border-l-0  border-r-0 h-max w-40 border-solid border-white p-20 text-center" >Click to Start</div>
        </div>
    );
}

function POITracker({ poiRefs, setLivePOIs }) {
    useFrame(() => {
        const updatedPOIs = poisData.map(poi => {
            const ref = poiRefs.current[poi.id];
            if (!ref) return poi;

            const pos = ref.translation(); // RigidBody live position
            return {
                ...poi,
                position: [pos.x, pos.y, pos.z],
            };
        });

        setLivePOIs(updatedPOIs);
    });

    return null;
}

export default function SpaceScene() {
    const shipRef = useRef();
    const poiRefs = useRef({});
    const [livePOIs, setLivePOIs] = useState([]);
    const [shipPosition, setShipPosition] = useState(() => new THREE.Vector3());
    const [shipRotation, setShipRotation] = useState(() => new THREE.Quaternion());
    const [shipVelocity, setShipVelocity] = useState(() => new THREE.Vector3());
    const [resetShip, setResetShip] = useState(false);

    const resetShipPosition = () => {
        setResetShip(prev => !prev);
    };


    return (
        <>
            <HUD position={shipPosition.toArray()}
                 pois={livePOIs}
                 onResetAction={resetShipPosition}
            />
            <ClickToStart />
            <Canvas
                camera={{ fov: 75, position: [0, 2, 10] }}
                className="h-screen w-screen"
            >
                <Suspense fallback={null}>
                    <Stars radius={300} depth={60} count={10000} factor={7} saturation={0} fade />
                    <ambientLight intensity={2} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <Physics gravity={[0, 0, 0]} >
                        <SpaceShip
                            shipRef={shipRef}
                            reset={resetShip}
                            onPositionChange={setShipPosition}
                            setShipPosition={setShipPosition}
                            setShipRotation={setShipRotation}
                            setShipVelocity={setShipVelocity}
                        />
                        <RandomObjects poiRefs={poiRefs} />
                    </Physics>

                    <FollowCamera
                        shipPosition={shipPosition}
                        shipRotation={shipRotation}
                        shipVelocity={shipVelocity}
                    />

                    <POITracker poiRefs={poiRefs} setLivePOIs={setLivePOIs} />
                </Suspense>
            </Canvas>
        </>
    );
}

// <Html center>
//     <div style={{position: 'fixed', bottom: 20, left: 20, color: 'white', fontSize: 16, userSelect: 'none', zIndex: 1000}}>
//         Click anywhere and press 'p' to lock mouse and enable ship movement
//     </div>
// </Html>
