document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. ЛОГИКА ФИЛЬТРАЦИИ НОВОСТЕЙ (Твой код)
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            
            // Убираем класс active у всех кнопок и добавляем нажатой
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Сортируем карточки
            newsCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    
                    // Перезапускаем плавную анимацию для появления отфильтрованных карточек
                    card.style.animation = 'none';
                    card.offsetHeight; // Триггер для перезапуска анимации
                    card.style.animation = 'slideUpFade 0.6s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // =========================================
    // 2. ЛОГИКА МОДАЛЬНОГО ОКНА ЧТЕНИЯ (Новый код)
    // =========================================
    const readLinks = document.querySelectorAll('.read-link');
    const articleModal = document.getElementById('article-modal');
    const closeArticleBtn = document.getElementById('close-article');

    // Элементы внутри модального окна
    const modalImg = document.getElementById('article-img');
    const modalCategory = document.getElementById('article-category');
    const modalMeta = document.getElementById('article-meta');
    const modalTitle = document.getElementById('article-title');
    const modalBody = document.getElementById('article-body');

    // Полные тексты для статей (база данных текстов)
    const articleTexts = {
        "The 2026 World Chess Championship: A New Era Begins": "The tension is palpable as the world's finest minds clash in the ultimate test of strategy. With traditional openings being heavily scrutinized, players are resorting to psychological warfare and obscure middle-game structures to break the symmetry. <br><br> Experts predict that this championship will fundamentally change how chess is played at the elite level for the next decade.",
        "Carlsen Dominates Rapid Circuit": "Magnus continues to prove that instinct and speed are just as crucial as deep calculation in the modern era of chess. His recent performance in the rapid circuit showed unparalleled positional understanding. <br><br> 'I just play what feels right,' Carlsen commented after his stunning 9/10 streak.",
        "Neural Networks Redefining Theory": "How deep learning algorithms and custom engines are creating completely new paradigms in opening preparation. Traditional engine evaluations are being challenged by neural networks that prioritize long-term compensation over immediate material gain.",
        "The Psychology of the Attack: Mikhail Tal": "Analyzing the social and psychological pressure applied by the 'Magician from Riga' during his most complex sacrifices. Tal didn't just play the board; he played the opponent. His speculative sacrifices often had flaws, but defending them under time pressure was nearly impossible for humans.",
        "Yerevan Open Sets New Attendance Record": "The capital of chess gathers over 500 participants, bridging the gap between young prodigies and seasoned veterans. The atmosphere at the Tigran Petrosian Chess House was electric as players from 30 different countries competed for the grand prize."
    };

    // Вешаем событие на каждую ссылку "Read More"
    readLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Останавливаем прыжок страницы наверх!

            // Находим карточку, по которой кликнули
            const card = link.closest('.news-card');
            
            // Собираем из неё данные
            const title = card.querySelector('h2').innerText;
            const imgSrc = card.querySelector('img').src;
            const category = card.querySelector('.category-badge').innerText;
            const meta = card.querySelector('.meta').innerText;

            // Заполняем модальное окно собранными данными
            modalTitle.innerText = title;
            modalImg.src = imgSrc;
            modalCategory.innerText = category;
            modalMeta.innerText = meta;
            
            // Подставляем полный текст статьи
            modalBody.innerHTML = articleTexts[title] || "Full article text will be available soon.";

            // Показываем окно
            articleModal.style.display = 'flex';
        });
    });

    // Логика закрытия окна по крестику
    if (closeArticleBtn) {
        closeArticleBtn.addEventListener('click', () => {
            articleModal.style.display = 'none';
        });
    }

    // Закрытие по клику на темный фон вокруг окна
    window.addEventListener('click', (e) => {
        if (e.target === articleModal) {
            articleModal.style.display = 'none';
        }
    });

});