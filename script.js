let adventures = [];
let draggedItem = null;
let draggedItemOriginalPosition = null;

let isCleared = true;  // 用來追蹤目前是清空狀態還是填寫狀態
const messages = [
    "%c不要亂看，再看打你屁股!!",
    "%c這邊不是小朋友可以來的地方喔~!",
    "%c請離開這裡，這是禁區!",
    "%c你這樣不可以喔，滾!!",
    "%c不要再偷看了..."
];

// 随机选择一条信息
const randomMessage = messages[Math.floor(Math.random() * messages.length)];

// 根据选择的消息设置颜色和样式
let style = "color: red; font-size: 24px; font-weight: bold;"; // 默认样式

// 判断消息内容并设置相应的样式
if (randomMessage.includes("這邊不是小朋友可以來的地方")) {
    style = "color: #DAA520; font-size: 24px; font-weight: bold;"; // 深黃色
} else if (randomMessage.includes("你這樣不可以喔，滾!!")) {
    style = "color: #DAA520; font-size: 24px; font-weight: bold;"; // 深黃色
}

// 输出到控制台
console.log(randomMessage, style);


function adjustLayout() {
    // 檢查螢幕寬度是否為手機模式
    const check_input_container = document.getElementById('input-container');
    const paginationButtons = document.querySelector('.pagination-buttons');

    // 判斷當前顯示的是哪個列表
    if (window.matchMedia("(max-width: 768px)").matches && check_input_container.style.display === 'none') {
        // 設定 pagination-buttons 為 flex
        paginationButtons.style.display = 'flex';
        
        // 手機模式時的操作
        document.getElementById('easy').style.display = 'block';
        document.getElementById('notdo').style.display = 'none';

        document.getElementById('lists-container').style.display = 'flex';
        document.getElementById('sorting-buttons').style.display = 'block';
        
    } else if(check_input_container.style.display === 'none') {
        // 非手機模式時的操作
        paginationButtons.style.display = 'none';
        
        document.getElementById('easy').style.display = 'block';
        document.getElementById('notdo').style.display = 'block';
        
        document.getElementById('lists-container').style.display = 'flex';
        document.getElementById('sorting-buttons').style.display = 'block';
    }
    
}

window.onscroll = function() {
    var btn = document.getElementById("scrollBtn");
    var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    var windowHeight = document.documentElement.scrollHeight;
    var docHeight = document.documentElement.scrollHeight;

    // 根據滾動位置決定按鈕顯示和功能
    if (scrollPosition >= windowHeight / 2) {
        btn.style.display = "block"; // 顯示按鈕
        btn.innerHTML = "<box-icon type='solid' name='chevrons-up' animation='fade-up'></box-icon>"; // 上
        btn.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // 滾動到頂部
        };
    } else {
        btn.style.display = "block"; // 顯示按鈕
        btn.innerHTML = "<box-icon type='solid' name='chevrons-down' animation='fade-down'></box-icon>"; // 下
        btn.onclick = function() {
            window.scrollTo({ top: docHeight, behavior: 'smooth' }); // 滾動到底部
        };
    }
};

window.onload = function () {
//    adjustLayout();
    document.getElementById("scrollBtn").style.display = "none";
    
    document.getElementById('result-modal').style.display = 'none';
    showLists_once();
    
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
        const elements = document.querySelectorAll('.list, .adventure-input, .button-group button, .list-item, .modal-content, .list-description p, .styled-button');
        elements.forEach((el) => {
            el.classList.add('dark-mode');
        });
        document.getElementById('theme-switch').textContent = '☀️';
        darkorlight = false;
    }
    
    const easyList = document.getElementById('easy');
    const notdoList = document.getElementById('notdo');
    const changePageButton = document.getElementById('changePage');

    // 判斷當前顯示的是哪個列表
    if (easyList.style.display === 'block') {
        // 更改按鈕文字為 "前往簡單排序"
        changePageButton.innerText = "前往 想不想做 排序";
    } else {
        // 更改按鈕文字為 "前往困難排序"
        changePageButton.innerText = "前往 簡單困難 排序";
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

// 監聽螢幕大小改變，當改變時重新調整版面
window.addEventListener('resize', adjustLayout);


function showNotification(message, duration = 3000, backgroundColor = null) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    // 清除之前的定時器
    clearTimeout(notification.timer);
    
    // 設定訊息內容
    messageElement.textContent = message;
    
    // 設定背景顏色，如果有指定
    if (backgroundColor) {
        notification.style.backgroundColor = backgroundColor;
    } else {
        // 如果未指定背景色，則使用默認樣式
        notification.style.backgroundColor = ''; 
    }
    
    // 顯示通知
    notification.classList.add('show');
    notification.style.opacity = '1'; // 確保 opacity 為 1
    
    // 設定定時器在指定時間後隱藏通知
    notification.timer = setTimeout(() => {
        notification.style.opacity = '0';   // 觸發淡出效果
        
        // 設定一個定時器在淡出效果完成後隱藏 notification
        setTimeout(() => {
            notification.classList.remove('show');  // 隱藏通知
        }, 500);  // 與淡出動畫時間一致
    }, duration);
}



