// pages/geography-lp.tsx
import Image from 'next/image';
import Layout from '../components/LayoutGeo';
import { Checklist } from '../components/Checklist';
import { checklistData } from '../data/checklist';
import { ExplainBlock } from '../components/ExplainBlock';
import Spacer from '../components/Spacer';
import DownArrow from '../components/DownArrow';
import { VoicesBubble } from '../components/VoicesBubble';
import { voicesData } from '../data/voices';
import { CTABlock  } from '../components/CTABlock';
import type { CTABlockData, CTAAnimation } from '../src/types/CTABlockData';
import { explainBlockDataMap } from '../data/ExplainBlock';

const ctaBlockData0: CTABlockData = {
  baseTextColor: '#000000',
  mainText: '地理はそんな状態になりやすい科目です。',
  highlightText: '',
  highlightBackgroundColor: '#ffb347',
  questionText: 'うちの子、塾は必要？',
  cta: {
    text: '無料診断で詳しく確認する',
    url: '/diagnosis',
    backgroundColor: '#F2E3A9', 
  },
  thumbnailImage: '/images/komatta.webp',
  animation: [ 'slide', 'shine', 'pulse'],
}
const ctaBlockData: CTABlockData = {
  baseTextColor: '#000000',
  mainText: '地理の点数は、\n演習問題の対策\nをしないと伸びません',
  highlightText: '演習問題の対策',
  highlightBackgroundColor: '#ffb347',
  questionText: 'じゃあ、どんな勉強法がいいの？',
  cta: {
    text: '無料診断で詳しく確認する',
    url: '/diagnosis',
    backgroundColor: '#F2E3A9', 
  },
  thumbnailImage: '/images/komatta.webp',
  animation: [ 'slide', 'shine', 'pulse'],
}

const ctaBlockData2 = {
  baseTextColor: '#000000',
  mainText:
    '参考書だけの勉強は、\n演習問題を1人で解ける子\nにはおすすめです',
  highlightText: '演習問題を1人で解ける子',
  highlightBackgroundColor: '#ffb347',
  questionText: 'うちの子、どっちだろう？\n無料診断で詳しく確認する',
  cta: {
    text: '無料診断で詳しく確認する',
    url: '/diagnosis',
    backgroundColor: '#F2E3A9',
  },
  thumbnailImage: '/images/komatta.webp',
  animation: [ 'slide', 'shine', 'pulse'],
} as const

const ctaBlockData3 = {
  baseTextColor: '#000000',
  buttonTextColor: '#fff',
  mainText: '「迷っているので個別で相談したい」',
  highlightText: undefined,
  highlightBackgroundColor: undefined,
  questionText: 'その場合は、',
  cta: {
    text: 'LINEでの無料相談',
    url: 'https://lin.ee/Nwh2C8u', 
    backgroundColor: '#06c755',
  },
  thumbnailImage: undefined,
  animation: ['fade', 'shine', 'pulse'],
} as const


const ctaBlockData4 = {
  baseTextColor: '#000000',
  buttonTextColor: '#fff',
  mainText: '地理専門塾だからこそできる指導で\n合格まで全力サポートします！',
  highlightText: undefined,
  highlightBackgroundColor: undefined,
  questionText: '料金のお見積もりを',
  cta: {
    text: 'LINEで相談する',
    url: 'https://lin.ee/Nwh2C8u', 
    backgroundColor: '#06c755',
  },
  thumbnailImage: undefined,
  animation: [ 'slide', 'shine', 'pulse'],
} as const




export default function GeographyLP() {
  return (
    <Layout>
      <main className="flex flex-col gap-24 bg-white font-bold [&_*]:font-bold">
        <b>
        {/* ===== HERO ===== */}
        <section className="pt-[12px] pb-[10px] px-[4px] text-center">

          {/* 吹き出し */}
          <VoicesBubble data={voicesData.top} />

          {/* タイトル */}
          <h1 className="text-[26px] font-black mb-[4px]">
            共通テスト地理対策
          </h1>

          {/* オレンジ帯 */}
          <h2 className="inline-block mb-3 bg-[#ffb347]
                          px-[22px] py-[14px]
                          rounded-[16px]
                          text-[24px] font-black">
            塾が必要かどうか
          </h2>

          {/* 3分 */}
          <h2 className="text-[20px] font-bold">
            <span className="text-[40px] font-black text-[#e6452d] mr-1">3</span>
            分で判断できます
          </h2>

          {/* イラスト */}
          <div className="mt-6 flex justify-center">
            <Image
              src="/images/AorB.webp"
              alt="教材イメージ"
              width={160}
              height={160}
              priority
            />
          </div>
        </section>

        {/* ===== 区切り ===== */}
        <ExplainBlock data={explainBlockDataMap.difference} />

        {/* ===== 悩み ===== */}
        <section className="px-4 py-10">
          <h2 className="text-center text-[20px] font-black mb-6">
            こんなお悩み、ありませんか？
          </h2>


          <Checklist data={checklistData.anxietyCheck} />
        </section>

        {/* ===== 共感まとめ＋赤帯 ===== */}
        <section className="px-4 text-center">

          <ExplainBlock data={explainBlockDataMap.empathySummary} />

          {/* CTA */}
          <CTABlock data={ctaBlockData0} />
        </section>

        {/* ===== 疑問① ===== */}
        <section className="px-[4px] py-[16px] text-center">

          <ExplainBlock data={explainBlockDataMap.question1} />

          {/* 矢印 */}
          <DownArrow count={4} areaHeight={120} size={64} />


          {/* 結論コピー */}
          <CTABlock data={ctaBlockData} />

        </section>

        {/* ===== 疑問② ===== */}
        <section className="px-4 py-20 text-center">

        <ExplainBlock data={explainBlockDataMap.question2} />

          {/* 矢印 */}
          <DownArrow count={4} areaHeight={120} size={64} />

          {/* 結論 */}
          <CTABlock data={ctaBlockData2} />

        </section>

        {/* ===== 保護者の声 導入 ===== */}
        <section className="px-4 py-20 text-center">
          <ExplainBlock data={explainBlockDataMap.diagnosis} />
          <h2 className="font-black text-[22px] leading-[1.7]">
            保護者の方からは<br />
            こんな声もいただいています
          </h2>
        </section>

        {/* ===== 保護者の声 ===== */}
        <section className="px-[4px] py-[24px] text-center">
          <VoicesBubble data={voicesData.parents} />

          {/* LINE相談導線 */}
            <CTABlock data={ctaBlockData3} />

          {/* 注意事項 */}
          <Checklist data={checklistData.consultNotes} />

        </section>

        {/* ===== RAPID+ 特徴 ===== */}
        <section className="bg-[#ffb347] px-4 py-24">
          <ExplainBlock data={explainBlockDataMap.explainRapidData} />
        </section>

        {/* ===== 最終CTA ===== */}
        <section className="px-4 py-24 text-center">
          <CTABlock data={ctaBlockData4} />
        </section>
        <Spacer large={50} small={150} />

      </b>
      </main>
    </Layout>
  );
}
