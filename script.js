let data = {
    title: "ارائه من",
    cells: []
};

// بارگذاری داده‌ها از فایل JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            data = await response.json();
        }
    } catch (e) {
        console.error('خطا در بارگذاری داده‌ها:', e);
        // اگر فایل وجود نداشت، از داده پیش‌فرض استفاده کن
        data = {
            title: "ارائه من",
            cells: [
                {
                    type: "text",
                    content: "این یک متن نمونه است.\nمی‌توانید آن را ویرایش کنید."
                },
                {
                    type: "code",
                    language: "python",
                    content: "def hello():\n    print('Hello, World!')"
                }
            ]
        };
    }
    renderView();
}

// رندر حالت نمایش
function renderView() {
    document.getElementById('presentationTitle').textContent = data.title;
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = '';

    data.cells.forEach(cell => {
        if (cell.type === 'text') {
            const p = document.createElement('p');
            p.textContent = cell.content;
            contentView.appendChild(p);
        } else if (cell.type === 'code') {
            const container = document.createElement('div');
            container.className = 'code-container';
            
            const label = document.createElement('div');
            label.className = 'code-label';
            label.textContent = cell.language.toUpperCase();
            
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${cell.language}`;
            code.textContent = cell.content;
            
            pre.appendChild(code);
            container.appendChild(label);
            container.appendChild(pre);
            contentView.appendChild(container);
            
            hljs.highlightElement(code);
        }
    });
}

// رندر حالت ویرایش
function renderEdit() {
    document.getElementById('titleInput').value = data.title;
    const container = document.getElementById('cellsContainer');
    container.innerHTML = '';

    data.cells.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = `cell ${cell.type}-cell`;
        
        const header = document.createElement('div');
        header.className = 'cell-header';
        
        const typeLabel = document.createElement('span');
        typeLabel.className = 'cell-type';
        typeLabel.textContent = cell.type === 'text' ? '📝 متن' : '💻 کد';
        
        const actions = document.createElement('div');
        actions.className = 'cell-actions';
        
        const upBtn = document.createElement('button');
        upBtn.className = 'cell-btn';
        upBtn.textContent = '⬆️';
        upBtn.disabled = index === 0;
        upBtn.onclick = () => moveCell(index, -1);
        
        const downBtn = document.createElement('button');
        downBtn.className = 'cell-btn';
        downBtn.textContent = '⬇️';
        downBtn.disabled = index === data.cells.length - 1;
        downBtn.onclick = () => moveCell(index, 1);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'cell-btn';
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => deleteCell(index);
        
        actions.appendChild(upBtn);
        actions.appendChild(downBtn);
        actions.appendChild(deleteBtn);
        
        header.appendChild(typeLabel);
        header.appendChild(actions);
        cellDiv.appendChild(header);
        
        if (cell.type === 'code') {
            const langInput = document.createElement('input');
            langInput.type = 'text';
            langInput.value = cell.language;
            langInput.placeholder = 'نام زبان (مثلاً: python)';
            langInput.oninput = (e) => {
                data.cells[index].language = e.target.value;
            };
            cellDiv.appendChild(langInput);
        }
        
        const textarea = document.createElement('textarea');
        textarea.value = cell.content;
        textarea.oninput = (e) => {
            data.cells[index].content = e.target.value;
        };
        cellDiv.appendChild(textarea);
        
        container.appendChild(cellDiv);
    });
}

// افزودن سلول متنی
function addTextCell() {
    data.cells.push({
        type: 'text',
        content: 'متن جدید'
    });
    renderEdit();
    
    setTimeout(() => {
        const container = document.getElementById('cellsContainer');
        const cells = container.querySelectorAll('.cell');
        if (cells.length > 0) {
            cells[cells.length - 1].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 100);
}

// افزودن سلول کد
function addCodeCell() {
    data.cells.push({
        type: 'code',
        language: 'python',
        content: '# کد جدید'
    });
    renderEdit();
    
    setTimeout(() => {
        const container = document.getElementById('cellsContainer');
        const cells = container.querySelectorAll('.cell');
        if (cells.length > 0) {
            cells[cells.length - 1].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 100);
}

// جابجایی سلول
function moveCell(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < data.cells.length) {
        [data.cells[index], data.cells[newIndex]] = [data.cells[newIndex], data.cells[index]];
        renderEdit();
    }
}

// حذف سلول
function deleteCell(index) {
    if (confirm('آیا مطمئن هستید که می‌خواهید این سلول را حذف کنید؟')) {
        data.cells.splice(index, 1);
        renderEdit();
    }
}

// ورود به حالت ویرایش
function enterEditMode() {
    const password = prompt('رمز عبور را وارد کنید:');
    if (password === '13820510') {
        document.getElementById('viewMode').style.display = 'none';
        document.getElementById('editMode').style.display = 'block';
        renderEdit();
    } else if (password !== null) {
        alert('رمز عبور اشتباه است!');
    }
}

// ذخیره تغییرات
function saveChanges() {
    data.title = document.getElementById('titleInput').value;
    
    // دانلود فایل JSON جدید
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
    
    alert('✅ تغییرات ذخیره شد!\n\nفایل data.json جدید دانلود شد.\nلطفاً آن را در مخزن GitHub خود آپلود کنید تا تغییرات در همه سیستم‌ها اعمال شود.');
    
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('viewMode').style.display = 'block';
    renderView();
}

// انصراف از ویرایش
function cancelEdit() {
    if (confirm('آیا می‌خواهید بدون ذخیره خارج شوید؟')) {
        loadData();
        document.getElementById('editMode').style.display = 'none';
        document.getElementById('viewMode').style.display = 'block';
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // اتصال دکمه‌ها با تابع
    const addTextBtn = document.getElementById('addTextBtn');
    const addCodeBtn = document.getElementById('addCodeBtn');
    
    if (addTextBtn) {
        addTextBtn.addEventListener('click', addTextCell);
    }
    
    if (addCodeBtn) {
        addCodeBtn.addEventListener('click', addCodeCell);
    }
});
