import React from "react";
import styles from "./CourseTable.module.css";

const CourseTable = () => {
  return (
    <div className={styles.container}>
      {/* <h2 className={styles.heading}>指導料金とコースの特徴</h2> */}
      <p className={styles.description}>
        サービス内容
        <br />□ 講師との１対１のレッスン（月４回・90分間）
        <br />□ 毎週の週間計画表と毎日の課題の作成
        <br />□ 学習支援ツールRAPI-LAによるサポート
        <br />□ オンライン自習室 
        <br />□ 学習力養成講座
        <br />□ 家庭訪問と学習環境コンサル（希望者のみ）
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>コース</th>
            <th>1ヶ月の指導料金</th>
            <th>コースの特徴</th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.highlight}>
            <td>1ヶ月コース</td>
            <td>50000円/月</td>
            <td>短期間でRAPIDメソッドの効果を体験できるコースです。英検や定期試験の直前対策を行いたい方にもおすすめです。</td>
          </tr>
          <tr className={styles.highlight}>
            <td>2ヶ月コース</td>
            <td>45000円/月</td>
            <td>苦手分野に集中して対策できるコースです。限られた期間で英検や定期試験の得点アップを目指したい方におすすめです。</td>
          </tr>
          <tr className={styles.recommendRow}>
            <td className={styles.recommendRow}>3ヶ月コース</td>
            <td>40000円/月</td>
            <td>学力の定着を図りながら本物の学習力を身につける基本のコースです。英検や定期試験の対策をゼロから始めたい方におすすめです。</td>
          </tr>
          <tr>
            <td>長期コース（4ヶ月〜）</td>
            <td>35000円/月</td>
            <td>学習習慣を改善しながら着実に学力を伸ばしていくコースです。部活や習い事と両立しつつ、英検や入試の合格を目指したい方におすすめです。</td>
          </tr>
        </tbody>
      </table>

      <ul className={styles.notes}>
        <li>※各コースのサービス内容は同じものになります。</li>
        <li>※料金は税込価格です。</li>
        <li>※上記の料金は英検、定期試験、高校入試の対策を想定しています。大学入試の対策の場合、別途追加料金が発生します。詳しくはスタッフまでお問い合わせください。</li>
      </ul>
    </div>
  );
};

export default CourseTable;
