import { useRouter } from "next/router";
import styles from "../src/styles/404.module.css"; // CSS Modulesを使う

export default function Custom404() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.blackboard}>
                <h1 className={styles.title}>お探しのページは見つかりません 🏫</h1>
                <p className={styles.text}>ここは間違ったURLが入力されたようです</p>
                <p className={styles.hint} onClick={() => router.push("/")}>
                    👉 <strong>正しいページに戻るには、ここをクリック！</strong> 
                </p>
            </div>
        </div>
    );
}
