// پیکربندی Firebase - جایگزین کنید با اطلاعات پروژه خودتان
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// راه‌اندازی Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dataRef = database.ref('presentation');

let data = {
    title: "ارائه من",
    cells: []
};

// بارگذاری داده‌ها از Firebase
function loadData() {
    dataRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
        } else {
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
            dataRef.set(data);
        }
        renderView();
    });
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
        } else if (cell.type === 'image') {
            const container = document.createElement('div');
            container.className = 'image-container';
            
            if (cell.caption) {
                const caption = document.createElement('div');
                caption.className = 'image-caption';
                caption.textContent = cell.caption;
                container.appendChild(caption);
            }
            
            const img = document.createElement('img');
            img.src = cell.content;
            img.alt = cell.caption || 'تصویر';
            img.className = 'presentation-image';
            
            container.appendChild(img);
            contentView.appendChild(container);
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
        typeLabel.textContent = cell.type === 'text' ? '📝 متن' : 
                               cell.type === 'code' ? '💻 کد' : '🖼️ عکس';
        
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
            
            const textarea = document.createElement('textarea');
            textarea.value = cell.content;
            textarea.oninput = (e) => {
                data.cells[index].content = e.target.value;
            };
            cellDiv.appendChild(textarea);
        } else if (cell.type === 'text') {
            const textarea = document.createElement('textarea');
            textarea.value = cell.content;
            textarea.oninput = (e) => {
                data.cells[index].content = e.target.value;
            };
            cellDiv.appendChild(textarea);
        } else if (cell.type === 'image') {
            const captionInput = document.createElement('input');
            captionInput.type = 'text';
            captionInput.value = cell.caption || '';
            captionInput.placeholder = 'عنوان تصویر (اختیاری)';
            captionInput.oninput = (e) => {
                data.cells[index].caption = e.target.value;
            };
            cellDiv.appendChild(captionInput);
            
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            
            const img = document.createElement('img');
            img.src = cell.content;
            img.alt = 'پیش‌نمایش';
            preview.appendChild(img);
            
            const changeBtn = document.createElement('button');
            changeBtn.className = 'change-image-btn';
            changeBtn.textContent = '🔄 تغییر عکس';
            changeBtn.onclick = () => changeImage(index);
            preview.appendChild(changeBtn);
            
            cellDiv.appendChild(preview);
        }
        
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
    scrollToLastCell();
}

// افزودن سلول کد
function addCodeCell() {
    data.cells.push({
        type: 'code',
        language: 'python',
        content: '# کد جدید'
    });
    renderEdit();
    scrollToLastCell();
}

// افزودن سلول عکس
function addImageCell() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // بررسی حجم فایل (حداکثر 2 مگابایت)
            if (file.size > 2 * 1024 * 1024) {
                alert('⚠️ حجم عکس باید کمتر از 2 مگابایت باشد!');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                data.cells.push({
                    type: 'image',
                    content: event.target.result,
                    caption: ''
                });
                renderEdit();
                scrollToLastCell();
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// تغییر عکس
function changeImage(index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('⚠️ حجم عکس باید کمتر از 2 مگابایت باشد!');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                data.cells[index].content = event.target.result;
                renderEdit();
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// اسکرول به آخرین سلول
function scrollToLastCell() {
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
    
    dataRef.set(data).then(() => {
        alert('✅ تغییرات با موفقیت ذخیره شد!\n\nحالا در تمام سیستم‌ها و مرورگرها قابل مشاهده است.');
        
        document.getElementById('editMode').style.display = 'none';
        document.getElementById('viewMode').style.display = 'block';
        renderView();
    }).catch((error) => {
        alert('❌ خطا در ذخیره‌سازی: ' + error.message);
    });
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
    
    const addTextBtn = document.getElementById('addTextBtn');
    const addCodeBtn = document.getElementById('addCodeBtn');
    const addImageBtn = document.getElementById('addImageBtn');
    
    if (addTextBtn) {
        addTextBtn.addEventListener('click', addTextCell);
    }
    
    if (addCodeBtn) {
        addCodeBtn.addEventListener('click', addCodeCell);
    }
    
    if (addImageBtn) {
        addImageBtn.addEventListener('click', addImageCell);
    }
});
