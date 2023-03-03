import Header from "../../components/common/header";
import { useRouter } from "next/router";
import styles from "./blog_id.module.scss";
import { GetBlogCont } from "../../service";
import { useEffect, useState } from "react";
import { OneBlogType } from "../../components/blog/types";
import AffixBack from "../../components/common/affix/affix-back";
import AffixCopy from "../../components/common/affix/affix-copy";
// 代码高亮
import "highlight.js/styles/vs2015.css";

const Blog = () => {
    const router = useRouter();
    const { blog_id } = router.query;

    const [blog, setBlog] = useState<OneBlogType>();

    const getData = async () => {
        const res = await GetBlogCont(blog_id as string);
        if (res) {
            const data = res.data;
            setBlog(data);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Header title={blog?.title || "日志详情"} />
            <main>
                <div className={styles.blog_cont}>
                    <h3 className={styles.head}>{blog?.title}</h3>
                    <div className={styles.blogcontEditor}>
                        <div dangerouslySetInnerHTML={{ __html: blog?.blogcont }}></div>
                    </div>
                </div>
                <AffixCopy
                    copyUrl={`https://www.xiaxiazheng.cn/blog/${blog && btoa(decodeURIComponent(blog.blog_id))}`}
                />
                <AffixBack backUrl={"/blog"} />
            </main>
        </>
    );
};

export default Blog;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
