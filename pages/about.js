import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../src/styles/About.module.css";
import ChatMessage from "../components/ChatMessage";
import ArrowButton from "../components/ArrowButton";
import GradientHeading from '../components/GradientHeading';
import Image from "next/image";
import FadeInImage from "../components/FadeInImage";
import PointItem from '../components/PointItem';
import Spacer from '../components/Spacer';
import BreakOnSmallScreen from "../components/BreakOnSmallScreen";


export default function About() {
  return (
    <>
      <Head>
        <title>学習塾RAPID</title>
        <link rel="icon" href="/images/アイコン　文字なし.png" />
      </Head>
      <div className={styles.body}>
        <div className={styles.lp_head_container}>
          <picture>
            <source srcSet="/images/lp_head_phone.png" media="(max-width: 768px)" />
            <img src="/images/lp_head_pc.png" alt="Responsive" className={styles.lp_head_image} />
          </picture>
        </div>

        <div className={`${styles.lp_about_container} ${styles.contentArea}`}>
          <div className={styles.lp_about_item1}>
            <div style={{ position: "relative", width: "100%", justifyContent: "center"}}>
              <FadeInImage
                src="/images/student teacher.jpeg"
                alt="Another Image"
                width={600}
                height={400}
                delay={0.4}
              />
            </div>
          </div>
          <div className={styles.lp_about_item1} style={{display: "flex", flexDirection: "column",alignItems: "flex-start", alignContent:"flex-start"}}>    
            <GradientHeading delay={0.0}>学習塾RAPIDは</GradientHeading>
            <GradientHeading delay={0.1}>お子様の学習習慣の改善に</GradientHeading>
            <GradientHeading delay={0.2}>フォーカスした学習塾です。</GradientHeading>
            <br></br>
            <p>「学校や塾だけでは不安」</p>
            <p>「勉強しているのにうまく結果が出ない」</p>
            <br></br>
            <p >学習塾RAPIDでは、最新の学習科学に基づき、1人ひとりに合わせた最適なカリキュラムを作成します。</p>
            <p >このカリキュラムに沿って学習することで、最終的にはお子様が自分1人で正しく学習できるようになります。</p>
          </div>
        </div>

        <div style={{ backgroundColor:"#FFF0D7" ,   width:"100%", paddingBottom:"80px"}}>
          <div className={styles.contentArea}  style={{display: "flex", justifyContent: "center"}}>
            <h1>学習習慣を改善するステップ</h1>
          </div>
          <div className={styles.lp_flow_container} style={{display: "flex", flexDirection: "row",alignItems: "center", alignContent:"middle", maxWidth:"1080px"}} >
            <div className={styles.lp_flow_item} >
              <h4 >STEP1</h4>
              <p style={{padding:"10px" }}>正しい学習方法が<br></br>できない・わからない</p>
              <Image 
                src="/images/study__.png" 
                alt="using pc" 
                width={100}
                height={100} 
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div style={{ display: "inline-block",color:"#F39700", transform: "rotate(-90deg) scaleX(2)"}}>▼</div>
            <div className={styles.lp_flow_item} >
              <h4>STEP2</h4>
              <p style={{padding:"10px" }}>RAPIDと一緒に<br></br>正しく学習できる</p>
              <Image 
                src="/images/study_with.png" 
                alt="using pc" 
                width={100}
                height={100} 
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div style={{ display: "inline-block",color:"#F39700", transform: "rotate(-90deg) scaleX(2)"}}>▼</div>
            <div className={styles.lp_flow_item} >
              <h4>STEP3 </h4>
              <p style={{padding:"10px" }}>自分1人で<br></br>正しく学習できる</p>
              <Image 
                src="/images/study_self.png" 
                alt="using pc" 
                width={100}
                height={100} 
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>

        <h1>学習塾RAPIDが選ばれる理由</h1>
        <Spacer height={30} />
        <h3  id="point1">REASON1</h3>
        <h2 style={{textAlign: "center"}}>RAPIDメソッドによる<BreakOnSmallScreen />講師とのレッスン</h2>
        <div className={`${styles.lp_circle_container} ${styles.contentArea}`}>
          <div className={styles.lp_circle_item1}>
            <div><h3>RAPIDメソッドとは</h3></div>
            <div>学習塾RAPIDでは、RAPIDメソッドを利用したレッスンを週に1回・90分行います。</div>
            <div>このメソッドは、子どもが<strong>本物の学習力</strong>を身につけるために開発されたものです。</div>
            <div>５つのステップを意識することで、<strong>勉強が苦手</strong>な子どもでも<strong>自ら進んで</strong>計画を立て、学習に取り組み、改善できるようになります。</div>
          </div>
          <div className={styles.lp_circle_item1}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <FadeInImage
                src="/images/rapidmethod_cercle.png" 
                alt="rapidmethod_cercle"
                width={400}
                height={400}
                delay={0.4}
              />
            </div>
          </div>
        </div>
        <Spacer height={30} />
        <h3  id="point2">REASON2</h3>
        <h2 style={{textAlign: "center"}}>家庭学習を充実させる<BreakOnSmallScreen />トータルサポート</h2>
        <div className={`${styles.lp_total_container} ${styles.contentArea}`}>
          <div className={`${styles.lp_total_item} ${styles.item1}`} >
            <h4>家庭学習サポート①</h4>
            <h2>オンライン自習室</h2>
            <p>やる気のない日でも学習を継続できるように、<strong>塾生が無料で使えるオンライン自習室</strong>を毎日開設しています。他の生徒が頑張っている様子を見ることができるので、集中して学習に取り組むことができます。</p>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item2}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/using pc.jpg"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item3}`}>
            <div style={{ position: "relative", width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Image
                src="/images/using phone.jpg"
                alt="week pc"
                width={468}         // 元画像の横幅
                height={312}         // 元画像の高さ
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item4}`}>
            <h4>家庭学習サポート②</h4>
            <h2>学習支援ツールRAPI-LA</h2>
            <p>学習塾RAPIDでは、RAPIDメソッドを<strong>指導日以外の家庭学習</strong>でも活用できるように<strong>学習支援ツールRAPI-LA</strong>を導入しています。RAPI-LAを使うことで５つのステップ通りに学習を進め、自分の学習成果を確認することができます。</p>
          </div>
        </div>
        <h1>スケジュールの具体例</h1>
          <div className={styles.container}>
            <div className={styles.item}>
              <p>学習塾RAPIDでは、RAPIDメソッドと家庭学習サポートを通じて、お子様の学習を支援します。</p>
              <p>ここでは、英検準2級合格を目指すAさんの事例をもとに、具体的な学習の流れについてご紹介します。</p>
              <p>※学習時間はあくまでも目安です。このスケジュールでは6ヶ月で合格を目指す場合を想定しています。</p>
              <Spacer height={15} />
              <picture>
                <source srcSet="/images/week-phone.png" media="(max-width: 768px)" />
                <img src="/images/week-pc.png" alt="Responsive" />
              </picture>
              <Spacer height={15} />
              <PointItem label="POINT1" text="週1回・90分間の講師とのレッスン" content="学習塾RAPIDでは講師とのレッスンで１週間の学習計画を立てます。Aさんは月曜日をレッスン日、それ以外の曜日を家庭学習日としています。"/>
              <PointItem label="POINT2" text="RAPI-LAを通じて出題される毎日の復習課題" content="家庭学習の成果を確認するために、復習課題が出題されます。Aさんは英検合格の基礎となる単語学習を2日に１回復習することにしています。"/>
              <PointItem label="POINT3" text="オンライン自習室を利用した学習" content="家庭学習日にはオンライン自習室を利用することができます。Aさんは苦手な速読トレーニングに集中するために火曜日と木曜日にオンライン自習室を利用するようです。"/>
              <p>それでは、Aさんがこの学習計画をどのように立て、学習を実践していったのかを講師との具体的なやりとりから見ていきましょう！</p>
            </div>
          </div>

          <div className={`${styles.lp_cycle_container} ${styles.contentArea}`} style={{ backgroundColor:"#FFF0D7"}}>
            <h2>レッスン日（月曜日）</h2>
            <h3 style={{ backgroundColor: "#F39700"}}>　STEP1 Reflect　自分の課題を振り返る</h3>
            <h4>指導日の最初の時間に、先週の学習成果を中テストで確認し、自分の苦手分野を振り返ります。</h4>
            <ChatMessage
              message="Aさんはリーディングが苦手なようですね。何か困っていることはありますか？"
              icon="/images/teacher naname.jpg"
              isUser={false}
            />
            <ChatMessage
              message="リーディングはいつも文章を読んでいる途中で時間が来ちゃうんですよね。"
              icon="/images/student trouble.jpg"
              isUser={true}
            />
            <ChatMessage
              message="なるほど、それでは読むスピードが遅いことが苦手な原因かもしれないですね"
              icon="/images/teacher yoko.jpg"
              isUser={false}
            />
            <ChatMessage
              message="確かに読むスピードをもう少し早くすれば問題をしっかり解けるかもしれません。"
              icon="/images/student fight.jpg"
              isUser={true}
            />
          </div>


          <div className={`${styles.lp_cycle_container} ${styles.contentArea}`} style={{ backgroundColor:"rgba(236, 105, 72, 0.15)"}}>
            <h3 style={{ backgroundColor: "#EC6848"}}>　STEP2 Aim　目標を設定する</h3>
            <h4>自分の苦手分野を振り返ったら、それを元に講師と今週の学習目標を設定します。</h4>
            <ChatMessage
              message="今週の学習目標はどうしますか？"
              icon="/images/teacher mae.jpg"
              isUser={false}
            />
            <ChatMessage
              message="「英文を速く読むことができるようにする」という目標にします！"
              icon="/images/student fight.jpg"
              isUser={true}
            />
            <ChatMessage
              message="もう少し具体的に設定してみましょう。中テスト結果によれば、Aさんは現在1分間に読める単語数が100くらいだそうです。  "
              icon="/images/teacher naname.jpg"
              isUser={false}
            />
            <ChatMessage
              message="「1分間に120単語を読むことができるようになる」を目標にします！"
              icon="/images/student happy.jpg"
              isUser={true}
            />
          </div>

          <div className={`${styles.lp_cycle_container} ${styles.contentArea}`}  style={{ backgroundColor:"rgba(196, 15, 36, 0.15)"}}>
            <h3 style={{ backgroundColor:"#C40F24"}}>　STEP3 Plan　計画と戦略を立てる</h3>
            <h4>今週の目標を達成するための具体的な計画と戦略を立てます。</h4>
            <ChatMessage
              message="1分間に120単語を読むためにはどのような対策が必要でしょうか？"
              icon="/images/teacher yoko.jpg"
              isUser={false}
            />
            <ChatMessage
              message="教材の中にある「速読トレーニング」で集中的して練習したいです。"
              icon="/images/student trouble.jpg"
              isUser={true}
            />
            <ChatMessage
              message="良い戦略だと思います！他の４技能の対策も同時に進めていきたいので、どのように学習計画を立てますか？"
              icon="/images/teacher mae.jpg"
              isUser={false}
            />
            <ChatMessage
              message="火曜日と木曜日に速読、それ以外の曜日に４技能のトレーニングをします！。"
              icon="/images/student happy.jpg"
              isUser={true}
            />
          </div>

          <div className={`${styles.lp_cycle_container} ${styles.contentArea}`}  style={{ backgroundColor:"rgba(29, 33, 136, 0.15)"}}>
            <h3 style={{ backgroundColor: "#1D2088"}}>　STEP4 Install　環境を整える</h3>
            <h4>集中できる環境と継続できる仕組みをつくります。</h4>
            <ChatMessage
              message="Aさんは苦手な速読トレーニングをどのように乗り越えますか？"
              icon="/images/teacher naname.jpg"
              isUser={false}
            />
            <ChatMessage
              message="速読の日はオンライン自習室に入って集中できるような環境をつくりたいです。"
              icon="/images/student trouble.jpg"
              isUser={true}
            />
            <ChatMessage
              message="それだとしっかりと集中できそうですね。苦手な分野なので、やり遂げることができたら自分にご褒美を用意してみませんか？"
              icon="/images/teacher yoko.jpg"
              isUser={false}
            />
            <ChatMessage
              message="良いですね！じゃあちゃんとできたらアイスを買うことにします。よし、頑張ろう！！"
              icon="/images/student fight.jpg"
              isUser={true}
            />
          </div>

          <div className={`${styles.lp_cycle_container} ${styles.contentArea}`} style={{ backgroundColor:"rgba(0, 159, 233, 0.15)"}}>
            <h2>家庭学習日（火曜日〜日曜日）</h2>
            <h3 style={{ backgroundColor: "#00A1E9"}}>　STEP5 Do　学習を実行する</h3>
            <h4>指導日の最初の時間に、先週の学習成果を中テストで確認し、自分の苦手分野を振り返ります。</h4>

            <ChatMessage
              message="今日は火曜日だから、先生と約束した通り、オンライン自習室を利用して速読トレーニングをしよう！"
              icon="/images/student fight.jpg"
              isUser={true}
            />
            <ChatMessage
              message="勉強の成果が出ているかなぁ。RAPI-LAでチェックした方が良いかも。"
              icon="/images/student trouble.jpg"
              isUser={true}
            />
            <ChatMessage
              message="あ、リーディングの点数が上がってる！！読むスピードも速くなってきているし、次はもっと問題が解けるように頑張りたいな。"
              icon="/images/student happy.jpg"
              isUser={true}
            />
          </div>
        <h1>コース概要</h1>
        <h4>学習塾RAPIDでは、目的に合わせた２つのコースを選ぶことができます。</h4>
        <div className={`${styles.container} ${styles.contentArea}`} >
          <div className={styles.item}>
          <h4>①英検対策コース</h4>
          <p>最短３ヶ月で英検合格と本物の学習力を手にいれる短期間のコース。RAPIDメソッドの効果を試したいあなたにおすすめ。  </p>
          </div>
          <div className={styles.item} >
          <img src="/images/rabbit.png" alt="rabbit" style={{ width: "20%", height: "auto" }}/>
          <ArrowButton text="英検対策コース　３〜4ヶ月" width="80%" />
          </div>
        </div>

        <div className={`${styles.container} ${styles.contentArea}`}>
          <div className={styles.item}>
          <h4>②入試対策コース</h4>
          <p>学習習慣を着実に改善しつつ高校入試・大学入試合格を目指す長期間のコース。部活や習い事と両立しながら学力を伸ばしたいあなたにおすすめ。  </p>
          </div>
          <div className={styles.item}>
          <img src="/images/turtle.png" alt="turtle" style={{ width: "20%", height: "auto" }}/>
          <ArrowButton text="入試対策コース　4ヶ月〜" width="100%"/>
          </div>
        </div>
        <Spacer height={30} />

        <div style={{ backgroundColor:"#FFF0D7", width:"100%" ,display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center"}}>
          <h1 style={{textAlign: "center"}}>申し込み方法</h1>
          <div style={{ backgroundColor:"#FFF0D7"}}>
            <div className={`${styles.consultation_container} ${styles.contentArea}`}>
              <div>
                <div>
                  <h2>まずは無料のオンライン相談</h2>
                  <p>次の3点について、代表講師が丁寧にご対応させていただきます。</p>
                  <ul>
                    <li>①お子様の学習状況と今後目指したい目標についてのヒアリング</li>
                    <li>②お子様に合わせた最適なカリキュラムと学習プランのご提案</li>
                    <li>③コースのご案内と料金のお見積もり</li>
                  </ul>
                </div>
                <img src="/images/kobetu soudan.jpeg" alt="相談の様子" />
              </div>

              <div style={{ backgroundColor:"#FFF0D7"}}>
                <div style={{ display: "inline-block",color:"#F39700", transform: "scaleX(2)"}}>▼<br></br>▼<br></br>▼</div>
              </div>

              <div>
                <p>さらに、オンライン相談をお申し込みいただいた方には、毎日の勉強がかわる！3大無料特典」をお届けしています。</p>

                <div>
                  <div>
                    <span>特典1</span>
                    <p>ベストな学習法がわかる！</p>
                    <p>学習タイプ診断</p>
                  </div>
                  <div>
                    <span>特典2</span>
                    <p>集中できる環境がわかる！</p>
                    <p>学習環境コンサル</p>
                  </div>
                  <div>
                    <span>特典3</span>
                    <p>習慣化のコツがわかる！</p>
                    <p>体験授業</p>
                  </div>
                </div>

                <div>
                  無料カウンセリングに申し込んで特典を受け取る
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* <div style={{ backgroundColor:"white"}}>
          <div className={styles.lp_flow_container} style={{flexDirection: "column",textAlign:"center"}} >
            <h1>ご利用の流れ</h1>
            <div className={styles.lp_flow_item}>
                <h4 ><b>STEP1</b>　無料保護者面談</h4>
                <p>フォームにてお申し込み後、お子様の学習状況や合格目標に基づき、カリキュラムや見積もりをご提案させていただきます。面談はオンラインで行いますが、都内在住の場合はスタッフが直接お伺いいたします。</p>
              </div>
              <div style={{ display: "inline-block",color:"#F39700", transform: "scaleX(2)"}}>▼</div>
              <div className={styles.lp_flow_item}>
                <h4><b>STEP2</b>　家庭訪問学習環境コンサル</h4>
                <p>スタッフがご自宅を訪問し、３者面談を行います。お子様の学習タイプやモチベーションタイプを診断し、最も効果的な学習方法についてご提案させていただきます。また、ご希望の場合は学習環境をチェックし、集中できる環境を整えるためのアドバイスも行います。オンライン指導に必要な機材の設定についてもサポートいたします。</p>
              </div>
              <div style={{ display: "inline-block",color:"#F39700", transform: "scaleX(2)"}}>▼</div>
              <div className={styles.lp_flow_item}>
                <h4><b>STEP3 </b>　オンライン指導</h4>
                <p>日程調整や講師の選定が完了した後、オンライン指導がスタートします。</p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
