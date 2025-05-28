'use client';

import dynamic from 'next/dynamic';

const SpaceScene = dynamic(() => import('@/components/3DComponents/SpaceScene'), {
    ssr: false,
});

export default function ClientOnlyScene() {
    return <SpaceScene />;
}
