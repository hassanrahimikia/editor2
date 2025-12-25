let data = {
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

function loadData() {
    const saved = localStorage.getItem('presentationData');
    if (saved) {
        try {
            data = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

function saveData() {
    try {
        localStorage.setItem('presentationData', JSON.stringify(data));
    } catch (e) {
        console.error('Error saving data:', e);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

function addTextCell() {
    data.cells.push({
        type: 'text',
        content: 'متن جدید'
    });
    renderEdit();
    
    // اسکرول به سلول جدید
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

function addCodeCell() {
    data.cells.push({
        type: 'code',
        language: 'python',
        content: '# کد جدید'
    });
    renderEdit();
    
    // اسکرول به سلول جدید
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

function moveCell(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < data.cells.length) {
        [data.cells[index], data.cells[newIndex]] = [data.cells[newIndex], data.cells[index]];
        renderEdit();
    }
}

function deleteCell(index) {
    if (confirm('آیا مطمئن هستید که می‌خواهید این سلول را حذف کنید؟')) {
        data.cells.splice(index, 1);
        renderEdit();
    }
}

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

function saveChanges() {
    data.title = document.getElementById('titleInput').value;
    saveData();
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('viewMode').style.display = 'block';
    renderView();
    alert('✅ تغییرات با موفقیت ذخیره شد!');
}

function cancelEdit() {
    if (confirm('آیا می‌خواهید بدون ذخیره خارج شوید؟')) {
        loadData();
        document.getElementById('editMode').style.display = 'none';
        document.getElementById('viewMode').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderView();
    
    document.getElementById('addTextBtn').addEventListener('click', addTextCell);
    document.getElementById('addCodeBtn').addEventListener('click', addCodeCell);
});
