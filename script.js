let adventures = [];
let draggedItem = null;
let isCleared = true;  // 用來追蹤目前是清空狀態還是填寫狀態
let isDragging = false;  // 新增變數，用來追蹤是否有項目在拖曳中

window.onload = function () {
    document.getElementById('result-modal').style.display = 'none';
    const grid = document.querySelector('.adventure-grid');
    for (let i = 1; i <= 20; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <label for="adventure-${i}">第${i}個冒險：</label>
            <input type="text" id="adventure-${i}" class="adventure-input">
        `;
        grid.appendChild(div);
    }

    const savedAdventures = localStorage.getItem('adventures');
    if (savedAdventures) {
        adventures = JSON.parse(savedAdventures);
        adventures.forEach((adventure, index) => {
            document.getElementById(`adventure-${index + 1}`).value = adventure;
        });
    }
    
    const button = document.querySelector('.button-group button');

    // 檢查是否有 `.adventure-input` 元素有內容
    const hasContent = Array.from(document.querySelectorAll('.adventure-input')).some(input => input.value.trim() !== '');

    if (hasContent) {
        isCleared = true;
        button.textContent = '一鍵清空';
    } else {
        isCleared = false;
        button.textContent = '一鍵填寫';
    }
    // 切換 `isCleared` 的狀態
    isCleared = !isCleared;
}
// 點擊事件處理器，處理隱藏 modal 的邏輯
document.addEventListener('click', function(event) {
    const modal = document.getElementById('result-modal');
    const target = event.target;
    // 檢查 modal 是否顯示中，並且點擊的不是 modal 內部的元素
    if (event.target == modal) {
        modal.style.display = "none";
    }
});


function clearAll() {
    const button = document.querySelector('.button-group button');
    if (isCleared) {
        fillRandomAdventures();  // 隨機填入冒險事項
        button.textContent = '一鍵清空';
    } else {
        document.querySelectorAll('.adventure-input').forEach(input => {
            input.value = '';
        });
        button.textContent = '一鍵填寫';
    }
    isCleared = !isCleared;
}

function fillRandomAdventures() {
    const randomAdventures = [
        '登山探險', '潛水活動', '滑雪挑戰', '極限飛行', '沙漠徒步', '高空彈跳', '跳傘', '深海潛水',
        '滑翔翼', '冰川健行', '荒野求生', '叢林探險', '騎行旅行', '漂流', '海島探險', '火山探險',
        '北極圈探險', '洞穴探險', '熱氣球旅行', '越野賽車'
    ];

    // 將冒險事項隨機排列後填入 20 格
    const shuffledAdventures = randomAdventures.sort(() => 0.5 - Math.random());
    document.querySelectorAll('.adventure-input').forEach((input, index) => {
        input.value = shuffledAdventures[index];
    });
}

function saveAdventures() {
    adventures = Array.from(document.querySelectorAll('.adventure-input')).map(input => input.value.trim());
    if (adventures.some(adventure => adventure === '')) {
        alert('請確保所有冒險事項都已填寫！');
        return;
    }
    localStorage.setItem('adventures', JSON.stringify(adventures));
    showLists();
}

function editAdventures() {
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('input-container2').style.display = 'block';
    document.getElementById('lists-container').style.display = 'none';
    document.getElementById('sorting-buttons').style.display = 'none';
}

function showLists() {
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('input-container2').style.display = 'none';
    document.getElementById('lists-container').style.display = 'flex';
    document.getElementById('sorting-buttons').style.display = 'block';

    const difficultyList = document.getElementById('difficulty-list');
    const desireList = document.getElementById('desire-list');

    difficultyList.innerHTML = '<h3>簡單到困難</h3>';
    desireList.innerHTML = '<h3>不想做到想做</h3>';

    adventures.forEach((adventure, index) => {
        difficultyList.innerHTML += `<div class="list-item" draggable="true" data-index="${index + 1}" id="diff-${index}"><div class="index">${index + 1}. </div><div class="item-content">${adventure}</div></div>`;
        desireList.innerHTML += `<div class="list-item" draggable="true" data-index="${index + 1}" id="desire-${index}"><div class="index">${index + 1}. </div><div class="item-content">${adventure}</div></div>`;
    });

    addDragListeners();
}

function addDragListeners() {
    const listItems = document.querySelectorAll('.list-item');
    const lists = document.querySelectorAll('.list');

    listItems.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
        item.addEventListener('touchstart', touchStart);
        item.addEventListener('touchend', touchEnd);
    });

    lists.forEach(list => {
        list.addEventListener('dragover', dragOver);
        list.addEventListener('dragenter', dragEnter);
        list.addEventListener('dragleave', dragLeave);
        list.addEventListener('drop', drop);
        list.addEventListener('touchmove', touchMove);
        list.addEventListener('touchend', touchEnd);
    });
}

function dragStart() {
    draggedItem = this;
    setTimeout(() => this.classList.add('dragging'), 0);
}

function dragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    updateIndices();  // 更新序號
}



// 觸控開始
function touchStart(e) {
    // 檢查是否已經有項目在拖曳
    if (isDragging) {
        return;  // 如果有其他項目在拖曳，則禁止開始新的拖曳
    }

    e.preventDefault();
    draggedItem = this;
    isDragging = true;  // 標記為拖曳中
    setTimeout(() => this.classList.add('dragging'), 0);
}

// 觸控移動
function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const afterElement = getDragAfterElement(this, touch.clientY);
    if (afterElement == null) {
        this.appendChild(draggedItem);
    } else {
        this.insertBefore(draggedItem, afterElement);
    }
}

// 觸控結束
function touchEnd() {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
        isDragging = false;  // 結束拖曳後，重置為未拖曳狀態
        updateIndices();  // 更新序號
    }
}

function dragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    if (afterElement == null) {
        this.appendChild(draggedItem);
    } else {
        this.insertBefore(draggedItem, afterElement);
    }
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function drop() {}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.list-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateIndices() {
    const difficultyItems = document.querySelectorAll('#difficulty-list .list-item');
    const desireItems = document.querySelectorAll('#desire-list .list-item');

    difficultyItems.forEach((item, index) => {
        item.querySelector('.index').textContent = `${index + 1}. `;
    });

    desireItems.forEach((item, index) => {
        item.querySelector('.index').textContent = `${index + 1}. `;
    });
}

function calculateResult() {
    const difficultyOrder = Array.from(document.querySelectorAll('#difficulty-list .list-item .item-content'))
        .map(item => item.textContent.trim());
    const desireOrder = Array.from(document.querySelectorAll('#desire-list .list-item .item-content'))
        .map(item => item.textContent.trim());

    // 計算兩個列表對應項目的乘積
    const scores = difficultyOrder.map((diff, index) => {
        const desireIndex = desireOrder.indexOf(diff);
        return {
            item: diff,
            score: (index + 1) * (desireIndex + 1)  // 使用索引相乘
        };
    });

    // 按分數排序並找出中位數
    scores.sort((a, b) => a.score - b.score);
    const midIndex1 = Math.floor((scores.length - 1) / 2);
    const midIndex2 = scores.length % 2 === 0 ? midIndex1 + 1 : midIndex1;

    // 顯示中位數的兩個項目
    let result = '<ul>';
    result += `<li>中位數項目1: ${scores[midIndex1].item}, 分數: ${scores[midIndex1].score}</li>`;
    if (midIndex1 !== midIndex2) {
        result += `<li>中位數項目2: ${scores[midIndex2].item}, 分數: ${scores[midIndex2].score}</li>`;
    }
    result += '</ul>';

    document.getElementById('result').innerHTML = result;
    document.getElementById('result-modal').style.display = 'block';
    
}

function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}
