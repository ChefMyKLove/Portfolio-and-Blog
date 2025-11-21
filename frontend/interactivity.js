document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // WEATHER WIDGET – GLOBAL + FIXED RANDOM + CLEAR INPUT
  // ========================
  const WeatherWidget = {
    apiKey: '0e43eedf4557a8a6f0cd4a4a91d43751',
    limit: 7,

    init() {
      const weatherInfo = document.getElementById('weather-info');
      const geolocationBtn = document.getElementById('geolocation-btn');
      const cityInput = document.getElementById('city-input');
      const randomCityBtn = document.getElementById('random-city-btn');

      weatherInfo.innerHTML = '<p>Loading weather...</p>';
      this.getWeatherByGeolocation();

      geolocationBtn.addEventListener('click', () => {
        weatherInfo.innerHTML = '<p>Getting your location...</p>';
        this.getWeatherByGeolocation();
      });

      randomCityBtn.addEventListener('click', () => {
        weatherInfo.innerHTML = '<p>Finding a random city...</p>';
        this.getRandomCity();
      });

      // Clear input when user starts typing
      cityInput.addEventListener('focus', () => {
        cityInput.select();
      });

      // Autocomplete with debounce
      let debounceTimer;
      cityInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => this.showAutocomplete(cityInput.value.trim()), 300);
      });

      cityInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.getWeatherByCityName(cityInput.value.trim());
          this.clearAutocomplete();
        }
      });
    },

    async getWeatherByGeolocation() {
      if (!navigator.geolocation) {
        document.getElementById('weather-info').innerHTML = '<p>Geolocation not supported.</p>';
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await this.fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          document.getElementById('weather-info').innerHTML = '<p>Location denied. Type a city!</p>';
        }
      );
    },

    // FIXED: Uses API to get truly random cities from around the world
    async getRandomCity() {
      const randomQueries = [
        'london', 'paris', 'tokyo', 'new york', 'sydney', 'moscow', 'cairo', 
        'beijing', 'mumbai', 'dubai', 'singapore', 'rome', 'madrid', 'berlin',
        'bangkok', 'istanbul', 'toronto', 'mexico city', 'rio', 'seoul',
        'jakarta', 'delhi', 'manila', 'shanghai', 'karachi', 'buenos aires',
        'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'barcelona',
        'munich', 'amsterdam', 'stockholm', 'oslo', 'copenhagen', 'helsinki',
        'vienna', 'prague', 'budapest', 'warsaw', 'athens', 'lisbon', 'dublin'
      ];

      const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      
      try {
        const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(randomQuery)}&limit=5&appid=${this.apiKey}`);
        const places = await geo.json();
        
        if (!places.length) {
          document.getElementById('weather-info').innerHTML = '<p>Could not find random city.</p>';
          return;
        }
        
        // Pick a random result from the returned cities
        const randomPlace = places[Math.floor(Math.random() * places.length)];
        const { lat, lon, name, country, state } = randomPlace;
        const displayName = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
        
        document.getElementById('city-input').value = displayName;
        await this.fetchWeatherByCoords(lat, lon);
      } catch {
        document.getElementById('weather-info').innerHTML = '<p>Error finding random city.</p>';
      }
    },

    async getWeatherByCityName(query) {
      if (!query) {
        document.getElementById('weather-info').innerHTML = '<p>Please enter a city.</p>';
        return;
      }

      try {
        const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`);
        const places = await geo.json();
        if (!places.length) {
          document.getElementById('weather-info').innerHTML = '<p>City not found.</p>';
          return;
        }
        const { lat, lon, name, country, state } = places[0];
        const displayName = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
        document.getElementById('city-input').value = displayName;
        await this.fetchWeatherByCoords(lat, lon);
      } catch {
        document.getElementById('weather-info').innerHTML = '<p>Error searching city.</p>';
      }
    },

    async fetchWeatherByCoords(lat, lon) {
      const weatherInfo = document.getElementById('weather-info');
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`);
        const data = await res.json();
        if (data.cod !== 200) throw new Error(data.message);

        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherInfo.innerHTML = `
          <p><strong>${data.name}, ${data.sys.country}</strong></p>
          <img src="${icon}" alt="${data.weather[0].description}" style="width:80px;">
          <p>${Math.round(data.main.temp)}°C — ${data.weather[0].description}</p>
          <p>Feels like ${Math.round(data.main.feels_like)}°C • Humidity ${data.main.humidity}%</p>
        `;
      } catch (err) {
        weatherInfo.innerHTML = `<p>Error: ${err.message}</p>`;
      }
    },

    async showAutocomplete(query) {
      if (query.length < 2) {
        this.clearAutocomplete();
        return;
      }

      let dropdown = document.querySelector('.autocomplete-suggestions');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-suggestions';
        document.getElementById('city-input').parentNode.appendChild(dropdown);
      }

      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${this.limit}&appid=${this.apiKey}`);
        const places = await res.json();

        dropdown.innerHTML = '';
        if (!places.length) {
          dropdown.style.display = 'none';
          return;
        }

        dropdown.style.display = 'block';
        places.forEach(place => {
          const item = document.createElement('div');
          item.className = 'autocomplete-suggestion';
          item.textContent = place.state
            ? `${place.name}, ${place.state}, ${place.country}`
            : `${place.name}, ${place.country}`;
          item.onclick = () => {
            document.getElementById('city-input').value = item.textContent;
            this.fetchWeatherByCoords(place.lat, place.lon);
            this.clearAutocomplete();
          };
          dropdown.appendChild(item);
        });
      } catch (e) {
        console.error('Autocomplete error:', e);
      }
    },

    clearAutocomplete() {
      const dropdown = document.querySelector('.autocomplete-suggestions');
      if (dropdown) dropdown.style.display = 'none';
    }
  };

  // ========================
  // MUSIC PLAYER (unchanged – perfect)
  // ========================
  const MusicPlayer = {
    widget: null,
    playlistUrl: 'https://soundcloud.com/chef-myklove-839927429/sets/chefmyklove',
    tracks: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffled: false,
    shuffledIndices: [],

    init() {
      const tag = document.createElement('script');
      tag.src = 'https://w.soundcloud.com/player/api.js';
      tag.async = true;
      document.body.appendChild(tag);
      tag.onload = () => this.createPlayer();
      this.setupControls();
    },

    createPlayer() {
      const container = document.getElementById('soundcloud-player');
      const iframe = document.createElement('iframe');
      iframe.id = 'sc-widget';
      iframe.width = '100%';
      iframe.height = '166';
      iframe.scrolling = 'no';
      iframe.frameBorder = 'no';
      iframe.allow = 'autoplay';
      iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(this.playlistUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;

      container.innerHTML = '';
      container.appendChild(iframe);

      this.widget = SC.Widget(iframe);
      this.widget.bind(SC.Widget.Events.READY, () => this.onPlayerReady());
      this.widget.setVolume(50);
    },

    setupControls() {
      document.getElementById('play-pause-btn')?.addEventListener('click', () => this.togglePlayPause());
      document.getElementById('prev-btn')?.addEventListener('click', () => this.previousVideo());
      document.getElementById('next-btn')?.addEventListener('click', () => this.nextVideo());
      document.getElementById('shuffle-btn')?.addEventListener('click', () => this.toggleShuffle());
    },

    togglePlayPause() { this.widget?.isPaused(p => p ? this.widget.play() : this.widget.pause()); },
    previousVideo() { if (this.tracks.length) { this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length; this.widget.skip(this.isShuffled ? this.shuffledIndices[this.currentIndex] : this.currentIndex); this.widget.play(); } },
    nextVideo() { if (this.tracks.length) { this.currentIndex = (this.currentIndex + 1) % this.tracks.length; this.widget.skip(this.isShuffled ? this.shuffledIndices[this.currentIndex] : this.currentIndex); this.widget.play(); } },

    toggleShuffle() {
      if (!this.tracks.length) return;
      this.isShuffled = !this.isShuffled;
      const btn = document.getElementById('shuffle-btn');
      if (this.isShuffled) {
        this.shuffledIndices = [...Array(this.tracks.length).keys()].sort(() => Math.random() - 0.5);
        btn.style.background = 'rgba(102, 126, 234, 0.6)';
        btn.textContent = 'Shuffled';
      } else {
        this.shuffledIndices = [...Array(this.tracks.length).keys()];
        btn.style.background = '';
        btn.textContent = 'Shuffle';
      }
      this.currentIndex = 0;
    },

    updateCurrentTrack() {
      this.widget?.getCurrentSound(s => {
        if (s) {
          document.getElementById('current-track').textContent = s.title || 'Unknown';
          this.updateAlbumCover(s);
        }
      });
    },

    updateAlbumCover(s) {
      const img = document.getElementById('album-cover');
      if (s?.artwork_url) {
        img.src = s.artwork_url.replace('-large', '-t500x500');
      } else {
        img.src = 'https://i1.sndcdn.com/artworks-000282245234-1x1p5k-t500x500.jpg';
      }
      img.style.display = 'block';
    },

    updatePlayPauseButton() {
      const btn = document.getElementById('play-pause-btn');
      if (btn) btn.textContent = this.isPlaying ? 'Pause' : 'Play';
    },

    onPlayerReady() {
      this.widget.getSounds(s => {
        this.tracks = s;
        this.shuffledIndices = this.tracks.map((_, i) => i);
        document.getElementById('current-track').textContent = s.length ? 'Ready — Click Play' : 'Lofi Girl • 24/7 Live Radio';
        this.widget.getCurrentSound(s => this.updateAlbumCover(s));
      });

      this.widget.bind(SC.Widget.Events.PLAY, () => { this.isPlaying = true; this.updatePlayPauseButton(); this.updateCurrentTrack(); });
      this.widget.bind(SC.Widget.Events.PAUSE, () => { this.isPlaying = false; this.updatePlayPauseButton(); });
      this.widget.bind(SC.Widget.Events.FINISH, () => this.nextVideo());
    }
  };

  // ========================
  // CAROUSEL, ART CAROUSEL, EMAIL MODAL (unchanged)
  // ========================
  const Carousel = {
    init() {
      const carousel = document.querySelector('.carousel');
      const pauseBtn = document.getElementById('pause-carousel');
      const reverseBtn = document.getElementById('reverse-carousel');
      let paused = false, reversed = false;

      pauseBtn.addEventListener('click', () => {
        paused = !paused;
        carousel.style.animationPlayState = paused ? 'paused' : 'running';
        pauseBtn.textContent = paused ? 'Resume' : 'Pause';
      });

      reverseBtn.addEventListener('click', () => {
        reversed = !reversed;
        carousel.style.animationDirection = reversed ? 'reverse' : 'normal';
        reverseBtn.textContent = reversed ? 'Forward' : 'Reverse';
      });
    }
  };

  const ArtCarousel = {
    init() {
      const images = ['/Portfolio Assignment (nojs)/images/IMG_6795.JPEG','/Portfolio Assignment (nojs)/images/IMG_6797.JPEG','/Portfolio Assignment (nojs)/images/IMG_6910.JPEG'];
      const inner = document.getElementById('art-carousel-inner');
      let idx = 0;

      images.forEach(src => {
        const div = document.createElement('div');
        div.className = 'art-carousel-item';
        div.innerHTML = `<img src="${src}" alt="Art piece">`;
        inner.appendChild(div);
      });

      document.getElementById('art-carousel-prev').addEventListener('click', () => {
        if (idx > 0) { idx--; inner.style.transform = `translateX(-${idx * 33.33}%)`; }
      });

      document.getElementById('art-carousel-next').addEventListener('click', () => {
        if (idx < images.length - 3) { idx++; inner.style.transform = `translateX(-${idx * 33.33}%)`; }
      });
    }
  };

  const EmailModal = {
    init() {
      const btn = document.getElementById('email-btn');
      const modal = document.getElementById('email-modal');
      const close = document.getElementById('close-modal');
      const form = document.getElementById('email-form');

      btn?.addEventListener('click', e => { e.preventDefault(); modal.style.display = 'flex'; });
      close?.addEventListener('click', () => modal.style.display = 'none');
      window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

      form?.addEventListener('submit', async e => {
        e.preventDefault();
        const email = form.querySelector('[name=email]').value.trim();
        const topic = form.querySelector('[name=topic]').value;
        const message = form.querySelector('[name=message]').value.trim();

        if (!email || !topic || !message || !/^\S+@\S+\.\S+$/.test(email)) {
          document.getElementById('form-error').style.display = 'block';
          return;
        }
        document.getElementById('form-error').style.display = 'none';

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
          const resp = await fetch('https://submit-form.com/1JnzAL7ST', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, topic, message, _replyto: email })
          });
          if (resp.ok) {
            alert('Message sent! I\'ll reply soon.');
            modal.style.display = 'none';
            form.reset();
          } else throw new Error();
        } catch {
          alert('Error. Email me directly: chefmyklove@gmail.com');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send';
        }
      });
    }
  };

  // ===== MEMBERS-ONLY BLOG MODAL (safe to drop into existing project) =====
  (() => {
    // Bail if the elements don't exist yet (in case this script loads before the HTML)
    const openBtn = document.getElementById('openBlogModal');
    if (!openBtn) return;

    const modal = document.getElementById('blogModal');
    const closeBtn = modal.querySelector('.close');
    const loginBtn = document.getElementById('patreonLoginBtn');

    // Open
    openBtn.addEventListener('click', () => modal.style.display = 'flex');

    // Close with ×
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');

    // Login with Patreon
    loginBtn?.addEventListener('click', () => {
      // Redirect to backend auth endpoint (will redirect to /blog/blook.html after login)
      window.location.href = 'http://localhost:3002/auth/patreon';
    });

    // Close when clicking backdrop
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    });
  })();

  // ========================
  // INITIALIZE
  // ========================
  WeatherWidget.init();
  MusicPlayer.init();
  Carousel.init();
  ArtCarousel.init();
  EmailModal.init();
});