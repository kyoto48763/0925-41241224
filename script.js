let flipCount = 0;
let flippedCards = [];
let lockBoard = false;
let matchedCards = 0;
let imageSet = 'image'; // 預設圖片集資料夾
const backImagesSet1 = ['item1.png', 'item2.png', 'item3.png', 'item4.png', 'item5.png', 'item6.png', 'item7.png', 'item8.png'];
const backImagesSet2 = ['item1.jpg', 'item2.jpg', 'item3.jpg', 'item4.jpg', 'item5.jpg', 'item6.jpg', 'item7.jpg', 'item8.jpg']; // image2的圖片格式為jpg
let backImages = [...backImagesSet1]; // 初始設定為第一個圖片集
const frontImageSet1 = 'item9.jpg'; // 統一背面圖片 for image
const frontImageSet2 = 'item9.jpg'; // 統一背面圖片 for image2
let frontImage = `${imageSet}/${frontImageSet1}`; // 預設統一背面圖片
let cards = [];
const cardContainer = document.getElementById('card-container');
const flipCountDisplay = document.getElementById('flip-count');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const toggleImagesBtn = document.getElementById('toggle-images-btn');

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
toggleImagesBtn.addEventListener('click', toggleImageSet);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateCards() {
    cards = [...backImages, ...backImages]; // 每張背面圖片各兩張
    shuffle(cards);
    cardContainer.innerHTML = ''; // 清空卡片容器
    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner" id="card-inner-${index}" onclick="flipCard(${index})">
                <div class="card-back">
                    <img src="${imageSet}/${image}" alt="背面圖片">
                </div>
                <div class="card-front">
                    <img src="${frontImage}" alt="正面圖片">
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}

function startGame() {
    flipCount = 0;
    flippedCards = [];
    lockBoard = true;  // 防止在10秒內翻卡
    matchedCards = 0;
    flipCountDisplay.textContent = flipCount;
    cardContainer.style.display = 'grid';
    startBtn.style.display = 'none';
    resetBtn.style.display = 'block';
    generateCards();

    // 立即翻開所有卡牌（顯示正面）
    setTimeout(flipAllCardsToFront, 100);

    // 10秒後自動翻回背面
    setTimeout(() => {
        flipAllCardsToBack();
        lockBoard = false;  // 解鎖，允許玩家開始翻卡
    }, 10000);
}

function resetGame() {
    flipCount = 0;
    flippedCards = [];
    lockBoard = true;  // 防止在10秒內翻卡
    matchedCards = 0;
    flipCountDisplay.textContent = flipCount;
    generateCards();

    // 立即翻開所有卡牌（顯示正面）
    setTimeout(flipAllCardsToFront, 100);

    // 10秒後自動翻回背面
    setTimeout(() => {
        flipAllCardsToBack();
        lockBoard = false;  // 解鎖，允許玩家開始翻卡
    }, 10000);
}

function flipCard(index) {
    if (lockBoard) return;  // 如果板鎖定，則不進行操作
    const cardInner = document.getElementById(`card-inner-${index}`);
    if (cardInner.style.transform !== 'rotateY(180deg)') {
        cardInner.style.transform = 'rotateY(180deg)';
        flippedCards.push(index);
        flipCount++;
        flipCountDisplay.textContent = flipCount;
        if (flippedCards.length === 2) {
            lockBoard = true;
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstImage = document.getElementById(`card-inner-${firstCard}`).querySelector('.card-back img').src;
    const secondImage = document.getElementById(`card-inner-${secondCard}`).querySelector('.card-back img').src;

    if (firstImage === secondImage) {
        matchedCards += 2;
        if (matchedCards === cards.length) {
            alert('恭喜你！遊戲結束了！');
        }
    } else {
        document.getElementById(`card-inner-${firstCard}`).style.transform = 'rotateY(0deg)';
        document.getElementById(`card-inner-${secondCard}`).style.transform = 'rotateY(0deg)';
    }
    flippedCards = [];
    lockBoard = false;
}

// 將所有卡牌翻到正面
function flipAllCardsToFront() {
    cards.forEach((_, index) => {
        const cardInner = document.getElementById(`card-inner-${index}`);
        cardInner.style.transform = 'rotateY(180deg)';
    });
}

// 將所有卡牌翻回背面
function flipAllCardsToBack() {
    cards.forEach((_, index) => {
        const cardInner = document.getElementById(`card-inner-${index}`);
        cardInner.style.transform = 'rotateY(0deg)';
    });
}

// 切換圖片集
function toggleImageSet() {
    if (imageSet === 'image') {
        imageSet = 'image2';
        backImages = [...backImagesSet2]; // 切換到第二組圖片（jpg格式）
        frontImage = `${imageSet}/${frontImageSet2}`; // 切換背面圖片
    } else {
        imageSet = 'image';
        backImages = [...backImagesSet1]; // 切換回第一組圖片（png格式）
        frontImage = `${imageSet}/${frontImageSet1}`; // 切換背面圖片
    }

    // 切換圖片集後立即開始遊戲（包括10秒的預覽）
    flipCount = 0;
    flippedCards = [];
    lockBoard = true;  // 防止在10秒內翻卡
    matchedCards = 0;
    flipCountDisplay.textContent = flipCount;
    cardContainer.style.display = 'grid';
    startBtn.style.display = 'none';
    resetBtn.style.display = 'block';
    generateCards();

    // 立即翻開所有卡牌（顯示正面）
    setTimeout(flipAllCardsToFront, 100);

    // 10秒後自動翻回背面
    setTimeout(() => {
        flipAllCardsToBack();
        lockBoard = false;  // 解鎖，允許玩家開始翻卡
    }, 10000);
}
