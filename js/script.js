// ==========================================================
// 1. ЛОГИКА НАВИГАЦИИ (МОБИЛЬНОЕ МЕНЮ)
// ==========================================================
let menuBtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

if (menuBtn && navbar) {
    menuBtn.onclick = () => {
        menuBtn.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };
    window.onscroll = () => {
        menuBtn.classList.remove('fa-times');
        navbar.classList.remove('active');
    };
}

// ==========================================================
// 2. СМЕНА КАРТИНОК НА ГЛАВНОЙ СТРАНИЦЕ
// ==========================================================
const imageSliders = document.querySelectorAll('.image-slider img');
const mainImage = document.querySelector('.main-home-image');

if (imageSliders.length > 0 && mainImage) {
    imageSliders.forEach(images => {
        images.onclick = () => {
            mainImage.src = images.getAttribute('src');
        };
    });
}

// ==========================================================
// 3. КАРУСЕЛЬ ОТЗЫВОВ (SWIPER)
// ==========================================================
const reviewSlider = document.querySelector('.review-slider');
if (reviewSlider && typeof Swiper !== 'undefined') {
    var swiper = new Swiper(".review-slider", {
        spaceBetween: 20,
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        grabCursor: true,
        autoplay: { delay: 7500, disableOnInteraction: false },
        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 }
        },
    });
}

// ==========================================================
// 4. АНИМАЦИЯ ЗАГРУЗКИ (PRELOADER) И ПЕРЕХОДЫ
// ==========================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.classList.add('fade-out'); }, 300); 
    }
});

const allLinks = document.querySelectorAll('a');
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetUrl = this.getAttribute('href');
        if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('#') && !targetUrl.startsWith('javascript')) {
            e.preventDefault(); 
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.remove('fade-out'); 
                setTimeout(() => { window.location.href = this.href; }, 500);
            } else {
                window.location.href = this.href;
            }
        }
    });
});

// ==========================================================
// 5. ЛОГИКА ДОБАВЛЕНИЯ НОВЫХ ОТЗЫВОВ
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-review');
    const clearBtn = document.getElementById('clear-reviews-btn');
    const swiperWrapper = document.querySelector('.review-slider .swiper-wrapper');
    const sliderEl = document.querySelector('.review-slider');
    const stars = document.querySelectorAll('.star-btn');
    let currentRating = 5; 

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = this.getAttribute('data-value');
                updateStars(currentRating);
            });
        });
    }

    function updateStars(rating) {
        stars.forEach(star => {
            if (star.getAttribute('data-value') <= rating) {
                star.classList.remove('far'); 
                star.classList.add('fas');    
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    function loadReviews() {
        let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
        reviews.reverse().forEach(rev => {
            if (sliderEl && sliderEl.swiper) {
                sliderEl.swiper.prependSlide(rev);
            } else if (swiperWrapper) {
                swiperWrapper.insertAdjacentHTML('afterbegin', rev);
            }
        });
        if (sliderEl && sliderEl.swiper) {
            sliderEl.swiper.update();
        }
    }

    if (sliderEl || swiperWrapper) {
        setTimeout(loadReviews, 500);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('reviewer-name');
            const textInput = document.getElementById('reviewer-text');
            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (name === "" || text === "") {
                alert("Please fill in all fields!");
                return;
            }

            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= currentRating) {
                    starsHTML += '<i class="fas fa-star"></i>'; 
                } else {
                    starsHTML += '<i class="far fa-star"></i>'; 
                }
            }

            const reviewHTML = `
                <div class="swiper-slide box">
                    <i class="fas fa-quote-left"></i><i class="fas fa-quote-right"></i>
                    <img src="image/Pix.png" alt="User">
                    <div class="stars">${starsHTML}</div>
                    <p>${text}</p>
                    <h3>${name}</h3><span>new client</span>
                </div>
            `;

            if (sliderEl && sliderEl.swiper) {
                sliderEl.swiper.prependSlide(reviewHTML);
                sliderEl.swiper.update(); 
            } else if (swiperWrapper) {
                swiperWrapper.insertAdjacentHTML('afterbegin', reviewHTML);
            }

            let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
            reviews.push(reviewHTML);
            localStorage.setItem('userReviews', JSON.stringify(reviews));

            nameInput.value = "";
            textInput.value = "";
            currentRating = 5;
            updateStars(currentRating);
            alert("Thank you for your review!");
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to delete all your reviews?")) {
                localStorage.removeItem('userReviews');
                location.reload(); 
            }
        });
    }
});

// ==========================================
// СИСТЕМА АВТОРИЗАЦИИ (FIREBASE)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDZ5SCOcrZeGjFVNO7XqaTbDPkfrgfEN08",
    authDomain: "chess-94ce0.firebaseapp.com",
    projectId: "chess-94ce0",
    storageBucket: "chess-94ce0.firebasestorage.app",
    messagingSenderId: "45016870814",
    appId: "1:45016870814:web:d7b049222933904e86b08f"
};

// Инициализация Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

const loginBtn = document.getElementById('login-btn'); 
const modal = document.getElementById('auth-modal');
const closeBtn = document.getElementById('close-modal');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const submitBtn = document.getElementById('auth-submit-btn');
const toggleLink = document.getElementById('auth-toggle-link');
const toggleText = document.getElementById('auth-toggle-text');
const modalTitle = document.getElementById('modal-title');
const errorMsg = document.getElementById('auth-error');
const nameGroup = document.getElementById('name-group');
const nameInput = document.getElementById('auth-name');
const modalSubtitle = document.getElementById('modal-subtitle');

