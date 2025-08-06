// Ambil nama dari URL
const params = new URLSearchParams(window.location.search);
const guestName = params.get('to') || 'Tamu Undangan';
if (guestName) {
    const formattedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    document.querySelector('#cover p').innerHTML = `Kepada Yth. Bapak/Ibu/Saudara/i<br><strong>${formattedName}</strong>`;
}

// Scroll Animation
let animatedElements = [];
let animateScale = [];

function updateAnimatedElements() {
    animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => el.classList.remove('show'));

    animateScale = document.querySelectorAll('.animate-scale');
    animateScale.forEach(el => el.classList.remove('show'));
}

function handleScrollAnimation() {
    const triggerBottom = window.innerHeight * 0.85;

    animatedElements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
        el.classList.add('show');
        } else {
        el.classList.remove('show');
        }
    });

    animateScale.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            el.classList.add('show');
        } else {
            el.classList.remove('show');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimation);

// Open Undangan
document.getElementById('openBtn').addEventListener('click', function () {
    // Pause music saat user pindah tab
    document.addEventListener('visibilitychange', function () {
        const bgMusic = document.getElementById('bgMusic');
        if (document.hidden) {
            bgMusic.pause();
        } else {
            bgMusic.play(); // (opsional) bisa dihapus kalau gak mau auto-play lagi saat balik
        }
    });

    // Pause musik saat halaman ditutup
    window.addEventListener('beforeunload', function () {
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.pause();
    });

    document.getElementById('cover').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('cover').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('bgMusic').play();
        document.getElementById('bgVideo').play();

        updateAnimatedElements();
        handleScrollAnimation();
    }, 1000);
});

// Music 
const audio = document.getElementById("bgMusic");
const btn = document.getElementById("musicBtn");

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        btn.innerHTML = `<i class="fa fa-play"></i>`;
    } else {
        audio.pause();
        btn.innerHTML = `<i class="fa fa-pause"></i>`;
    }
}

//Gift Card
const dataGift = [
    {
        "namaBank": "Mandiri",
        "nomor": "Nomor Rekening",
        "penerima": "Nama Penerima",
        "img": 'https://github.com/Zarriq22/assset-azra-wedding/blob/main/images/bank-mandiri.png?raw=true'
    },
    {
        "namaBank": "BCA",
        "nomor": "Nomor Rekening",
        "penerima": "Nama Penerima",
        "img": 'https://github.com/Zarriq22/assset-azra-wedding/blob/main/images/bank-bca.png?raw=true'
    },
    {
        "namaBank": "BSI",
        "nomor": "Nomor Rekening",
        "penerima": "Nama Penerima",
        "img": 'https://github.com/Zarriq22/assset-azra-wedding/blob/main/images/bank-bsi.png?raw=true'
    }
];

const container = document.getElementById('giftContainer');

dataGift.forEach((gift, index) => {
    const html = `
        <div class="scroll-animate">
            <div class="gift-content">
                <img src="https://raw.githubusercontent.com/Zarriq22/assset-azra-wedding/refs/heads/main/images/card-atm.webp" alt="Gift" class="gift-image" />
                <img src="https://raw.githubusercontent.com/Zarriq22/assset-azra-wedding/refs/heads/main/images/chip-atm.webp" alt="Chip" class="gift-chip" />
                <div class="gift-info">
                    <h4>Bank ${gift.namaBank}</h4>
                    <img src="${gift.img}" alt="${gift.namaBank}" class="gift-atm">
                </div>
                <div class="gift-detail">
                    <div>
                        <h2 id="copyText-${index}">${gift.nomor}</h2>
                        <button onclick="copyToClipboard('${gift.nomor}')">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                    <span>An. ${gift.penerima}</span>
                </div>
            </div>
        </div>
    `;
    container.innerHTML += html;
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
}

document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';

    const rsvpForm = document.getElementById('hasil');

    e.preventDefault();

    const name = document.getElementById('name').value;
    const jumlahOrang = document.getElementById('jumlah').value;
    const status = document.getElementById('kehadiran').value;
    const message = document.getElementById('pesan').value;

    const url = `https://script.google.com/macros/s/AKfycbwfGnXzkMj9US_JmuRRXDkYXXNUDOYdLMlDAo4uMVVfKLGbbiKgJVHjGN351LtFdRlv0Q/exec?name=${encodeURIComponent(name)}&jumlah=${encodeURIComponent(jumlahOrang)}&status=${encodeURIComponent(status)}&message=${encodeURIComponent(message)}`;
    

    fetch(url, {
        method: "GET",
        mode: "no-cors"
    })
    .then(() => {
        // Tampilkan pesan sukses di elemen #rsvpMessage
        const msgEl = document.getElementById('rsvpMessage');
        msgEl.textContent = "✅ Ucapan berhasil dikirim. Terima kasih!";
        msgEl.style.color = "green";

        setTimeout(() => {
            msgEl.textContent = "";
        }, 3000);

        loadingScreen.style.display = 'none';
        e.target.reset();
        loadRSVPData();
    })
    .catch(err => {
        alert("Gagal kirim: " + err.message);
    });
});

