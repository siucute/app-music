/*
1. Render song
2. Scroll Top
3. Play / Pause / Seek
4. CD rorate
5. Next / Prev
6. Random
7. Repeat khi end
8. Active song
9. play khi click list

*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevtBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Rồi Tới Luôn',
            singer: 'Nal',
            path: './access/music/song1.mp3',
            image: './access/image/song1.png'
        },
        {
            name: 'Muốn Được Cùng Em',
            singer: 'FreaKy x CM1X',
            path: './access/music/song6.mp3',
            image: './access/image/song6.png'
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masew x Bray x Tab',
            path: './access/music/song3.mp3',
            image: './access/image/song3.png'
        },
        {
            name: 'Mỡ mỡ đáng yêu',
            singer: 'DatKaa',
            path: './access/music/song8.mp3',
            image: './access/image/song8.jpg'
        },
        {
            name: 'Cô Đơn Dành Cho Ai',
            singer: 'Lee Ken x Nal',
            path: './access/music/song2.mp3',
            image: './access/image/song2.png'
        },
        {
            name: 'Hạ Còn Vương Nắng',
            singer: 'DatKaa x Kido',
            path: './access/music/song4.mp3',
            image: './access/image/song4.png'
        },
        {
            name: 'STAY',
            singer: 'JustinBieber x The Kid LAROI',
            path: './access/music/song5.mp3',
            image: './access/image/song5.png'
        },
        {
            name: 'Trời ơi con chưa ...',
            singer: 'Đen vâu',
            path: './access/music/song7.mp3',
            image: './access/image/song7.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class=" fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        });
    },
    handlerEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        // Xu ly CD quay/ pause
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Phong to/ thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop 
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xu ly khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()     
            }
        }
        // khi song duoc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // Tien do bai hat
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Xu ly khi tua 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next 
        nextBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }
        // khi prev 
        prevtBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }
        // Random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // phat lai song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Xu ly next khi audio end
        audio.onended = function() {
            if (_this.isRepeat){
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')){
                // click vao song
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // click option
                if(e.target.closest('.option')){

                }

            }
        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    scrollToActive: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    }, 
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0 ){
            this.currentIndex =  this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        // Định nghĩa các thuộc tính của Object 
        this.defineProperties()
        //Lắng nghe  và xử lý sự kiện
        this.handlerEvent()
        // load thông tin bài hát đầu tiên
        this.loadCurrentSong()
        // render playlist
        this.render()
        
    }
}
app.start();

// 1:07:34