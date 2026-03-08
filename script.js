document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('emojiContainer');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const categoryNav = document.getElementById('categoryList');
    const toast = document.getElementById('toast');

    // 카테고리별 이름 매핑
    const categoryNames = {
        'recent': '최근 사용 🕒',
        'smileys': '스마일리 & 사람 😀',
        'animals': '동물 & 자연 🐶',
        'food': '음식 & 음료 🍔',
        'activities': '활동 ⚽️',
        'travel': '여행 & 장소 ✈️',
        'objects': '사물 💡',
        'symbols': '기호 ❤️',
        'flags': '깃발 🏳️'
    };

    let recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];

    // 초기 렌더링
    renderEmojis('all');

    // 검색 이벤트
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        clearBtn.style.display = query ? 'block' : 'none';

        // 검색 중에는 카테고리 탭 선택을 해제
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
                container.innerHTML = '<div class="empty-state">최근에 사용한 이모지가 없습니다. 👀</div>';
            }
            return;
        }

        // 전체 혹은 특정 카테고리 필터링
        const categories = filter === 'all' ? Object.keys(categoryNames).filter(c => c !== 'recent') : [filter];

        categories.forEach(cat => {
            let filteredList = emojiData.filter(item => item.category === cat);

            if (query) { // 검색어 필터링
                filteredList = emojiData.filter(item =>
                    item.keywords.some(kw => kw.toLowerCase().includes(query))
                );
                // 카테고리 루프 한 번만 돌면 됨 (검색 시 전체 렌더링)
                if (cat !== categories[0]) return;
            }

            if (filteredList.length > 0) {
                hasResults = true;
                appendEmojiGroup(query ? '검색 결과 🔍' : cat, filteredList);
            }
        });

        if (!hasResults) {
            container.innerHTML = '<div class="empty-state">검색 결과가 없습니다. 😢</div>';
        }
    }

    // 이모지 그룹(섹션) HTML 생성 후 삽입
    function appendEmojiGroup(categoryKey, list) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'emoji-group';

        const title = document.createElement('h2');
        title.textContent = categoryNames[categoryKey] || categoryKey;
        groupDiv.appendChild(title);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'emoji-grid';

        list.forEach(item => {
            const el = document.createElement('div');
            el.className = 'emoji-item';
            el.textContent = item.emoji;
            el.title = item.keywords ? item.keywords.join(', ') : '이모지';

            // 복사 클릭 이벤트
            el.addEventListener('click', () => copyToClipboard(item.emoji));

            gridDiv.appendChild(el);
        });

        groupDiv.appendChild(gridDiv);
        container.appendChild(groupDiv);
    }

    // 클립보드 복사 및 토스트 알림, 최근 이모지 저장
    async function copyToClipboard(emoji) {
        try {
            await navigator.clipboard.writeText(emoji);
            showToast(`${emoji} 복사됨!`);
            saveRecentEmoji(emoji);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = emoji;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            showToast(`${emoji} 복사됨!`);
            saveRecentEmoji(emoji);
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');

        // 기존 타이머 취소
        if (window.toastTimer) clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function saveRecentEmoji(emoji) {
        // 이미 있으면 제거 후 맨 앞에 추가
        recentEmojis = recentEmojis.filter(e => e !== emoji);
        recentEmojis.unshift(emoji);

        // 최대 20개까지만 저장
        if (recentEmojis.length > 20) {
            recentEmojis.pop();
        }

        localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));

        // '최근 사용' 탭 혹은 '전체' 탭을 보고 있다면 화면 갱신
        const activeTab = document.querySelector('#categoryList li.active').getAttribute('data-category');
        if (activeTab === 'recent') {
            renderEmojis('recent');
        } else if (activeTab === 'all' && !searchInput.value) {
            renderEmojis('all');
        }
    }
});
