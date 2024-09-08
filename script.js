let adventures = [];
let draggedItem = null;
let draggedItemOriginalPosition = null;

let isCleared = true;  // 用來追蹤目前是清空狀態還是填寫狀態

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
    
        // 应用保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const elements = document.querySelectorAll('.list, .adventure-input, .button-group button, .list-item, .modal-content');
        elements.forEach((el) => {
            el.classList.add('dark-mode');
        });
        document.getElementById('theme-switch').textContent = '☀️';
        darkorlight = false;
    }
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
        const difficultyItem = `<div class="list-item ${darkorlight ? '' : 'dark-mode'}" draggable="true" data-index="${index + 1}" id="diff-${index}">
            <div class="index">${index + 1}. </div>
            <div class="item-content">${adventure}</div>
        </div>`;
        
        const desireItem = `<div class="list-item ${darkorlight ? '' : 'dark-mode'}" draggable="true" data-index="${index + 1}" id="desire-${index}">
            <div class="index">${index + 1}. </div>
            <div class="item-content">${adventure}</div>
        </div>`;
        
        difficultyList.innerHTML += difficultyItem;
        desireList.innerHTML += desireItem;
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

// ... (previous code remains unchanged)

function dragStart() {
    draggedItem = this;
    setTimeout(() => this.classList.add('dragging'), 0);
    
    // 取得該項目屬於的列表
    const parentList = this.closest('.list').id;
    this.setAttribute('data-origin-list', parentList);  // 設定屬性標明來自哪個列表
        // 保存原始位置
    const listItems = Array.from(this.parentNode.children);
    draggedItemOriginalPosition = listItems.indexOf(this);
}

function dragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    draggedItemOriginalPosition = null;
    updateIndices();  // 更新序號
}

function dragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    const draggedList = draggedItem.getAttribute('data-origin-list');
    const currentList = this.id;

    // 檢查是否為同一個列表
    if (draggedList === currentList) {
        if (afterElement == null) {
            this.appendChild(draggedItem);
        } else {
            this.insertBefore(draggedItem, afterElement);
        }
    }
}



function touchStart(e) {
    if (e.touches.length > 1) {
        e.preventDefault(); // 阻止双指触屏事件
        // 在此处添加您的自定义操作，例如显示提示信息或执行其他逻辑
        return;
    }
    e.preventDefault();
    draggedItem = this;
    setTimeout(() => this.classList.add('dragging'), 0);
}

function touchMove(e) {
    e.preventDefault();
    if (e.touches.length > 1) {
        e.preventDefault(); // 阻止双指触屏事件
        // 在此处添加您的自定义操作，例如显示提示信息或执行其他逻辑
        return;
    }
    const touch = e.touches[0];
    const afterElement = getDragAfterElement(this, touch.clientY);
    if (afterElement == null) {
        this.appendChild(draggedItem);
    } else {
        this.insertBefore(draggedItem, afterElement);
    }
}

function touchEnd() {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
        updateIndices();  // 更新序號
    }
}

//function dragOver(e) {
//    e.preventDefault();
//    const afterElement = getDragAfterElement(this, e.clientY);
//    if (afterElement == null) {
//        this.appendChild(draggedItem);
//    } else {
//        this.insertBefore(draggedItem, afterElement);
//    }
//}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function drop(e) {
    e.preventDefault();
    const dropTarget = this;  // 目前放置的列表
    const draggedList = draggedItem.getAttribute('data-origin-list');  // 拖曳項目的列表類型
    const dropTargetList = dropTarget.id;  // 目標列表的 ID
    
    // 檢查是否同一個列表內
    if (draggedList === dropTargetList) {
        const afterElement = getDragAfterElement(dropTarget, e.clientY);
        if (afterElement == null) {
            dropTarget.appendChild(draggedItem);
        } else {
            dropTarget.insertBefore(draggedItem, afterElement);
        }
    } else {
        console.log('禁止跨列表拖曳！');
        // 将元素放回原始位置
        const originalList = document.getElementById(draggedList);
        const listItems = Array.from(originalList.children);
        if (draggedItemOriginalPosition >= listItems.length) {
            originalList.appendChild(draggedItem);
        } else {
            originalList.insertBefore(draggedItem, listItems[draggedItemOriginalPosition]);
        }
    }
    updateIndices();  // 更新序號
}

// ... (rest of the code remains unchanged)
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

let darkorlight = true;
let clickCount = 0; // 初始化点击计数器

function toggleTheme() {
    clickCount++; // 每次点击时增加计数

    // 检查点击次数
    if (clickCount == 10) {
        alert("壞掉啦~");
        return; // 禁用开关，不再执行切换主题的逻辑
    } else if (clickCount == 5) {
        alert("不要玩開關");
    } else if (clickCount > 10) {
        return; // 禁用开关，不再执行切换主题的逻辑
    }
    
    const body = document.body;
    const elements = document.querySelectorAll('.list, .adventure-input, .button-group button, .list-item, .modal-content');
    // 切换主题
    body.classList.toggle('dark-mode');
    elements.forEach((el) => {
        el.classList.toggle('dark-mode');
    });
    // 更新按钮图标和状态
    const themeSwitch = document.getElementById('theme-switch');
    if (body.classList.contains('dark-mode')) {
        themeSwitch.textContent = '☀️';
        darkorlight = false;
        localStorage.setItem('theme', 'dark');
    } else {
        themeSwitch.textContent = '🌙';
        darkorlight = true;
        localStorage.setItem('theme', 'light');
    }
}
