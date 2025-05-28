'use client';

import React, { useState } from 'react';

export default function HUD({ position, pois, onResetAction }) {
    const [showGuide, setShowGuide] = useState(false);

    const mapSize = 150;
    const scale = 5;
    const markerSize = 12;
    const markerOffset = markerSize / 2;

    return (
        <>
            {/* Mini Map */}
            <div className="fixed top-5 left-5 w-[150px] h-[150px] bg-black/70 border-2 border-white rounded-md overflow-hidden text-xs text-white z-[1000] p-1.5 select-none">
                <div className="absolute top-0 left-0 w-full h-full">
                    {pois.map(({ id, name, position: poiPos, color }) => {
                        const dx = poiPos[0] - position[0];
                        const dz = poiPos[2] - position[2];
                        const relX = mapSize / 2 + dx * scale;
                        const relY = mapSize / 2 + dz * scale;

                        return (
                            <div
                                key={id}
                                className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                style={{ top: relY - markerOffset, left: relX - markerOffset }}
                                title={name}
                                onClick={() => alert(`Clicked on ${name}`)}
                            >
                                <div
                                    className="w-[12px] h-[12px] rounded-full border-2 border-white mx-auto box-border"
                                    style={{
                                        backgroundColor: color ?? '#fff',
                                        boxShadow: `0 0 6px 2px ${color ?? '#fff'}`
                                    }}
                                />
                                <div className="mt-0.5 text-[10px] whitespace-nowrap">{name}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Ship marker (centered) */}
                <div
                    className="absolute rounded-full bg-orange-500 border-2 border-white pointer-events-none box-border"
                    style={{
                        width: markerSize,
                        height: markerSize,
                        top: mapSize / 2 - markerOffset,
                        left: mapSize / 2 - markerOffset,
                    }}
                    title="Your Ship"
                />
                <div
                    className="absolute text-white text-[10px]  font-bold pointer-events-none select-none"
                    style={{
                        top: mapSize / 2 - markerOffset + 1,
                        left: mapSize / 2 - markerOffset + 13,
                    }}
                    title="You"
                >
                    Me
                </div>

                <div className="absolute bottom-1 left-1 text-xs select-none">Map</div>
            </div>

            {/* Guide Toggle Button */}
            <button
                className="fixed top-[200px] left-10  h-[30px] w-[50px]  bg-zinc-800 text-white border border-white rounded-md cursor-pointer z-[1001] select-none"
                onClick={() => setShowGuide(!showGuide)}
            >
                {showGuide ? 'Close' : 'Guide'}
            </button>

            {/* Guide Panel */}
            {showGuide && (
                <div className="fixed top-[250px] left-5 w-[300px] bg-black/60 p-3 rounded-md text-white z-[1001] select-none">
                    <h3 className="text-lg font-semibold mb-2">Controls Guide</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>W-A-S-D: Move forward/left/back/right</li>
                        <li>Space / Shift: Move up / down</li>
                        <li>Mouse Click / P: Look around / rotate ship</li>
                        <li>ESC: Unlock pointer (release mouse)</li>
                    </ul>
                </div>
            )}

            {/* Reset Button */}
            <button
                onClick={onResetAction}
                className="fixed top-[200px] left-25 bg-blue-600 text-white h-[30px] w-[50px] rounded-md cursor-pointer z-[1001] select-none "
            >
                Reset
            </button>
        </>
    );
}
