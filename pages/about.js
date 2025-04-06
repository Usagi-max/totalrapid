import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../src/styles/About.module.css";
import ChatMessage from "../components/ChatMessage";
import ArrowButton from "../components/ArrowButton";

export default function About() {
  return (
    <>
      <Head>
        <title>学習塾RAPID | 私たちについて</title>
      </Head>
      <div className={styles.body}>
        {/* <div className={styles.lp_head_container}>
          <div className={styles.lp_head_item1}><img src="/images/girl_studying.png" alt="girl_studying" /></div>
          <div className={styles.lp_head_item2}>
            <img src="/images/3month_power.png" alt="3month_power"style={{ width: "100%", height: "auto", display: "block" }} />
            <img src="/images/accepting applications.png" alt="accepting applications" style={{ width: "100%", height: "auto", display: "block" }}/>
            <p className={styles.highlightText}><a>先着10名様</a>入塾金&初回体験授業無料キャンペーン実施中</p>
            <div className={styles.glowText}>ぼやけた白い影の黒文字</div>
          </div>
        </div> */}
        <div className={styles.lp_head_container}>
          <picture>
            <source srcSet="/images/lp_head_phone.png" media="(max-width: 480px)" />
            <source srcSet="/images/lp_head_phone.png" media="(max-width: 768px)" />
            <img src="/images/lp_head_pc.png" alt="Responsive" className={styles.lp_head_image} />
          </picture>
        </div>
        <h></h>
        <div className={styles.lp_about_container}>
          <div className={styles.lp_about_item1}>
            <div>「学校や塾だけでは不安」</div>
            <div>「勉強しているのにうまく結果が出ない」</div>
            <div>「うちの子、勉強の才能がないのかな」</div>
            <br></br>
            <div style={{ color:"black",fontWeight: "bold"}}>そのお悩み、もしかすると<span>間違った方法で学習していること</span>が原因かもしれません。</div>
            <br></br>
            <div>実は、成績が伸びている人の学習習慣には、<span>いくつかの共通点</span>があることが最近の研究で明らかになっているんです！</div>
            <div>ただし、幼少期から身につけた習慣を<span>自分の力だけで変えることは困難</span>だと言われています。</div>
            <div>学習塾RAPIDでは、RAPIDメソッドによる指導と家庭学習サポートで、お子様が正しい学習習慣を身につけるよう支援します。</div>
            <div>講師と一緒に正しいステップで学習することを通して、最終的には<span>自分1人で戦略的に</span>学習を進めることができるようになります。</div>
          </div>
          <div className={styles.lp_about_item2}>
            <div>
              <h4>ステップ１</h4>
              <h2>正しい学習方法が<br></br>できない・わからない</h2>
            </div>
            <p style={{ display: "inline-block"}}>▼</p>
            <div>
              <h4>ステップ２</h4>
              <h2>講師と一緒に<br></br>正しく学習できる</h2>
              <p>支援１　学習を正しく進めるためのRAPIDメソッド</p>
              <p>支援２　学習を毎日継続するための家庭学習サポート</p>
            </div>
            <p  style={{ display: "inline-block"}}>▼</p>
            <div>
              <h4>ステップ３</h4>
              <h2>自分1人で正しく<br></br>学習できる</h2>
            </div>
          </div>
        </div>


        <h1 id="point1">RAPIDメソッドとは</h1>
        <div className={styles.lp_about_container}>
          <div className={styles.lp_about_item1}>
            <div><span>RAPIDメソッド</span>は、子どもが本物の学習力を身につけるために開発されたものです。</div>
            <div>この学習メソッドを使うことで、勉強が苦手な子どもでも自ら進んで計画を立て、学習に取り組み、改善できるようになります。</div>
            <div>学習塾RAPIDでは、<span>学習を５つのステップ</span>に分け、各ステップで学習の質と量を高めるためのサポートを行なっています。</div>
          </div>
          <div className={styles.lp_about_item1}><div><img src="/images/rapidmethod_cercle.png" alt="rapidmethod_cercle" /></div></div>
        </div>

        <h1 id="point2">　　家庭学習を充実させるトータルサポート</h1>
        <div className={styles.lp_total_container}>
          <div className={`${styles.lp_total_item} ${styles.item1}`} >
            <h4>家庭学習サポート①</h4>
            <h2>オンライン自習室</h2>
            <p>やる気のない日でも学習を継続できるように、<span>塾生が無料で使えるオンライン自習室</span>を毎日開設しています。他の生徒が頑張っている様子を見ることができるので、集中して学習に取り組むことができます。</p>
          </div>
          <div className={`${styles.lp_total_item} ${styles.item2}`}>
            <img src="/images/using pc.jpg" alt="using pc" />
          </div>
          <div className={`${styles.lp_total_item} ${styles.item3}`}>
            <img src="/images/using phone.jpg" alt="using phone" />
          </div>
          <div className={`${styles.lp_total_item} ${styles.item4}`}>
            <h4>家庭学習サポート②</h4>
            <h2>学習支援ツールRAPI-LA</h2>
            <p>学習塾RAPIDでは、RAPIDメソッドを<span>指導日以外の家庭学習</span>でも活用できるように<span>学習支援ツールRAPI-LA</span>を導入しています。RAPI-LAを使うことで５つのステップ通りに学習を進め、自分の学習成果を確認することができます。</p>
          </div>
        </div>
        <h1>R英検準１級合格を目指すAさんの例</h1>
          <div className={styles.container}>
            <div className={styles.item}>
              <p>学習塾RAPIDでは、RAPIDメソッドと家庭学習サポートを通じて、お子様の学習を支援します。
              ここでは、英検準1級合格を目指すAさんの具体例をもとに、指導日とそれ以外の日の家庭学習の流れを見ていきましょう！</p>
              <table className={styles.tableContainer}>
                <tbody>
                  <tr>
                    <th>月</th>
                    <th>火</th>
                    <th>水</th>
                    <th>木</th>
                    <th>金</th>
                    <th>土</th>
                    <th>日</th>
                  </tr>
                  <tr>
                    <td>指導日</td>
                    <td>速読</td>
                    <td>スピーキング</td>
                    <td>速読</td>
                    <td>リスニング</td>
                    <td>リーディング</td>
                    <td>ライティング</td>
                  </tr>
                  </tbody>
              </table>
            </div>
          </div>

          <div className={styles.lp_cycle_container} style={{ backgroundColor:"#FFF0D7"}}>
            <h2>指導日（月曜日）</h2>
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


          <div className={styles.lp_cycle_container} style={{ backgroundColor:"rgba(236, 105, 72, 0.15)"}}>
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
              message="もう少し具体的に設定してみましょう。中テスト結果によれば、Aさんは現在1分間に読める単語数が100くらいだそうです。
  "
              icon="/images/teacher naname.jpg"
              isUser={false}
            />
            <ChatMessage
              message="「1分間に120単語を読むことができるようになる」を目標にします！"
              icon="/images/student happy.jpg"
              isUser={true}
            />
          </div>

          <div className={styles.lp_cycle_container} style={{ backgroundColor:"rgba(196, 15, 36, 0.15)"}}>
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

          <div className={styles.lp_cycle_container} style={{ backgroundColor:"rgba(29, 33, 136, 0.15)"}}>
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

          <div className={styles.lp_cycle_container} style={{ backgroundColor:"rgba(0, 159, 233, 0.15)"}}>
            <h2>家庭学習日（火曜日〜日曜日）</h2>
            <h3 style={{ backgroundColor: "#00A1E9"}}>　STEP1 Reflect　自分の課題を振り返る </h3>
            <h4>指導日の最初の時間に、先週の学習成果を中テストで確認し、自分の苦手分野を振り返ります。</h4>

            <ChatMessage
              message="今日は火曜日だから、先生と約束した通り、オンライン自習室を利用して速読トレーニングをしよう！
"
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
        <div className={styles.container}>
          <div className={styles.item}>
          <h4>①英検対策コース</h4>
          <p>最短３ヶ月で英検合格と本物の学習力を手にいれる短期間のコース。RAPIDメソッドの効果を試したいあなたにおすすめ。  </p>
          </div>
          <div className={styles.item} >
          <img src="/images/rabbit.png" alt="rabbit" style={{ width: "20%", height: "auto" }}/>
          <ArrowButton text="英検対策コース　３〜4ヶ月" width="80%" />
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.item}>
          <h4>②入試対策コース</h4>
          <p>学習習慣を着実に改善しつつ高校入試・大学入試合格を目指す長期間のコース。部活や習い事と両立しながら学力を伸ばしたいあなたにおすすめ。  </p>
          </div>
          <div className={styles.item}>
          <img src="/images/turtle.png" alt="turtle" style={{ width: "20%", height: "auto" }}/>
          <ArrowButton text="入試対策コース　4ヶ月〜" width="100%"/>
          </div>
        </div>

        <div style={{ backgroundColor:"#FFF0D7"}}>
          
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
        </div>
      </div>
    </>
  );
}