function showLists_once() {    
    
    const difficultyList = document.getElementById('difficulty-list');
    const desireList = document.getElementById('desire-list');

    difficultyList.innerHTML = '<h3>簡單到困難</h3>';
    desireList.innerHTML = '<h3>想做到不想做</h3>';
    
    // 先檢查是否有保存的排序
    const savedDifficultyOrder = JSON.parse(localStorage.getItem('difficultyOrder'));
    const savedDesireOrder = JSON.parse(localStorage.getItem('desireOrder'));

    try {
        const totalItems = savedDifficultyOrder.length; // 獲取 list 的長度
        const tailNumber = totalItems >= 20 ? 20 : totalItems; // 如果項目少於 20，則設置為當前項目數量

        // 動態修改提示文本
        document.querySelector('.list-description.easy p').setAttribute('data-message', `(1最簡單，${tailNumber}最困難)`);
        document.querySelector('.list-description.notdo p').setAttribute('data-message', `(1最想做，${tailNumber}最不想做)`);

        savedDifficultyOrder.forEach((adventure, index) => {
            const difficultyItem = `<div class="list-item ${darkorlight ? '' : 'dark-mode'}" draggable="true" data-index="${index + 1}" id="diff-${index}">
                <div class="index">${index + 1}. </div>
                <div class="item-content">${adventure}</div>
            </div>`;
            difficultyList.innerHTML += difficultyItem;
        });

        savedDesireOrder.forEach((adventure, index) => {
            const desireItem = `<div class="list-item ${darkorlight ? '' : 'dark-mode'}" draggable="true" data-index="${index + 1}" id="desire-${index}">
                <div class="index">${index + 1}. </div>
                <div class="item-content">${adventure}</div>
            </div>`;
            desireList.innerHTML += desireItem;
        });
        
        // 檢查螢幕寬度是否為手機模式
        if (window.matchMedia("(max-width: 768px)").matches) {
            
            const paginationButtons = document.querySelector('.pagination-buttons');
            paginationButtons.style.display = 'flex';

            document.getElementById('input-container').style.display = 'none';
            document.getElementById('input-container2').style.display = 'none';
            document.getElementById('lists-container').style.display = 'flex';
            document.getElementById('easy').style.display = 'block';
            document.getElementById('notdo').style.display = 'none';

            document.getElementById('sorting-buttons').style.display = 'block';
            
        }else{
            // 非手機模式，執行原本的操作
            document.getElementById('input-container').style.display = 'none';
            document.getElementById('input-container2').style.display = 'none';
            document.getElementById('lists-container').style.display = 'flex';
            document.getElementById('sorting-buttons').style.display = 'block';            
        }

        addDragListeners();

        // 測試顯示通知
        showNotification('自動載入上次排序！', 1500);
        
    } catch(e){
        console.log('load error',e);
        return;
    }
}

