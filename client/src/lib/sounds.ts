// Emotional Audio Journey
export const sounds = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft pop
  gentle_arrival: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Soft magic for intro
  emotional_swell: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Emotional chime for message
  tension_build: 'https://assets.mixkit.co/active_storage/sfx/2387/2387-preview.mp3', // Heartbeat for "One question..."
  proposal_spark: 'https://assets.mixkit.co/active_storage/sfx/1344/1344-preview.mp3', // Bright bell for the ring reveal
  triumphant_love: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Harp/Celestial for the "Yes"
};

const audioCache: Record<string, HTMLAudioElement> = {};

export const playSound = (soundKey: keyof typeof sounds, volume = 0.5) => {
  try {
    if (!audioCache[soundKey]) {
      audioCache[soundKey] = new Audio(sounds[soundKey]);
    }
    const audio = audioCache[soundKey];
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(e => console.warn('Audio play blocked:', e));
  } catch (err) {
    console.error('Error playing sound:', err);
  }
};
