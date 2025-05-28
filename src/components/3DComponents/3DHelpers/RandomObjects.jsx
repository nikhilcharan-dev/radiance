// RandomObjects.tsx
'use client';

import React, { useEffect, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export const poisData = [
    { id: 'poi4', name: 'Nebula Cluster', color: "yellow", position: [5, 0, 5] },
    { id: 'poi5', name: 'Derelict Ship', position: [-3, 0, 2] },
    { id: 'poi6', name: 'Black Hole', position: [10, 0, -8] },
    { id: 'poi7', name: 'Wormhole', position: [-6, 0, -6] },
    { id: 'poi8', name: 'BlackHole', position: [1, 0, 0] },
];

export function RandomObjects({ poiRefs }) {
    return (
        <>
            {poisData.map(({ id, position, color }) => (
                <RigidBody
                    key={id}
                    ref={ref => { if (ref) poiRefs.current[id] = ref; }}
                    position={position}
                    type="dynamic"
                    mass={0.5}
                    friction={0.3}
                    linearDamping={0.1}
                    angularDamping={0.1}
                    colliders="cuboid"
                >
                    <mesh>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color={color ?? 'white'} />
                    </mesh>
                </RigidBody>
            ))}
        </>
    );
}
