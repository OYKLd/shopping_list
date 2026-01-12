document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('itemInput');
    const addButton = document.getElementById('addItem');
    const shoppingList = document.getElementById('shoppingList');
    const clearAllButton = document.getElementById('clearAll');
    const itemCountElement = document.getElementById('itemCount');
    
    let items = JSON.parse(localStorage.getItem('shoppingList')) || [];
    
    renderItems();
    
    function addItem() {
        const text = itemInput.value.trim();
        if (text !== '') {
            const newItem = {
                id: Date.now(),
                text,
                completed: false
            };
            items.unshift(newItem);
            saveAndRender();
            itemInput.value = '';
            itemInput.focus();
        }
    }
    
    function toggleComplete(id) {
        items = items.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        saveAndRender();
    }
    
    function deleteItem(id) {
        items = items.filter(item => item.id !== id);
        saveAndRender();
    }
    
    function clearAllItems() {
        if (items.length > 0 && confirm('Êtes-vous sûr de vouloir supprimer tous les articles ?')) {
            items = [];
            saveAndRender();
        }
    }
    
    function saveAndRender() {
        localStorage.setItem('shoppingList', JSON.stringify(items));
        renderItems();
        updateItemCount();
    }
    
    function renderItems() {
        if (items.length === 0) {
            shoppingList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Votre liste de courses est vide</p>
                </div>`;
            return;
        }
        
        shoppingList.innerHTML = items.map(item => `
            <li class="${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <input type="checkbox" class="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="item-text">${escapeHtml(item.text)}</span>
                <button class="delete-btn" aria-label="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
        
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.closest('li').dataset.id);
                toggleComplete(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('li').dataset.id);
                deleteItem(id);
            });
        });
    }
    
    function updateItemCount() {
        const total = items.length;
        const completed = items.filter(item => item.completed).length;
        const remaining = total - completed;
        
        if (total === 0) {
            itemCountElement.textContent = '0 article';
        } else if (remaining === 0) {
            itemCountElement.textContent = `Tout est coché (${total} ${total > 1 ? 'articles' : 'article'})`;
        } else {
            itemCountElement.textContent = 
                `${remaining} ${remaining > 1 ? 'articles' : 'article'} restant${remaining > 1 ? 's' : ''}`;
        }
    }
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    addButton.addEventListener('click', addItem);
    
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });
    
    clearAllButton.addEventListener('click', clearAllItems);
    
    updateItemCount();
});
