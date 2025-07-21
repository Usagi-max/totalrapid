import React from "react";
import styles from "./CourseTable.module.css";

const CourseTable = () => {
  return (
      <div className={styles.container}>
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>サービス内容</h2>

      <div className={styles.serviceTable}>
        <ul className={styles.serviceList}>
          <li><span className={styles.checkMark} />講師との１対１のレッスン（月４回・90分間）</li>
          <li><span className={styles.checkMark} />毎週の週間計画表と毎日の課題の作成</li>
          <li><span className={styles.checkMark} />学習支援ツールRAPI-LAによるサポート</li>
          <li><span className={styles.checkMark} />オンライン自習室</li>
          <li><span className={styles.checkMark} />学習力養成講座</li>
          <li><span className={styles.checkMark} />家庭訪問と学習環境コンサル（希望者のみ）</li>
        </ul>
      </div>
      
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>料金一覧</h2>
      <div className={styles.priceTableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>コース</th>
              <th>指導料金</th>
              <th>コースの特徴</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1ヶ月コース</td>
              <td>50000円/月</td>
              <td>短期間でRAPIDメソッドの効果を体験できるコース。英検や定期試験の直前対策にも。</td>
            </tr>
            <tr>
              <td>2ヶ月コース</td>
              <td>45000円/月</td>
              <td>苦手分野に集中して対策可能。限られた期間で得点アップを目指す方向け。</td>
            </tr>
            <tr className={styles.recommendRow}>
              <td>
                3ヶ月コース <span className={styles.recommendInline}>おすすめ</span>
              </td>
              <td>40000円/月</td>
              <td>学力定着と学習力を養う基本のコース。ゼロからの英検・試験対策にも◎</td>
            </tr>
            <tr>
              <td>長期コース（4ヶ月〜）</td>
              <td>35000円/月</td>
              <td>学習習慣改善＆安定的に成績UP。部活との両立や入試対策にも。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ul className={styles.notes}>
        <li>※各コースのサービス内容は同一です。</li>
        <li>※表示価格は税込です。</li>
        <li>※大学入試対策には追加料金がかかります。詳細はお問い合わせください。</li>
      </ul>
    </div>
  );
};

export default CourseTable;
