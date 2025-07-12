document.getElementById('calculate').addEventListener('click', async () => {
  const num1 = document.getElementById('num1').value;
  const num2 = document.getElementById('num2').value;
  const operation = document.getElementById('operation').value;
  const resultDiv = document.getElementById('result');

  // Game-like sound effects (optional)
  const playSound = (type) => {
    if (typeof Audio !== 'undefined') {
      const sounds = {
        start: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
        success: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
        error: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'
      };
      const audio = new Audio(sounds[type]);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio playback prevented:', e));
    }
  };

  // Battle animation
  resultDiv.textContent = '⚔️ BATTLE IN PROGRESS... ⚔️';
  resultDiv.style.color = 'var(--accent)';
  playSound('start');

  try {
    const response = await fetch('/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num1, num2, operation }),
    });

    const data = await response.json();

    if (response.ok) {
      resultDiv.innerHTML = `VICTORY!<br><span style="font-size:2rem">${data.result}</span>`;
      resultDiv.style.color = 'var(--secondary)';
      playSound('success');
      
      // Epic win effects
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
      });
      
      // Add temporary celebration class
      resultDiv.classList.add('celebrate');
      setTimeout(() => resultDiv.classList.remove('celebrate'), 2000);
    } else {
      resultDiv.innerHTML = `DEFEAT!<br>${data.error}`;
      resultDiv.style.color = 'var(--primary)';
      playSound('error');
    }
  } catch (error) {
    resultDiv.textContent = 'CONNECTION FAILED!';
    resultDiv.style.color = 'var(--primary)';
    playSound('error');
    console.error('Error:', error);
  }
});

// Add game-like intro animation
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.calculator-container');
  container.style.opacity = '0';
  container.style.transform = 'scale(0.8) translateY(50px)';
  
  setTimeout(() => {
    container.style.transition = 'all 0.5s ease-out';
    container.style.opacity = '1';
    container.style.transform = 'scale(1) translateY(0)';
  }, 300);
  
  // Add keypress sound to buttons
  const buttons = document.querySelectorAll('button, input, select');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof Audio !== 'undefined') {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio playback prevented:', e));
      }
    });
  });
});