'use client';

import React, {useRef, useEffect, useState} from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Vector3 } from "three";

const MOVE_SPEED = 10; // Adjusted speed
const ROTATION_SPEED = 0.002;

export default function SpaceShip({ shipRef, reset, setShipPosition, setShipVelocity, setShipRotation}) {
    const { scene } = useGLTF('/models/spaceShip_M1.glb');

    const rigidBodyRef = useRef();       // Rapier RigidBody
    const modelRef = useRef();           // Visual mesh (GLTF)
    const keys = useRef({ w: false, a: false, s: false, d: false, shift: false, space: false });
    const rotation = useRef([0, 0]);     // pitch, yaw
    const [opacity, setOpacity] = useState(1);
    const [resetting, setResetting] = useState(false);


    useEffect(() => {
        if (!reset) return;

        setResetting(true);

        // Fade out
        let timeout1 = setTimeout(() => setOpacity(0), 0);

        // After fade out, teleport
        let timeout2 = setTimeout(() => {
            if (rigidBodyRef.current) {
                rigidBodyRef.current.setTranslation(
                    {
                        x: 0, y: 0, z: 0,
                    },
                    true
                );
                rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            }
        }, 500);

        // Fade in
        let timeout3 = setTimeout(() => {
            setOpacity(1);
            setResetting(false);
        }, 1000);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [reset]);

    useFrame((_, delta) => {
        if (!modelRef.current) return;
        modelRef.current.traverse(child => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = opacity;
            }
        });
    });

    // Optional: expose rigidBodyRef externally
    useEffect(() => {
        if (shipRef) shipRef.current = modelRef.current;
    }, [shipRef]);


    // Pointer lock setup
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (document.pointerLockElement === document.body) {
                const sensitivity = ROTATION_SPEED; // Adjust sensitivity as needed
                rotation.current[1] -= e.movementX * sensitivity; // yaw
                rotation.current[0] -= e.movementY * sensitivity; // pitch
                rotation.current[0] = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current[0])); // Clamp pitch
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Keyboard input tracking
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (e.code === 'Space') keys.current.space = true;
            if (key in keys.current) keys.current[key] = true;
            // Pointer lock trigger by keyboard (optional)
            if (key === 'p') {
                if (document.pointerLockElement !== document.body) {
                    document.body.requestPointerLock();
                }
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            if (e.code === 'Space') keys.current.space = false;
            if (key in keys.current) keys.current[key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        const rb = rigidBodyRef.current;
        const obj = modelRef.current;
        if (!rb || !obj) return;

        // Compute target rotation (Euler to Quaternion)
        const euler = new THREE.Euler(rotation.current[0], rotation.current[1], 0, 'YXZ');
        const quat = new THREE.Quaternion().setFromEuler(euler);

        // Apply rotation
        rb.setRotation(quat, true);

        // === Movement Input ===
        const input = new Vector3();
        if (keys.current.w) input.z -= 1;
        if (keys.current.s) input.z += 1;
        if (keys.current.a) input.x -= 1;
        if (keys.current.d) input.x += 1;
        if (keys.current.space) input.y += 1;
        if (keys.current.shift) input.y -= 1;

        // Apply local space movement
        if (input.lengthSq() > 0) {
            input.normalize();
            const localDirection = input.applyQuaternion(quat);
            rb.setLinvel(localDirection.multiplyScalar(MOVE_SPEED), true);
        } else {
            rb.setLinvel({ x: 0, y: 0, z: 0 }, true); // stop when no input
        }

        // Pass data to parent
        const pos = new THREE.Vector3().copy(rb.translation());
        const rot = new THREE.Quaternion().copy(rb.rotation());
        const vel = new THREE.Vector3().copy(rb.linvel());

        setShipPosition(pos);
        setShipRotation(rot);
        setShipVelocity(vel);
    });


    return (
        <RigidBody
            ref={rigidBodyRef}
            colliders="cuboid"
            type="dynamic"
            enabledRotations={[false, false, false]}
            linearDamping={0.4}
            angularDamping={0.8}
            ccd
        >
            <CylinderCollider args={[1, 1]} />
            <group ref={modelRef} scale={0.5} position={[0, -1, 0]}>
                <primitive object={scene} />
            </group>
        </RigidBody>
    );
}
