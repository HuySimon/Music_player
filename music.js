const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const activeSong = $('.song');
const playlist = $('.playlist');
const cdInner = $('.cd-inner')

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const app = {
  songs: [
    {
      name: "Cá Lớn (大魚)",
      singer: "Châu Thâm (Zhou Shen)",
      path: "./songs/CaLon-ChauThamZhouShen-5299966.mp3",
      image:
        "./imgs/images.jpg"
    },
    {
      name: "Người theo đuổi ánh sáng (追光者)",
      singer: "Từ Vi",
      path:
        "./songs/Ke Theo Duoi Anh Sang - Huy Vac x Tien N.mp3",
      image:
        "./imgs/wallpaperflare.com_wallpaper (1).jpg"
    },
    {
      name: "Đáp Án Của Bạn (你的答案)",
      singer: "A Nhũng (阿冗)",
      path:
        "./songs/DapAnCuaBan-ANhungRong-6147969.mp3",
      image: "./imgs/A_Nhung.jpg"
    },
    {
      name: "Đáy Biển  (海底)",
      singer: "Nhất Chi Lựu Liên (Yi Zhi Liu Lian)",
      path: "./songs/Day Bien - Nhat Chi Luu Lien.mp3",
      image:
        "./imgs/DayBien.jpg"
    },
    {
      name: "Yến Vô Hiết / 燕无歇",
      singer: "Tưởng Thuyết Nhi (Cher Chiang)",
      path: "./songs/YenVoHiet-TuongTuyetNhiCherChiang-6520166.mp3",
      image:
        "./imgs/YenVoHiet.jpg"
    },
    {
      name: "Sao Trời Biển Rộng (星辰大海)",
      singer: "Hoàng Tiêu Vân (Ghost Huang)",
      path: "./songs/SaoTroiBienRong-HoangTieuVanGhostHuang-6927048.mp3",
      image:
        "./imgs/tải xuống (1).jpg"
    }
  ],
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || {}),
  // setConfig: function(key, value) {
  //   this.config[key] = value;
  //   localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  // },
  // hàm render để thực hiện việc đưa list nhạc lên html 
  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
                <div class="spectrum">
                  <div></div>
                </div>
              </div>
          `
    })
    $('.playlist').innerHTML = htmls.join('');  
  },
  

  defineProperties: function() {
    Object.defineProperty(this, "currentSong",{
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },
  loadCurrentSong: function() {

    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    
  },

  nextSong: function() {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    };
    this.loadCurrentSong();
  },

  preSong: function() {
    this.currentIndex--;
    if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    };
    this.loadCurrentSong();
  },

  randomSong: function() {
    let newIndex;
    do {
          newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex)

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 300)
  },
  // hàm handleEvents thực hiện các sự kiện trên html 
  handleEvents: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý phóng to / thu nhỏ đĩa CD
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // sự kiện kéo lên xuống list nhạc
      const cdNewWidth = cdWidth - scrollTop;

      cd.style.width = cdNewWidth > 0 ?  cdNewWidth + 'px': 0; //tăng giảm width của đĩa cd khi kéo lên xuống list 
      cd.style.opacity = cdNewWidth / cdWidth;// làm mờ dần đĩa cd khi kéo lên xuống list
    }

    //Xử lý click play
    playBtn.onclick = function() {
      if (_this.isPlaying) {
        // _this.isPlaying = false;
        audio.pause();
        // player.classList.remove('playing');
      } else {
        // _this.isPlaying = true;
        audio.play();
        // player.classList.add('playing');
      }
    }

    
    //Xử lý khi song play
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdthumbAnimate.play();
      cdInner.classList.add('active')
      $('.song.active .spectrum').classList.remove('paused')
      $('.song.active .spectrum').classList.add('active')
    }

    //Xử lý song bị pause
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdthumbAnimate.pause();
      cdInner.classList.remove('active')
      $('.song.active .spectrum').classList.remove('active')
      $('.song.active .spectrum').classList.add('paused')
    }

    //Khi tiến độ bài hát thay đổi 
    audio.ontimeupdate = function() {
      if (audio.duration) {
        const progressPercent = audio.currentTime / audio.duration * 100;
        progress.value = progressPercent;
      }      
    }

    //Khi tua song
    progress.onchange = function(e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }

    // Xử lý cd quay / dừng 
    var cdthumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)'}
    ], {
        duration: 10000, // 10 seconds
        iterations: Infinity  // vô hạn
    })
    cdthumbAnimate.pause();
    
    // Click button next song
    nextBtn.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong()
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render()
      _this.scrollToActiveSong()
    }
    // Click button previous song
    preBtn.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong()
      } else {
        _this.preSong();
      }
      audio.play();
      _this.render()
      _this.scrollToActiveSong()
    }

    // Click button random song
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
    }

    // Click button repeat song
    repeatBtn.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }

    // Xử lý khi song chạy hết bài 
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click() //Tự động click next Btn thay cho user
      }
    }

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');

      if(songNode || e.target.closest('.option') ) {
        if (songNode) { 
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          audio.play()
          _this.render()
        }
      }
    } 

  },  
  start: function() {
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //Lắng nghe / xử lý các sự kiện (DOM Events)
    this.handleEvents();

    //Tải thông tin bài hát đầu tiên 
    this.loadCurrentSong();

    //Render playlist 
    this.render();
  },
}  

app.start();
