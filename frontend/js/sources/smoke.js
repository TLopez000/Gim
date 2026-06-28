document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 🌟 Forzamos el tamaño real de la ventana del navegador ignorando el CSS
    function resizeCanvas() {
        canvas.width = window.innerWidth || document.documentElement.clientWidth;
        canvas.height = window.innerHeight || document.documentElement.clientHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Ejecutamos la medición inicial

    const particles = [];
    // Subimos la cantidad a 60 y aumentamos el tamaño para asegurarnos de que inunden la pantalla
    const particleCount = 60; 

    class Particle {
        constructor() { this.reset(); }
        reset() {
           this.x = Math.random() * canvas.width;
           this.y = canvas.height + Math.random() * 100;
    
           // 🌟 Nubes de humo mucho más grandes para cubrir más espacio
           this.size = Math.random() * 180 + 120; 
    
           this.speedX = Math.random() * 0.4 - 0.2;
           this.speedY = -(Math.random() * 0.5 + 0.2); // Un viaje más lento para que parezca humo denso
    
           // 🌟 SUBIMOS LA OPACIDAD: Multiplicamos la visibilidad base para que tenga más cuerpo
           this.alpha = Math.random() * 0.25 + 0.15; 
    
          // Se disipa un poco más lento para que aguante el viaje hacia arriba
          this.decay = Math.random() * 0.0004 + 0.0001; 
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= this.decay;
            if (this.alpha <= 0 || this.y < -this.size) this.reset();
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            
            let gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            
            // Subimos un pelín los tonos grises del humo para ganarle al fondo #121212
            gradient.addColorStop(0, `rgba(180, 180, 180, ${this.alpha})`);
            gradient.addColorStop(0.5, `rgba(120, 120, 120, ${this.alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // El resto del script sigue igual...
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
});