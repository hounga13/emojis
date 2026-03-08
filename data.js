// 핵심 이모지 데이터 (테스트용 간략 버전)
// 실 서비스에서는 더 많은 이모지가 json 데이터로 관리되어야 합니다.
const emojiData = [
    { emoji: '😀', category: 'smileys', keywords: ['웃음', '미소', '그리닝', '하하', 'smile', 'happy'] },
    { emoji: '😂', category: 'smileys', keywords: ['눈물', '기쁨', '폭소', 'laugh', 'cry', 'tears', 'joy'] },
    { emoji: '🥰', category: 'smileys', keywords: ['사랑', '하트', '반함', '러브', 'love', 'hearts'] },
    { emoji: '😎', category: 'smileys', keywords: ['멋짐', '선글라스', '쿨', 'cool', 'sunglasses'] },
    { emoji: '🤔', category: 'smileys', keywords: ['고민', '생각', '흠', 'thinking', 'hmm'] },
    { emoji: '😭', category: 'smileys', keywords: ['슬픔', '오열', '눈물', '우는', 'cry', 'sad'] },
    { emoji: '👍', category: 'smileys', keywords: ['따봉', '최고', '좋아요', '엄지척', 'thumbs up', 'good'] },
    { emoji: '👏', category: 'smileys', keywords: ['박수', '짝짝', '축하', 'clap', 'applause'] },
    { emoji: '🙏', category: 'smileys', keywords: ['부탁', '기도', '합장', '제발', 'pray', 'please'] },

    { emoji: '🐶', category: 'animals', keywords: ['강아지', '개', '동물', 'dog', 'puppy'] },
    { emoji: '🐱', category: 'animals', keywords: ['고양이', '야옹이', 'cat', 'kitty'] },
    { emoji: '🐰', category: 'animals', keywords: ['토끼', '동물', 'rabbit', 'bunny'] },
    { emoji: '🦊', category: 'animals', keywords: ['여우', 'fox'] },
    { emoji: '🐻', category: 'animals', keywords: ['곰', '동물', 'bear'] },
    { emoji: '🌿', category: 'animals', keywords: ['풀', '자연', '식물', '허브', 'herb', 'plant'] },
    { emoji: '🌸', category: 'animals', keywords: ['꽃', '벚꽃', '봄', 'flower', 'blossom'] },

    { emoji: '🍔', category: 'food', keywords: ['햄버거', '버거', '패스트푸드', 'hamburger', 'burger'] },
    { emoji: '🍕', category: 'food', keywords: ['피자', '음식', 'pizza'] },
    { emoji: '🍎', category: 'food', keywords: ['사과', '과일', 'apple'] },
    { emoji: '☕', category: 'food', keywords: ['커피', '티', '카페', 'coffee', 'tea'] },
    { emoji: '🍺', category: 'food', keywords: ['맥주', '술', '음주', 'beer', 'drink'] },

    { emoji: '⚽️', category: 'activities', keywords: ['축구', '공', '스포츠', 'soccer', 'football'] },
    { emoji: '🎮', category: 'activities', keywords: ['게임', '패드', '오락', 'game', 'controller'] },
    { emoji: '🎵', category: 'activities', keywords: ['음악', '노래', '음표', 'music', 'note'] },

    { emoji: '✈️', category: 'travel', keywords: ['비행기', '여행', 'airplane', 'flight', 'travel'] },
    { emoji: '🏖️', category: 'travel', keywords: ['바다', '해변', '휴가', 'beach', 'vacation'] },
    { emoji: '🚗', category: 'travel', keywords: ['자동차', '차', '운전', 'car', 'drive'] },

    { emoji: '💡', category: 'objects', keywords: ['전구', '아이디어', '생각', 'lightbulb', 'idea'] },
    { emoji: '📱', category: 'objects', keywords: ['스마트폰', '핸드폰', '전화', 'phone', 'mobile'] },
    { emoji: '💻', category: 'objects', keywords: ['노트북', '컴퓨터', '랩탑', 'laptop', 'computer'] },

    { emoji: '❤️', category: 'symbols', keywords: ['하트', '사랑', '빨간하트', 'heart', 'love'] },
    { emoji: '✨', category: 'symbols', keywords: ['반짝', '마법', '별', 'sparkles', 'magic'] },
    { emoji: '🔥', category: 'symbols', keywords: ['불', '핫', '열정', 'fire', 'hot'] },
    { emoji: '✅', category: 'symbols', keywords: ['체크', '확인', '성공', 'check', 'done'] }
];
