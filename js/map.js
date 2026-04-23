document.addEventListener('DOMContentLoaded', () => {
    // 1. Создаем карту (масштаб подстроится сам)
    const map = L.map('map').setView([40.181, 44.515], 8);

    // 2. Светлая тема карты от CARTO (без ошибок блокировки)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(map);

    // 3. Кастомная иконка
    const chessIcon = L.divIcon({
        className: 'custom-map-icon',
        html: '<i class="fas fa-chess-knight"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    });

    // 4. БАЗА МЕСТ ТОЛЬКО В АРМЕНИИ
    const chessPlaces = [
        {
            title: "Tigran Petrosian Chess House",
            desc: "Главный шахматный центр в Ереване. Место проведения турниров.",
            lat: 40.1822, 
            lng: 44.5160
        },
        {
            title: "Chatrak Official Store",
            desc: "Наш главный магазин в Ереване. Лучшие шахматные доски и наборы.",
            lat: 40.1790, 
            lng: 44.5120
        },
        {
            title: "Lovers' Park (Ереван)",
            desc: "Прекрасный парк, где молодежь и старшее поколение часто играют в шахматы на свежем воздухе.",
            lat: 40.1925, 
            lng: 44.5060
        },
        {
            title: "Tsaghkadzor Sports Complex",
            desc: "В Цахкадзоре регулярно проходят крупные международные и командные чемпионаты по шахматам.",
            lat: 40.5330, 
            lng: 44.7160
        },
        {
            title: "Gyumri Chess School",
            desc: "Шахматная школа в культурной столице Армении, воспитавшая многих гроссмейстеров.",
            lat: 40.7930, 
            lng: 43.8440
        },
        {
            title: "Sevan Lakeside Pavilion",
            desc: "Идеальное место для спокойной игры в шахматы с видом на озеро Севан.",
            lat: 40.5560, 
            lng: 45.0000
        },
        {
            title: "Dilijan Chess Retreat",
            desc: "Интеллектуальные лагеря и шахматные сборы в лесах Дилижана.",
            lat: 40.7400, 
            lng: 44.8640
        }
    ];

    const listContainer = document.getElementById('list-container');
    const markersArray = []; 

    // 5. Размещаем маркеры и карточки
    chessPlaces.forEach((place) => {
        // Ставим маркер
        const marker = L.marker([place.lat, place.lng], { icon: chessIcon }).addTo(map);
        marker.bindPopup(`<b>${place.title}</b><br>${place.desc}`);
        markersArray.push(marker);

        // Создаем карточку слева
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <h3>${place.title}</h3>
            <p>${place.desc}</p>
        `;

        // При клике на карточку летим к нужному городу
        card.addEventListener('click', () => {
            map.flyTo([place.lat, place.lng], 15, {
                animate: true,
                duration: 1.5
            });
            setTimeout(() => { marker.openPopup(); }, 1500);
        });

        listContainer.appendChild(card);
    });

    // 6. Автоматический масштаб, чтобы идеально показать всю Армению
    const group = new L.featureGroup(markersArray);
    map.fitBounds(group.getBounds(), { padding: [50, 50] });
});