function clearAll() {
    const button = document.querySelector('.button-group button');
    if (isCleared) {
        fillRandomAdventures();  // 隨機填入冒險事項
        button.textContent = '一鍵清空';
    } else {
        document.querySelectorAll('.adventure-input').forEach(input => {
            input.value = '';
        });
        // 清空 localStorage
        localStorage.removeItem('adventures');
        localStorage.removeItem('difficultyOrder');
        localStorage.removeItem('desireOrder');
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

    // 將冒險事項隨機排列
    const shuffledAdventures = randomAdventures.sort(() => 0.5 - Math.random());
    let adventureIndex = 0;

    // 遍歷每個 .adventure-input，僅填入空白的格子
    document.querySelectorAll('.adventure-input').forEach((input) => {
        if (input.value.trim() === '' && adventureIndex < shuffledAdventures.length) {
            input.value = shuffledAdventures[adventureIndex];
            adventureIndex++;
        }
    });
}

function saveAdventures() {
    // 只保存非空白的冒險事項
    adventures = Array.from(document.querySelectorAll('.adventure-input'))
        .map(input => input.value.trim())
        .filter(adventure => adventure !== '');  // 過濾掉空白項目

    // 檢查使用者是否填寫了至少三個項目
    if (adventures.length < 3) {
        alert('請至少填寫三個冒險事項。');
        return;  // 停止執行，避免保存空白項目
    }

    // 將已填寫的冒險事項存入 localStorage
    localStorage.setItem('adventures', JSON.stringify(adventures));
    
    // 顯示冒險清單
    showLists();
}

function editAdventures() {
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('input-container2').style.display = 'block';
    document.getElementById('lists-container').style.display = 'none';
    document.getElementById('sorting-buttons').style.display = 'none';
    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.style.display = 'none';

}

function showLists() {
        // 檢查螢幕寬度是否為手機模式
    if (window.matchMedia("(max-width: 768px)").matches) {
        showLists_phone();  // 如果是手機模式，執行手機專屬的函數
        return; // 結束函數
    }
    
    // 非手機模式，執行原本的操作
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('input-container2').style.display = 'none';
    document.getElementById('lists-container').style.display = 'flex';
    document.getElementById('sorting-buttons').style.display = 'block';
    
    document.getElementById('easy').style.display = 'block';
    document.getElementById('notdo').style.display = 'block';
    
    const difficultyList = document.getElementById('difficulty-list');
    const desireList = document.getElementById('desire-list');

    
    const totalItems = adventures.length; // 獲取 list 的長度
    const tailNumber = totalItems >= 20 ? 20 : totalItems; // 如果項目少於 20，則設置為當前項目數量

    // 動態修改提示文本
    document.querySelector('.list-description.easy p').setAttribute('data-message', `(1最簡單，${tailNumber}最困難)`);
    document.querySelector('.list-description.notdo p').setAttribute('data-message', `(1最想做，${tailNumber}最不想做)`);
    
    difficultyList.innerHTML = '<h3>簡單到困難</h3>';
    desireList.innerHTML = '<h3>想做到不想做</h3>';

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
    if (!isChangePageCalled && window.matchMedia("(max-width: 768px)").matches) {
        const confirmation = confirm("尚未排序另一個項目，是否確定完成?");
        if (confirmation) {
            // 用戶選擇確定，執行計算結果
            console.log("Calculating results...");
            // 在此處添加計算結果的邏輯
        } else {
            // 用戶選擇取消，跳轉到 changePage()
            changePage();
            return;
        }
    }
    const difficultyOrder = Array.from(document.querySelectorAll('#difficulty-list .list-item .item-content'))
        .map(item => item.textContent.trim());
    const desireOrder = Array.from(document.querySelectorAll('#desire-list .list-item .item-content'))
        .map(item => item.textContent.trim());

    const totalItems = difficultyOrder.length;

    // 計算難度分數（第一項和最後一項分數為1，往中間越高）
    const difficultyScores = difficultyOrder.map((_, index) => {
        const midIndex = Math.floor(totalItems / 2);
        return index < midIndex
            ? index + 1  // 前半部越靠前分數越低
            : totalItems - index;  // 後半部越靠後分數越低
    });

    // 計算欲望分數（第一項最高，最後一項為1）
    const desireScores = desireOrder.map((_, index) => totalItems - index);

    // 計算兩個列表對應項目的乘積
    const scores = difficultyOrder.map((diff, index) => {
        const desireIndex = desireOrder.indexOf(diff);
        const diffScore = difficultyScores[index];
        const desireScore = desireScores[desireIndex];
        return {
            item: diff,
            score: diffScore * desireScore,  // 使用分數相乘
            difficultyIndex: index           // 紀錄項目在原始 difficultyOrder 的順序
        };
    });

    // 按分數排序，當分數相同時以 difficultyOrder 的順序作為次排序條件
    scores.sort((a, b) => {
        if (b.score === a.score) {
            return a.difficultyIndex - b.difficultyIndex;  // 同分時按原始順序
        }
        return b.score - a.score;  // 主要依據分數由高到低排序
    });

    const topN = totalItems < 13 ? 3 : 5;  // 根據項目數量決定產生幾個
    let result = '<ul>';

    for (let i = 0; i < topN; i++) {
        result += `<li>　第${i + 1}名： ${scores[i].item}</li>`;
    }

    result += '</ul>';

    document.getElementById('result').innerHTML = result;
    document.getElementById('result-modal').style.display = 'block';

    try {
        // 保存排序的列表
        const difficultyOrder = Array.from(document.querySelectorAll('#difficulty-list .list-item'))
            .map(item => item.querySelector('.item-content').textContent.trim());
        const desireOrder = Array.from(document.querySelectorAll('#desire-list .list-item'))
            .map(item => item.querySelector('.item-content').textContent.trim());

        localStorage.setItem('difficultyOrder', JSON.stringify(difficultyOrder));
        localStorage.setItem('desireOrder', JSON.stringify(desireOrder));

    } catch (e) {
        console.log('save list error:', e);
        return;
    }
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
//        alert("壞掉啦~");
        showNotification('壞掉啦~', 2000, 'red');
        return; // 禁用开关，不再执行切换主题的逻辑
    } else if (clickCount == 5) {
//        alert("不要玩開關");
        showNotification('不要玩開關', 1500, 'pink');

    } else if (clickCount > 10) {
        return; // 禁用开关，不再执行切换主题的逻辑
    }
    
    const body = document.body;
    const elements = document.querySelectorAll('.list, .adventure-input, .button-group button, .list-item, .modal-content, .list-description p, .styled-button');
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

function showLists_phone(){
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('input-container2').style.display = 'none';
    document.getElementById('lists-container').style.display = 'flex';
    document.getElementById('easy').style.display = 'block';
    document.getElementById('notdo').style.display = 'none';

    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.style.display = 'flex';

    document.getElementById('sorting-buttons').style.display = 'block';

    const difficultyList = document.getElementById('difficulty-list');
    const desireList = document.getElementById('desire-list');

    difficultyList.innerHTML = '<h3>簡單到困難</h3>';
    desireList.innerHTML = '<h3>想做到不想做</h3>';

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
let isChangePageCalled = false; // 追蹤是否已經調用 changePage()

function changePage() {
    // 此函數的內容可以根據需求修改
    isChangePageCalled = true; // 當此函數被調用時，設置為 true

    const easyList = document.getElementById('easy');
    const notdoList = document.getElementById('notdo');
    const changePageButton = document.getElementById('changePage');

    // 判斷當前顯示的是哪個列表
    if (easyList.style.display === 'block') {
        // 如果 easy 列表顯示中，則切換到 notdo 列表
        easyList.style.display = 'none';
        notdoList.style.display = 'block';
        // 更改按鈕文字為 "前往簡單排序"
        changePageButton.innerText = "前往 簡單困難 排序";
    } else {
        // 如果 notdo 列表顯示中，則切換到 easy 列表
        easyList.style.display = 'block';
        notdoList.style.display = 'none';
        // 更改按鈕文字為 "前往困難排序"
        changePageButton.innerText = "前往 想不想做 排序";
    }

    // 快速滾動到頁面最上面
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function copyToClipboard() {
    // 獲取 #result 內的所有文字
    const resultText = document.getElementById('result').innerText;
    
    // 將文字以換行符號分割為陣列，並去掉每個項目前的序號
    const resultArray = resultText.split('\n').map(item => item.replace(/^\s*\d+名：\s*/, ''));
    
    // 用", "將陣列中的項目連接成一行
    const formattedText = resultArray.join('、');
    
    // 創建一個不可見的 textarea 來臨時存放格式化後的文字
    const textarea = document.createElement('textarea');
    textarea.value = formattedText;
    document.body.appendChild(textarea); // 將 textarea 暫時加入到 body
    textarea.select(); // 選取 textarea 內的文字
    document.execCommand('copy'); // 執行複製命令
    document.body.removeChild(textarea); // 移除 textarea

    // 顯示通知給使用者
    showNotification('文字已複製到剪貼簿', 900 );
}

