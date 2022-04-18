const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('.header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
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
            name: 'Có Hẹn Với Thanh Xuân',
            singer: 'Monstar',
            path: './assets/audio/CoHenVoiThanhXuan.mp3',
            image: './assets/img/CoHenVoiThanhXuan.png'
        },
        {
            name: 'Tình Ca Tình Ta',
            singer: 'Kis',
            path: './assets/audio/TinhCaTinhTa.mp3',
            image: './assets/img/TinhCaTinhTa.jpg'
        },
        {
            name: 'Anh Sẽ Đón Em',
            singer: 'Nguyên, Trang',
            path: './assets/audio/AnhSeDonEm.mp3',
            image: './assets/img/AnhSeDonEm.jpg'
        },
        {
            name: 'Độ Tộc 2',
            singer: 'Masew, Độ Mixi, Phúc Du, V.A',
            path: './assets/audio/DoToc2.mp3',
            image: './assets/img/DoToc2.jpg'
        },
        {
            name: 'Stream Đến Bao Giờ',
            singer: 'Độ Mixi ft. Bạn Sáng Tác',
            path: './assets/audio/StreamDenBaoGio.mp3',
            image: './assets/img/StreamDenBaoGio.jpg'
        },
        {
            name: 'Mang Tiền Về Cho Mẹ',
            singer: 'Đen, Nguyên Thảo',
            path: './assets/audio/MangTienVeChoMe.mp3',
            image: './assets/img/MangTienVeChoMe.jpg'
        },
        {
            name: 'I Love You 3000',
            singer: 'Stephanie Poetri',
            path: './assets/audio/ILoveYou3000.mp3',
            image: './assets/img/ILoveYou3000.jpg'
        },
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker',
            path: './assets/audio/Comethru.mp3',
            image: './assets/img/Comethru.jpg'
        },
        {
            name: 'Death Bed',
            singer: 'Powfu',
            path: './assets/audio/DeathBed.mp3',
            image: './assets/img/DeathBed.jpg'
        },
        {
            name: 'Monsters',
            singer: 'Katie Sky',
            path: './assets/audio/Monsters.mp3',
            image: './assets/img/Monsters.jpg'
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url(${song.image})"></div>
                    <div class="song-body">
                        <div class="title">${song.name}</div>
                        <div class="author">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimete = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimete.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrolllTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrolllTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi phát bài hát
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimete.play()
        }

        // Khi tạm dừng bài hát
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimete.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPrecent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPrecent
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandom()
            } else {
                app.prev()
            }
            audio.play()
            app.render()
            app.scrollToAcctiveSong()
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandom()
            } else {
            app.next()
            }
            audio.play()
            app.render()
            app.scrollToAcctiveSong()
        }


        // Khi repeat bài hát
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // Khi radom bài hát
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // Xử lý next bài hát khi audio ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || !e.target.closest('.option')) {
                // XỬ lý khi click vào song
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }

                // Xử lý click vào song option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToAcctiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    prev: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    next: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    playRandom: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}
app.start()