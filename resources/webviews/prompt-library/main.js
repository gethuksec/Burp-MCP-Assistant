(function () {
    const vscode = acquireVsCodeApi();

    // State
    let prompts = window.initialPrompts || [];
    let currentCategory = 'all';
    let searchQuery = '';

    // Elements
    const grid = document.getElementById('prompts-grid');
    const categoryList = document.getElementById('category-list');
    const searchInput = document.getElementById('search-input');
    const noResults = document.getElementById('no-results');

    // Initialize
    function init() {
        renderCategories();
        renderPrompts();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Search
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderPrompts();
        });

        // Category selection (delegation)
        categoryList.addEventListener('click', (e) => {
            const item = e.target.closest('.category-item');
            if (!item) return;

            // Update active state
            document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            currentCategory = item.dataset.category;
            renderPrompts();
        });
    }

    function renderCategories() {
        // Extract unique categories
        const categories = [...new Set(prompts.map(p => p.category))].sort();

        // Clear existing (except "All")
        const allItem = categoryList.firstElementChild;
        categoryList.innerHTML = '';
        categoryList.appendChild(allItem);

        categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.textContent = cat;
            li.dataset.category = cat;
            categoryList.appendChild(li);
        });
    }

    function renderPrompts() {
        grid.innerHTML = '';

        const filtered = prompts.filter(p => {
            const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
            const matchesSearch = !searchQuery ||
                p.name.toLowerCase().includes(searchQuery) ||
                p.description.toLowerCase().includes(searchQuery) ||
                p.tags.some(t => t.toLowerCase().includes(searchQuery));

            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            filtered.forEach(p => {
                const card = createPromptCard(p);
                grid.appendChild(card);
            });
        }
    }

    function createPromptCard(prompt) {
        const div = document.createElement('div');
        div.className = 'prompt-card';
        div.onclick = (e) => {
            // Prevent triggering if clicked on button
            if (e.target.tagName === 'BUTTON') return;
            // copy by default on card click
            copyPrompt(prompt);
        };

        const tagsHtml = prompt.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('');

        div.innerHTML = `
            <div class="card-header">
                <h3 class="prompt-title">${prompt.name}</h3>
            </div>
            <p class="prompt-description">${prompt.description}</p>
            <div class="card-footer">
                <div class="tags">${tagsHtml}</div>
                <div class="actions">
                    <button class="btn btn-secondary" onclick="insertPrompt('${prompt.id}')">Insert</button>
                    <button class="btn btn-primary" onclick="copyPrompt('${prompt.id}')">Copy</button>
                </div>
            </div>
        `;

        // Attach event listeners for buttons to prevent bubbling issues and pass object
        const insertBtn = div.querySelector('.btn-secondary');
        const copyBtn = div.querySelector('.btn-primary');

        insertBtn.onclick = (e) => {
            e.stopPropagation();
            vscode.postMessage({ type: 'insertPrompt', prompt: prompt });
        };

        copyBtn.onclick = (e) => {
            e.stopPropagation();
            copyPrompt(prompt);
        };

        return div;
    }

    function copyPrompt(prompt) {
        vscode.postMessage({ type: 'copyPrompt', prompt: prompt });
    }

    // Start
    init();

})();
