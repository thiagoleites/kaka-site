import { useState, useEffect } from 'react';

export function useAutoZoom() {

    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1600) {
                setZoomLevel(1.3);
            } else {
                setZoomLevel(1.1);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);


    return zoomLevel;

}
