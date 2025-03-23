import Link from "next/link";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import UtilStyles from "../../src/styles/utils.module.css";
import { marked } from "marked"; // マークダウンをHTMLに変換
import DOMPurify from "dompurify";
import { format } from "date-fns"; // 日付フォーマット用

export async function getStaticPaths() {
    const ids = getAllPostIds();

    const paths = ids.map(id => ({
        params: { id }
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params?.id);

    return {
        props: {
            postData,
        },
    };
}

export default function Post({ postData }) {
    const sanitizedHTML = DOMPurify.sanitize(marked(postData.blogContentMarkdown)); // XSS対策済みHTML
    const formattedDate = format(new Date(postData.date), "yyyy/MM/dd"); // 日付フォーマット統一

    return (
        <Layout>
            <article>
                <h1 className={UtilStyles.headingX1}>{postData.title}</h1>
                <div className={UtilStyles.lightText}>{formattedDate}</div>
                <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
            </article>
        </Layout>
    );
}
