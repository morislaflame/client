import gsap from 'gsap';

export const MenuAnimation = () => {
    gsap.fromTo('#userinfo', {
        x: 25,
    }, {
        x: 0,
        duration: 0.6,
        ease: 'back.inOut'
    });
    gsap.fromTo('#links_container', {
        x: 25,
    }, {
        x: 0,
        duration: 0.6,
        ease: 'back.inOut'
    });
    gsap.fromTo('#logout_button', {
        x: 25,
    }, {
        x: 0,
        duration: 0.5,
        ease: 'back.inOut'
    });
};