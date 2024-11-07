// MouseTrail.js
import React, { useEffect, useRef } from 'react';
import './MouseTrail.css'; // Import CSS for styling the effect

function MouseTrail() {
    const trailRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (trailRef.current) {
                // Adjust the offset to center the trail on the cursor
                trailRef.current.style.transform = `translate(${e.pageX - 50}px, ${e.pageY - 50}px)`;
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        
        // Clean up event listener on component unmount
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return <div className="mouse-trail" ref={trailRef}></div>;
}

export default MouseTrail;