// RSVP
let allRsvpData = [];
let currentPage = 1;
const pageSize = 10;

function getInitials(nama) {
    if (!nama) return "";
    return nama
        .trim()
        .split(/\s+/)
        .map(k => k[0].toUpperCase())
        .join("");
}

function renderRSVPPage(data, page) {
    const rsvpForm = document.getElementById('hasil');
    rsvpForm.innerHTML = "";

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = data.slice(start, end);

    pageData.forEach((rsvp, index) => {
        if (!rsvp.nama || !rsvp.Ucapan) {
            const html = `
                <div class="rsvp-item">
                    <div class="rsvp-content">
                        <div class="empty-comment">
                            <div class="empty-content">
                                <p>Belum ada ucapan</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            rsvpForm.innerHTML += html;
        } else {
            const initials = getInitials(rsvp.Nama);
            const html = `
                <div class="rsvp-item">
                    <div class="badge-name" style="background-color: #${Math.floor(Math.random() * 16777215).toString(16)}; color: #${Math.floor(Math.random() * 16777215).toString(16)}">
                        <span>${initials}</span>
                    </div>
                    <div class="rsvp-content">
                        <span id="rsvp-${start + index}" class="namaPengirim">${rsvp.Nama} <i class="${rsvp.Status === "Hadir" ? "fas fa-check" : "fas fa-times"}"></i></span>
                        <span id="rsvp-${start + index}" class="pesanPengirim">${rsvp.Ucapan}</span>
                    </div>
                </div>
            `;
            rsvpForm.innerHTML += html;
        }
    });

    renderPaginationControls(data.length, page);
}

function renderPaginationControls(totalItems, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalItems / pageSize);
    pagination.innerHTML = '';

    // if (totalPages <= 0) return;

    if (currentPage > 1) {
        pagination.innerHTML += `<button onclick="goToPage(${currentPage - 1})"><i class="fa fa-arrow-left"></i></button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<button onclick="goToPage(${i})" ${i === currentPage ? 'style="font-weight:bold;"' : ''}>${i}</button>`;
    }

    if (currentPage < totalPages) {
        pagination.innerHTML += `<button onclick="goToPage(${currentPage + 1})"><i class="fa fa-arrow-right"></i></button>`;
    }
}

function goToPage(page) {
    currentPage = page;
    renderRSVPPage(allRsvpData, currentPage);
}

function loadRSVPData() {
    const jumlahUcapan = document.getElementById('jumlahUcapan');
    jumlahUcapan.innerHTML = 0;

    const sheetDataHandler = (sheetData) => {
        allRsvpData = sheetData;
        jumlahUcapan.innerHTML = !sheetData[0].nama || !sheetData[0].Ucapan ? 0 : sheetData.length;
        renderRSVPPage(allRsvpData, currentPage);
    };

    getSheetData({
        sheetID: "1SBY8gyLY4bW09OEW-idpEprVD2yTK7MnkeHgbq-mjjU",
        sheetName: "Daftar Hadir",
        query: "SELECT *",
        callback: sheetDataHandler,
    });
}

// Countdown
const countdown = document.getElementById("countdown");
const weddingDate = new Date("2026-01-17T08:00:00").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance <= 0) {
        countdown.innerHTML = "<p>Hari Bahagia Telah Tiba!</p>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdown.innerHTML = `<p>${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik</p>`;
    countdown.innerHTML = 
        `
        <div class="bg-badge-time">
            <div class="badge-time">
                <span>${days}</span>
                <span>Hari</span>
            </div>
        </div>
        <div class="bg-badge-time">
            <div class="badge-time">
                <span>${hours}</span>
                <span>Jam</span>
            </div>
        </div>
        <div class="bg-badge-time">
            <div class="badge-time">
                <span>${minutes}</span>
                <span>Menit</span>
            </div>
        </div>
        <div class="bg-badge-time">
            <div class="badge-time">
                <span>${seconds}</span>
                <span>Detik</span>
            </div>
        </div>
    `;
}

setInterval(updateCountdown, 1000);
updateCountdown();

window.onload = function () {
    loadRSVPData();
};