// data/ExplainBlock.ts
import type { ExplainBlockData } from '../src/types/ExplainBlock'

export const explainBlockDataMap = {
    explainRapidData: {
        type: 'block',
        title: '地理専門塾RAPID＋ってどんな塾？',

        textColor: '#111111',
        boxTextColor: '#111111',

        highlightColor: '#e6452d',

        backgroundColor:
            'linear-gradient(90deg, #FFB547 0%, #FBDD5C 100%)',

        boxBackgroundColor: '#ffffff',

        footerText:
            '分からなかった問題は、チャットを通していつでも講師に質問可能。\n苦手な問題をそのまま放置しないので、うっかりミスを防げます。',

        items: [
            {
            type: 'step',
            label: '01',
            image: '/images/self.webp',
            leadText:
                '最短で共通テスト8割を実現！\n現役教員がつくったカリキュラム',
            bodyText:
                '現役地理教員である塾長が、共通テストで出題される範囲だけに絞って作成。\n無駄な勉強を省くことで、効率良く進めることができます。',
            },
            {
            type: 'step',
            label: '02',
            image: '/images/self.webp',
            leadText:
                '演習問題が解けるようになる！\nオリジナル教材を使った指導',
            bodyText:
                '共通テストの問題を解くことに特化した演習ベースのオリジナル教材。\n必要な「法則」を知ることで、1人でもスイスイ解けるようになります。',
            },
            {
            type: 'step',
            label: '03',
            image: '/images/self.webp',
            leadText:
                '日々の勉強を最高のクオリティに！\n成長を加速させる手厚いサポート',
            bodyText:
                '分からなかった問題は、チャットを通していつでも講師に質問可能。\n苦手な問題をそのまま放置しないので、うっかりミスを防げます。',
            },
        ],
    },

    /* ===============================
        共感まとめ
    ================================ */
    empathySummary: {
    type: 'band',
    backgroundColor: '#ffffff',
    boxBackgroundColor: '#e0361a',
    highlightColor: '#e0361a',
    textColor: '#000000',
    boxTextColor: '#ffffff',
    title: 'その感覚、間違っていません。',
    items: [
        { type: 'text', leadText: '「やっているように見えて、' },
        { type: 'text', leadText: '実は身についていない」' },
    ],
    },

    /* ===============================
        疑問①
    ================================ */
    question1: {
    type: 'card',
    label: {
        text: '疑問①',
        rounded: true,
        textColor: '#ffffff',
        backgroundColor: '#e6452d',
    },
    title: '地理は頑張って勉強しても\n点数が伸びにくいってホント？',
    highlightColor: '#e6452d',
    backgroundColor: '#ffffff',
    boxBackgroundColor: '#f7f6ef',
    textColor: '#000000',
    boxTextColor: '#000000',
    items: [
        {
        type: 'text',
        leadText: '地理は勉強法を間違えると\n点数が全く伸びません。',
        highlight: '勉強法を間違えると',
        },
        {
        type: 'image',
        image: '/images/question.webp',
        text: '用語を覚えるために\n一問一答に取り組む。',
        highlight: '一問一答',
        imagePosition: 'left',
        },
        {
        type: 'image',
        image: '/images/motivation.webp',
        text: '教科書の文章や資料を\n端から端まで暗記する。',
        highlight: '教科書の文章や資料を',
        },
        {
        type: 'image',
        image: '/images/paper.webp',
        text: 'なんとなくの感覚だけで\n演習問題を解く。',
        highlight: 'なんとなくの感覚だけで',
        },
        {
        type: 'image',
        image: '/images/pen&maru.webp',
        text: 'このような勉強法では、\n点数は安定しません。',
        },
    ],
    },

    /* ===============================
        疑問②
    ================================ */
    question2: {
        type: 'card',
        label: {
            text: '疑問②',
            rounded: true,
            textColor: '#ffffff',
            backgroundColor: '#e6452d',
        },
        title: '参考書だけで伸びる子と\n伸びない子の違いって何？',
        highlightColor: '#e6452d',
        backgroundColor: '#ffffff',
        boxBackgroundColor: '#f7f6ef',
        textColor: '#000000',
        boxTextColor: '#000000',
        items: [
            {
            type: 'text',
            leadText: '参考書だけで伸びる子には\n次のような特徴があります。',
            },
            {
            type: 'image',
            image: '/images/onthebook.webp',
            text: '問題の答えについて\n「なぜそうなるか」\nを説明できる。',
            highlight: 'なぜそうなるか',
            imagePosition: 'left',
            },
            {
            type: 'image',
            image: '/images/social.webp',
            text: '初めて見る資料でも、\n考え方の方向性\nが分かる。',
            highlight: '考え方の方向性',
            imagePosition: 'left',
            },
            {
            type: 'image',
            image: '/images/self.webp',
            text: '間違えた原因を\n自分で振り返り\n修正できる。',
            highlight: '自分で振り返り',
            imagePosition: 'left',
            },
            {
            type: 'image',
            image: '/images/sleepy.webp',
            text:
                'もしそうでない場合、\n「参考書だけ」の勉強は\n遠回り\nになる可能性があります。',
            highlight: '遠回り',
            imagePosition: 'left',
            },
        ],
        footerText:
            '参考書だけの勉強は、\n【演習問題を1人で解ける子】\nにはおすすめです',
    },

    /* ===============================
        違い説明
    ================================ */
    difference: {
        type: 'band',
        title: '',
        highlightColor: '#e6452d',
        backgroundColor: '#ffffff',
        boxBackgroundColor: '#f7f6ef',
        textColor: '#000000',
        boxTextColor: '#000000',
        items: [
            {
            type: 'text',
            leadText: '地理は得意・苦手が分かれる科目です',
            highlight: '得意・苦手',
            },
            {
            type: 'image',
            image: '/images/self.webp',
            text: '参考書だけで\n伸びる子',
            imagePosition: 'left',
            },
            {
            type: 'image',
            image: '/images/help.webp',
            text: 'サポートが\n必要な子',
            imagePosition: 'right',
            },
            {
            type: 'text',
            leadText: 'はっきりとした違いがあります。',
            },
        ],
    },

    /* ===============================
        診断説明
    ================================ */
    diagnosis: {
        type: 'band',
        title:
            '地理専門塾RAPID＋は、\n「塾が必要かどうか」を確認するため\n入塾前に診断を行なっています。',
        thumbnail: {
            src: '/images/online.webp',
            width: 160,
            height: 160,
        },
        highlightColor: '#e6452d',
        backgroundColor: '#ffffff',
        boxBackgroundColor: '#f7f6ef',
        textColor: '#000000',
        boxTextColor: '#000000',
        items: [
            {
            type: 'text',
            leadText:
                '診断結果によっては、\n「今は塾が必要ありません」\nとお伝えすることもございます。',
            highlight: '今は塾が必要ありません',
            },
            {
            type: 'image',
            image: '/images/online.webp',
            text:
                '地理は、正しい学習法に\n切り替えるだけで伸びる\nことがあるからです。',
            imagePosition: 'left',
            },
            { type: 'text', leadText: 'その上で、' },
            {
            type: 'image',
            image: '/images/motivation.webp',
            text:
                '① 独学では理解できない\n② 演習問題の解き方が\n身についていない',
            highlight: '① 独学では理解できない\n② 演習問題の解き方が\n身についていない',
            imagePosition: 'right',
            },
            { type: 'text', leadText: 'これらに当てはまる場合のみ、\nサポートを行なっています。' },
        ],
    },
} satisfies Record<string, ExplainBlockData>

