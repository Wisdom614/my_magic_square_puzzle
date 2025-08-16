// Sound effects utility for game interactions
// Note: This is a mock implementation since we don't have actual audio files
// In a real implementation, you would load and play actual audio files

class SoundManager {
  constructor() {
    this.enabled = true;
    this.sounds = new Map();
    this.volume = 0.5;
    
    // Initialize Web Audio API context
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Generate a simple tone using Web Audio API
  generateTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Play sound effects for different game actions
  playPlaceNumber() {
    this.generateTone(800, 0.1, 'square');
  }

  playRemoveNumber() {
    this.generateTone(400, 0.1, 'sawtooth');
  }

  playCorrectPlacement() {
    // Play a pleasant chord
    setTimeout(() => this.generateTone(523, 0.2), 0);   // C
    setTimeout(() => this.generateTone(659, 0.2), 50);  // E
    setTimeout(() => this.generateTone(784, 0.2), 100); // G
  }

  playIncorrectPlacement() {
    // Play a discordant sound
    this.generateTone(200, 0.3, 'sawtooth');
  }

  playHintUsed() {
    // Play ascending notes
    setTimeout(() => this.generateTone(440, 0.1), 0);
    setTimeout(() => this.generateTone(554, 0.1), 100);
    setTimeout(() => this.generateTone(659, 0.1), 200);
  }

  playGameWon() {
    // Play victory fanfare
    const notes = [523, 659, 784, 1047]; // C, E, G, C (octave)
    notes.forEach((note, index) => {
      setTimeout(() => this.generateTone(note, 0.3), index * 150);
    });
  }

  playGameLost() {
    // Play descending sad notes
    setTimeout(() => this.generateTone(440, 0.2), 0);
    setTimeout(() => this.generateTone(370, 0.2), 200);
    setTimeout(() => this.generateTone(294, 0.4), 400);
  }

  playButtonClick() {
    this.generateTone(1000, 0.05, 'square');
  }

  playNewGame() {
    // Play cheerful ascending scale
    const scale = [261, 294, 330, 349, 392, 440, 494, 523]; // C major scale
    scale.forEach((note, index) => {
      setTimeout(() => this.generateTone(note, 0.1), index * 80);
    });
  }

  playLevelChange() {
    // Play two-tone chime
    setTimeout(() => this.generateTone(659, 0.15), 0);
    setTimeout(() => this.generateTone(523, 0.15), 150);
  }

  // Additional visual feedback effects
  createParticleEffect(element, type = 'success') {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const colors = type === 'success' 
      ? ['#10b981', '#34d399', '#6ee7b7'] 
      : ['#ef4444', '#f87171', '#fca5a5'];

    // Create multiple particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
      `;

      document.body.appendChild(particle);

      // Animate particle
      const angle = (i / 8) * Math.PI * 2;
      const velocity = 50 + Math.random() * 50;
      const lifetime = 800 + Math.random() * 400;

      const animation = particle.animate([
        { 
          transform: 'translate(0, 0) scale(1)', 
          opacity: 1 
        },
        { 
          transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, 
          opacity: 0 
        }
      ], {
        duration: lifetime,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      animation.onfinish = () => {
        document.body.removeChild(particle);
      };
    }
  }

  // Screen shake effect
  shakeElement(element, intensity = 10, duration = 300) {
    if (!element) return;

    const originalTransform = element.style.transform || '';
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const currentIntensity = intensity * (1 - progress);
        const x = (Math.random() - 0.5) * currentIntensity;
        const y = (Math.random() - 0.5) * currentIntensity;
        
        element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
        requestAnimationFrame(shake);
      } else {
        element.style.transform = originalTransform;
      }
    };

    shake();
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;