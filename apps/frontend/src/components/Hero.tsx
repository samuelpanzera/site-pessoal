import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update(w: number, h: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w) this.x = 0;
        else if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0;
        else if (this.y < 0) this.y = h;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(221, 183, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid-like background
      ctx.strokeStyle = 'rgba(75, 0, 130, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(221, 183, 255, 0.1)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center px-6 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            System Status: Operational
          </div>
          <h1 className="text-7xl font-space-grotesk font-bold tracking-tight leading-[0.9]">
            Architecting <br />
            <span className="text-primary">Reliable</span> Backends
          </h1>
          <p className="max-w-xl text-lg text-on-surface-variant leading-relaxed">
            Back-end Developer with a passion for high-performance systems and 
            distributed architectures. Crafting the invisible infrastructure 
            that powers the modern web.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-8 py-4 rounded-md bg-primary text-on-primary font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(221,183,255,0.3)]">
              View Projects
            </button>
            <button className="px-8 py-4 rounded-md border border-white/10 hover:border-white/20 transition-all">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
