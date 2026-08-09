// lib/mockData.js

export const MOCK_USERS = {
  tutoring: {
    id: 'user-tutoring-001',
    email: 'student.tutoring@rapid.com',
    full_name: '山田 太郎',
    address: '東京都千代田区神田1-2-3',
    phone_number: '090-1234-5678',
    registration_date: '2026-08-01',
    notes: '志望校：東京大学（文一） / 特記事項：毎週土曜夜に指導希望',
    plans: [
      { plan_type: 'tutoring', contract_start_date: '2026-08-01', status: 'active' }
    ]
  },
  video: {
    id: 'user-video-002',
    email: 'student.video@rapid.com',
    full_name: '佐藤 花子',
    address: '大阪府大阪市北区梅田4-5-6',
    phone_number: '080-9876-5432',
    registration_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
    notes: '志望校：京都大学（総合人間）',
    plans: [
      { plan_type: 'video', contract_start_date: '2026-08-05', status: 'active' }
    ]
  },
  both: {
    id: 'user-both-003',
    email: 'student.all@rapid.com',
    full_name: '鈴木 健太',
    address: '神奈川県横浜市西区みなとみらい7-8-9',
    phone_number: '070-1122-3344',
    registration_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    notes: '志望校：一橋大学（社会学部） / W受講生',
    plans: [
      { plan_type: 'tutoring', contract_start_date: '2026-08-01', status: 'active' },
      { plan_type: 'video', contract_start_date: '2026-08-01', status: 'active' }
    ]
  }
};

export const MOCK_TUTORING_SCHEDULES = [
  {
    id: 'sched-101',
    user_id: 'user-tutoring-001',
    scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 5 days, 4 hrs from now
    title: '共通テスト地理B 特訓個別指導 第4回',
    meeting_url: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    notes: '事前課題：2025年共通テスト追試 大問3の演習を完了させておいてください。'
  },
  {
    id: 'sched-102',
    user_id: 'user-both-003',
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    title: '難関大論述地理 個別指導 第2回',
    meeting_url: 'https://zoom.us/j/123456789',
    status: 'scheduled',
    notes: '事前課題：論述テキスト P.45〜P.50'
  }
];

export const MOCK_VIDEOS = [
  {
    id: 'vid-01',
    title: '第1講：共通テスト地理の全体像と攻略戦略',
    description: '共通テスト地理の傾向、出題パターンの分類、および最短で高得点を取るための思考フレームワークを伝授します。',
    youtube_video_id: 'M7lc1UVf-VE', // Standard test video
    duration_seconds: 648,
    days_after_registration: 0, // 登録当日に即時公開
    category: 'ガイダンス',
    order_index: 1
  },
  {
    id: 'vid-02',
    title: '第2講：自然環境① プレートテクトニクスと世界の地形区分',
    description: '変動帯（新期造山帯・古期造山帯）と安定陸塊のメカニズムを図解で完全整理。テストに出るプレート境界線を徹底解説。',
    youtube_video_id: 'dQw4w9WgXcQ',
    duration_seconds: 1240,
    days_after_registration: 0, // 登録当日に即時公開
    category: '系統地理',
    order_index: 2
  },
  {
    id: 'vid-03',
    title: '第3講：自然環境② ケッペンの気候区分判定フローチャート',
    description: '雨温図を見た瞬間に気候区（Af, Cfa, Cs, Dw等）を瞬時に判別できる特製思考アルゴリズムを公開。',
    youtube_video_id: '3JZ_D3ELwOQ',
    duration_seconds: 1520,
    days_after_registration: 3, // 登録から3日後に自動公開
    category: '系統地理',
    order_index: 3
  },
  {
    id: 'vid-04',
    title: '第4講：資源と産業① 世界の農作物の生産・輸出統計完全分析',
    description: 'ホイットルセー農牧業区分の暗記を脱し、自給的農業・商業的農業の分布ルールを理解で覚える講義。',
    youtube_video_id: 'fJ9rUzIMcDQ',
    duration_seconds: 1800,
    days_after_registration: 7, // 登録から7日後に自動公開
    category: '系統地理',
    order_index: 4
  },
  {
    id: 'vid-05',
    title: '第5講：地誌① 東アジア・東南アジアの地理と共通テスト過去問演習',
    description: 'ASEAN諸国の工業化、農業特徴、宗教分布など、高頻出テーマを一気に総整理。',
    youtube_video_id: 'K4TOrB7at0Y',
    duration_seconds: 1650,
    days_after_registration: 14, // 登録から14日後に自動公開
    category: '地誌',
    order_index: 5
  }
];

export const MOCK_PROGRESS = {
  'vid-01': {
    last_position_seconds: 180,
    max_position_seconds: 180,
    is_completed: true
  },
  'vid-02': {
    last_position_seconds: 342, // 5 min 42 sec
    max_position_seconds: 400,
    is_completed: false
  }
};

export const MOCK_MEMOS = {
  'vid-01': '共通テスト地理は暗記ではなく「理由とメカニズムの理解」が8割。図表の読み取り練習を重点的に行う。',
  'vid-02': 'サンアンドレアス断層＝ずれる境界。ヒマラヤ山脈＝広がる境界ではなく狭まる境界（大陸同士の衝突）。'
};
