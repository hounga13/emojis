document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('emojiContainer');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const categoryNav = document.getElementById('categoryList');
    const toast = document.getElementById('toast');

    // i18n 초기화
    window.currentLang = detectLanguage();
    setLanguage(window.currentLang);

    // 카테고리 키 → 번역 키 매핑
    const categoryGroupKeys = {
        'recent': 'groupRecent',
        'smileys': 'groupSmileys',
        'animals': 'groupAnimals',
        'food': 'groupFood',
        'activities': 'groupActivities',
        'travel': 'groupTravel',
        'objects': 'groupObjects',
        'symbols': 'groupSymbols',
        'flags': 'groupFlags'
    };

    const categoryTabKeys = {
        'all': 'catAll',
        'recent': 'catRecent',
        'smileys': 'catSmileys',
        'animals': 'catAnimals',
        'food': 'catFood',
        'activities': 'catActivities',
        'travel': 'catTravel',
        'objects': 'catObjects',
        'symbols': 'catSymbols',
        'flags': 'catFlags'
    };

    let recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];

    // 언어 선택기 초기화
    initLangSelector();

    // UI 텍스트 적용
    applyUITranslations();

    // 초기 렌더링
    renderEmojis('all');

    // 언어 선택기 구성
    function initLangSelector() {
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');

        // 드롭다운 항목 생성
        langDropdown.innerHTML = '';
        SUPPORTED_LANGS.forEach(lang => {
            const item = document.createElement('div');
            item.className = 'lang-item' + (lang === window.currentLang ? ' active' : '');
            item.textContent = LANG_NAMES[lang];
            item.setAttribute('data-lang', lang);
            item.addEventListener('click', () => {
                setLanguage(lang);
                window.currentLang = lang;
                langDropdown.classList.add('hidden');
                applyUITranslations();
                // 현재 탭 유지하며 재렌더링
                const activeTab = document.querySelector('#categoryList li.active');
                const activeCat = activeTab ? activeTab.getAttribute('data-category') : 'all';
                renderEmojis(activeCat);
                // 드롭다운 active 상태 업데이트
                langDropdown.querySelectorAll('.lang-item').forEach(el => {
                    el.classList.toggle('active', el.getAttribute('data-lang') === lang);
                });
            });
            langDropdown.appendChild(item);
        });

        // 토글
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });

        // 바깥 클릭 시 닫기
        document.addEventListener('click', () => {
            langDropdown.classList.add('hidden');
        });
        langDropdown.addEventListener('click', (e) => e.stopPropagation());
    }

    // 모든 UI 텍스트를 현재 언어로 적용
    function applyUITranslations() {
        // 페이지 제목
        document.title = t('pageTitle');
        document.getElementById('siteTitle').textContent = t('siteTitle');
        document.querySelector('meta[name="description"]').setAttribute('content', t('metaDesc'));

        // 검색 플레이스홀더
        searchInput.placeholder = t('searchPlaceholder');

        // 카테고리 탭 텍스트 업데이트
        const tabs = categoryNav.querySelectorAll('li');
        tabs.forEach(tab => {
            const cat = tab.getAttribute('data-category');
            if (categoryTabKeys[cat]) {
                tab.textContent = t(categoryTabKeys[cat]);
            }
        });

        // 사용법 안내
        const usageHint = document.getElementById('usageHint');
        if (usageHint) usageHint.textContent = t('usageHint');

        // 푸터
        document.getElementById('footerText').textContent = t('footer');
    }

    // 검색 이벤트
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        clearBtn.style.display = query ? 'block' : 'none';

        if (query) {
            document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
            renderEmojis('search', query);
        } else {
            document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
            document.querySelector('[data-category="all"]').classList.add('active');
            renderEmojis('all');
        }
    });

    // 검색창 지우기
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        renderEmojis('all');
    });

    // 카테고리 클릭 이벤트
    categoryNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');

            searchInput.value = '';
            clearBtn.style.display = 'none';

            const category = e.target.getAttribute('data-category');
            renderEmojis(category);
        }
    });

    // 이모지 렌더링 함수
    function renderEmojis(filter, query = '') {
        container.innerHTML = '';
        let hasResults = false;

        // 최근 사용 이모지 표시
        if (filter === 'recent' || (filter === 'all' && recentEmojis.length > 0 && !query)) {
            hasResults = true;
            appendEmojiGroup('recent', recentEmojis.map(e => ({ emoji: e })));
            if (filter === 'recent') return;
        }

        if (filter === 'recent') {
            if (!hasResults) {
                container.innerHTML = `<div class="empty-state">${t('noRecent')}</div>`;
            }
            return;
        }

        // 전체 혹은 특정 카테고리 필터링
        const allCatKeys = Object.keys(categoryGroupKeys).filter(c => c !== 'recent');
        const categories = filter === 'all' ? allCatKeys : [filter];

        categories.forEach(cat => {
            let filteredList = emojiData.filter(item => item.category === cat);

            if (query) {
                filteredList = emojiData.filter(item =>
                    item.keywords.some(kw => kw.toLowerCase().includes(query))
                );
                if (cat !== categories[0]) return;
            }

            if (filteredList.length > 0) {
                hasResults = true;
                appendEmojiGroup(query ? '_search' : cat, filteredList);
            }
        });

        if (!hasResults) {
            container.innerHTML = `<div class="empty-state">${t('noResults')}</div>`;
        }
    }

    // 이모지 그룹(섹션) HTML 생성 후 삽입
    function appendEmojiGroup(categoryKey, list) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'emoji-group';

        const title = document.createElement('h2');
        if (categoryKey === '_search') {
            title.textContent = t('searchResults');
        } else if (categoryGroupKeys[categoryKey]) {
            title.textContent = t(categoryGroupKeys[categoryKey]);
        } else {
            title.textContent = categoryKey;
        }
        groupDiv.appendChild(title);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'emoji-grid';

        list.forEach(item => {
            const el = document.createElement('div');
            el.className = 'emoji-item';
            el.textContent = item.emoji;
            el.title = item.keywords ? item.keywords.join(', ') : 'emoji';

            el.addEventListener('click', () => copyToClipboard(item.emoji));

            gridDiv.appendChild(el);
        });

        groupDiv.appendChild(gridDiv);
        container.appendChild(groupDiv);
    }

    // 클립보드 복사 및 토스트 알림
    async function copyToClipboard(emoji) {
        try {
            await navigator.clipboard.writeText(emoji);
            showToast(`${emoji} ${t('copied')}`);
            saveRecentEmoji(emoji);
        } catch (err) {
            console.error('Failed to copy: ', err);
            const textArea = document.createElement("textarea");
            textArea.value = emoji;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            showToast(`${emoji} ${t('copied')}`);
            saveRecentEmoji(emoji);
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');

        if (window.toastTimer) clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function saveRecentEmoji(emoji) {
        recentEmojis = recentEmojis.filter(e => e !== emoji);
        recentEmojis.unshift(emoji);

        if (recentEmojis.length > 20) {
            recentEmojis.pop();
        }

        localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));

        const activeTab = document.querySelector('#categoryList li.active');
        const activeCat = activeTab ? activeTab.getAttribute('data-category') : 'all';
        if (activeCat === 'recent') {
            renderEmojis('recent');
        } else if (activeCat === 'all' && !searchInput.value) {
            renderEmojis('all');
        }
    }
});
