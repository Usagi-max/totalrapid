import path from "path"//場所を読み取る
import fs from "fs"//ファイルの中身を読み取る
import matter from "gray-matter"//メタデータを読み取る
import { remark } from "remark";
import  html  from "remark-html";

const postsDirectory = path.join(process.cwd(),"posts")

//mdファイルのデータを取り出す
export function getPostsData(){
    //const fetchData = await fetch("endpoint")

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) =>{
        const id = fileName.replace(/\.md$/,"");//ファイル名

        //マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory,fileName);
        const fileContents = fs.readFileSync(fullPath,"utf8");

        const matterResult = matter(fileContents);

        //idとデータを返す
        return {
            id,
            ...matterResult.data,
        };
    });
    return allPostsData;
}

//getStaticPatnでreturnで使うpathを取得する
export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) =>{
        return {
            params: {
                id: fileName.replace(/\.md$/,""),
            },
        };
    });
}

//idに基づいてブログ情報を取得する
export async function getPostData(id){

    const fullPath = path.join(postsDirectory,`${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf8")

    const matterResult = matter(fileContent);

    const blogContent = await remark().use(html).process(matterResult.content);

    const blogContentHTML = blogContent.toString();

    return{
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}