let isLoginMode = true; 

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (auth.currentUser) { auth.signOut(); } 
        else { if(modal) modal.style.display = 'flex'; }
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if(modal) modal.style.display = 'none';
        if(errorMsg) errorMsg.style.display = 'none';
    });
}

if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode; 
        if(errorMsg) errorMsg.style.display = 'none';
        if(authForm) authForm.reset(); 

        if (isLoginMode) {
            modalTitle.innerText = "Sign In";
            modalSubtitle.innerText = "Welcome back, chess master!";
            submitBtn.innerText = "Login";
            toggleText.innerText = "Don't have an account?";
            toggleLink.innerText = "Sign Up";
            nameGroup.style.display = "none";
            nameInput.removeAttribute('required');
        } else {
            modalTitle.innerText = "Sign Up";
            modalSubtitle.innerText = "Join the ultimate chess community!";
            submitBtn.innerText = "Register";
            toggleText.innerText = "Already have an account?";
            toggleLink.innerText = "Sign In";
            nameGroup.style.display = "block";
            nameInput.setAttribute('required', 'true');
        }
    });
}

if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const name = nameInput.value; 
        errorMsg.style.display = 'none';

        if (isLoginMode) {
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    modal.style.display = 'none';
                    authForm.reset();
                })
                .catch((error) => {
                    errorMsg.innerText = "Error: Invalid email or password.";
                    errorMsg.style.display = 'block';
                });
        } else {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    return userCredential.user.updateProfile({ displayName: name });
                })
                .then(() => {
                    modal.style.display = 'none';
                    authForm.reset();
                    alert("Account created successfully!");
                })
                .catch((error) => {
                    errorMsg.innerText = "Error: " + error.message;
                    errorMsg.style.display = 'block';
                });
        }
    });
}

auth.onAuthStateChanged((user) => {
    if (loginBtn) {
        if (user) {
            // Оставляем только аккуратную иконку и слово Exit (без длинного имени)
            loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Exit`;
            
            // Красный цвет
            loginBtn.style.background = "#d9534f"; 
            loginBtn.style.color = "#fff";
            loginBtn.style.borderColor = "#d9534f";
            
            // Уменьшаем размер и отступы, чтобы кнопка смотрелась элегантно
            loginBtn.style.padding = "0.6rem 1.2rem";
            loginBtn.style.fontSize = "1.4rem";
        } else {
            // Возвращаем обычный дизайн "Sign In"
            loginBtn.innerHTML = `Sign In`;
            loginBtn.style.background = ""; 
            loginBtn.style.color = "";
            loginBtn.style.borderColor = "";
            
            // Сбрасываем стили размера до стандартных шапочных
            loginBtn.style.padding = "";
            loginBtn.style.fontSize = "";
        }
    }
});






//  
// 
// 
                function openInteractiveAbout() {
                    const staticBlock = document.getElementById('about-static');
                    const interactiveBlock = document.getElementById('about-interactive');
                    staticBlock.style.opacity = '0';
                    setTimeout(() => {
                        staticBlock.style.display = 'none';
                        interactiveBlock.style.display = 'block';
                        setTimeout(() => interactiveBlock.style.opacity = '1', 50);
                    }, 500);
                }

                function closeInteractiveAbout() {
                    const staticBlock = document.getElementById('about-static');
                    const interactiveBlock = document.getElementById('about-interactive');
                    interactiveBlock.style.opacity = '0';
                    setTimeout(() => {
                        interactiveBlock.style.display = 'none';
                        staticBlock.style.display = 'block';
                        setTimeout(() => staticBlock.style.opacity = '1', 50);
                    }, 500);
                }

                const storyData = {
                    'origin': { image: './pattern/Ablojkeq/origin.jpg', title: 'The Soul of the Game', text: 'Chatrak is not just a store; it is a sanctuary for the royal game. We believe that chess is the ultimate intersection of art, history, and human intellect. Every match deserves a proper setting, and every piece is a small sculpture with its own history.' },
                    'woods': { image: ' ./pattern/Ablojkeq/wood.jpg', title: 'Nature\'s Finest Canvas', text: 'We refuse to use synthetic stains. The rich blacks, deep reds, and golden browns of our sets are 100% natural. From the dense African Padauk to the mesmerizing chaos of Elm Burl, our materials are selected for their weight, texture, and aroma.' },
                    'craft': { image: ' ./pattern/Ablojkeq/dzi.jpg', title: 'Hand-Carved Perfection', text: 'While pawns and rooks are turned on a precision lathe, the Knight is the soul of the set. Our Knights are meticulously hand-carved by master artisans. A single highly detailed piece can take hours to perfect before being triple-weighted for balance.' },
                    'legacy': { image: './pattern/Ablojkeq/legacy.jpg', title: 'Preserving History', text: 'The pride of our collection lies in our historical replicas. We recreate the iconic 1849 Staunton designs, preserving historical accuracy in every curve and bevel. Playing with these pieces is like holding a piece of history in your hands.' }
                };

                function changeContent(chapterKey, event) {
                    const buttons = document.querySelectorAll('.chapter-btn');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    event.target.classList.add('active');
                    const imageEl = document.getElementById('display-image');
                    const textEl = document.getElementById('display-text');
                    imageEl.classList.remove('fade-in');
                    textEl.classList.remove('fade-in');
                    setTimeout(() => {
                        imageEl.src = storyData[chapterKey].image;
                        textEl.innerHTML = `<h3 style="font-size: 3rem; color: var(--main-color); margin-bottom: 1.5rem;">${storyData[chapterKey].title}</h3><p style="font-size: 1.6rem; line-height: 2; color: var(--main-color);">${storyData[chapterKey].text}</p>`;
                        imageEl.classList.add('fade-in');
                        textEl.classList.add('fade-in');
                    }, 50);
                }