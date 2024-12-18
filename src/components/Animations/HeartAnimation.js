import gsap from 'gsap';

export const playHeartAnimation = (heartRef) => {
    
    return gsap.timeline()
        .to(heartRef.current, {
            scale: 1,
            rotation: -10,
            y: -10,
            duration: 0.2,
            ease: "none"
        })
        .to(heartRef.current, {
            scale: 1.1,
            rotation: -15,
            y: -5,
            duration: 0.1,
            ease: "none"
        })
        .to(heartRef.current, {
            scale: 1.2,
            rotation: -30,
            y: 0,
            duration: 0.1,
            ease: "none"
        })
        .to(heartRef.current, {
            scale: 1,
            rotation: 10,
            y: -10,
            duration: 0.2,
            ease: "none"
        })
        .to(heartRef.current, {
            scale: 1.1,
            rotation: 15,
            y: -5,
            duration: 0.1,
            ease: "none"
        })
        .to(heartRef.current, {
            scale: 1.2,
            rotation: 30,
            y: 0,
            duration: 0.1,
            ease: "none"
        })
        .to(heartRef.current, {
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 0.2,
            ease: "none"
        });
};
