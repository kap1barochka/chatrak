// --- МИНИ-ИГРА И ПАЗЛЫ В ШАХМАТЫ ---

$(document).ready(function() {
    if ($('#myBoard').length === 0) return;

    var board = null;
    var game = new Chess();
    let isPuzzleMode = false; // Переключатель: играем классику или пазл

    // ==========================================
    // БАЗА ЗАДАЧ (Добавляй новые сюда)
    // ==========================================
    const puzzles = [
        {
            title: "Mate In 2",
            desc: "White to move and win. Find the brilliant queen sacrifice played by Mikhail Tal.",
            hint: "Hint: Look at the f7 square! The Queen is ready to strike.",
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1"
        },
        {
            title: "Mate In 1",
            desc: "White to move. The Black King is trapped. Find the classic 'Back Rank' checkmate.",
            hint: "Hint: Use your Rook to attack the 8th rank.",
            fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1"
        },
        {
            title: "Mate In 1",
            desc: "Black to move. White's King is cornered. Deliver the final blow with your Queen!",
            hint: "Hint: Move the Queen closer to the White King.",
            fen: "1k6/1P6/2K5/8/8/8/8/6q1 b - - 0 1"
        }
    ];

    // Функция: компьютер делает случайный ход
    function makeRandomMove() {
        var possibleMoves = game.moves();

        if (possibleMoves.length === 0) {
            if (game.in_checkmate()) alert("Мат! Отличная игра.");
            else if (game.in_draw() || game.in_stalemate()) alert("Ничья!");
            return;
        }

        var randomIdx = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIdx]);
        board.position(game.fen());
    }

    // Когда пользователь начинает тянуть фигуру
    function onDragStart(source, piece, position, orientation) {
        if (game.game_over()) return false;

        // В пазлах смотрим, чей ход по FEN. Если в классике - играем за белых.
        let turn = game.turn(); 
        if ((turn === 'w' && piece.search(/^b/) !== -1) || 
            (turn === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    // Когда пользователь отпускает фигуру (сделал ход)
    function onDrop(source, target) {
        var move = game.move({ from: source, to: target, promotion: 'q' });

        if (move === null) return 'snapback';

        // Проверка на победу в пазле
        if (isPuzzleMode && game.in_checkmate()) {
            setTimeout(() => alert("Блестяще! Вы решили задачу и поставили мат!"), 200);
            return;
        }

        // Если игра продолжается, компьютер отвечает
        window.setTimeout(makeRandomMove, 250);
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    var config = {
        draggable: true,           
        position: 'start', 
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };

    board = Chessboard('myBoard', config);

    // ==========================================
    // КНОПКИ УПРАВЛЕНИЯ
    // ==========================================

    // Кнопка: ЗАГРУЗИТЬ СЛУЧАЙНЫЙ ПАЗЛ
    $('#load-puzzle-btn').on('click', function() {
        const randomIdx = Math.floor(Math.random() * puzzles.length);
        const selectedPuzzle = puzzles[randomIdx];

        // Меняем текст на странице
        $('#puzzle-title').text(selectedPuzzle.title);
        $('#puzzle-desc').text(selectedPuzzle.desc);
        
        // Показываем кнопку подсказки и вешаем на нее актуальный текст
        $('#hint-puzzle-btn').show().off('click').on('click', () => alert(selectedPuzzle.hint));

        // Загружаем пазл на доску
        isPuzzleMode = true;
        game.load(selectedPuzzle.fen);
        
        // Если ход черных, переворачиваем доску для удобства
        if(game.turn() === 'b') {
            board.orientation('black');
        } else {
            board.orientation('white');
        }
        
        board.position(selectedPuzzle.fen);
    });

    // Кнопка: НОВАЯ КЛАССИЧЕСКАЯ ИГРА (Сброс)
    $('#restartBtn').off('click').on('click', function() {
        // 1. Выключаем режим пазла
        isPuzzleMode = false;
        
        // 2. Сбрасываем логику игры (правила)
        game.reset();
        
        // 3. Жестко сбрасываем визуальную доску (это 100% сработает)
        board.position('start');
        board.orientation('white'); 
        
        // 4. Возвращаем стандартные тексты
        $('#puzzle-title').text('Classic Game');
        $('#puzzle-desc').text('Play a standard chess game against the computer.');
        $('#hint-puzzle-btn').hide(); 
    });

    // Если меняется размер окна, доска адаптируется
    $(window).resize(board.resize);
});