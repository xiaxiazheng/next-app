import Header from "../../components/header";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { Input, Pagination } from "antd";
import PreviewImages from "../../components/preview-images";
import UploadImageFile from "../../components/upload-image-file";
import MyModal from "../../components/my-modal";
import { getMaoList } from "../../service/mao";
import { IMao } from "../../components/mao/types";
import { getImageListByOtherId, ImageType } from "../../service/image";

const { Search } = Input;

const MaoPu = () => {
    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const pageSize = 10;
    const [keyword, setKeyword] = useState<string>();

    const [list, setList] = useState<IMao[]>([]);
    const [showList, setShowList] = useState<IMao[]>([]);

    // 处理猫咪的父母层级
    const handleParent = (list: IMao[]) => {
        const map: any = {};
        list.forEach((item) => {
            map[item.mao_id] = item;
        });
        // 给孩子带上父母，给父母带上孩子
        list.forEach((item) => {
            if (item.father_id) {
                if (map[item.father_id].children) {
                    map[item.father_id].children.push(map[item.mao_id]);
                } else {
                    map[item.father_id].children = [map[item.mao_id]];
                }
                item.fatherObject = map[item.father_id];
            }
            if (item.mother_id) {
                if (map[item.mother_id].children) {
                    map[item.mother_id].children.push(map[item.mao_id]);
                } else {
                    map[item.mother_id].children = [map[item.mao_id]];
                }
                item.motherObject = map[item.mother_id];
            }
        });

        return list;
    };

    // 获取猫的数据
    const getData = async () => {
        const res = await getMaoList();
        if (res) {
            const list: any = res.data.sort(
                (a: any, b: any) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime()
            );
            list.map((item: IMao) => {
                item.key = item.mao_id;
                item.title = item.name;
            });
            setList(handleParent(list));
            setTotal(list.length);
        }
    };

    const getShowList = (pageNo: number) => {
        const l = keyword ? list.filter((item) => item.name.indexOf(keyword) !== -1) : list;
        setTotal(l.length);
        setShowList(l.slice((pageNo - 1) * 10, 10 * pageNo));
    };

    useEffect(() => {
        if (list?.length !== 0) {
            getShowList(pageNo);
        } else {
            setShowList([]);
        }
    }, [list, pageNo]);

    useEffect(() => {
        if (pageNo === 1) {
            getShowList(pageNo);
        } else {
            setPageNo(1);
        }
    }, [keyword]);

    useEffect(() => {
        getData();
    }, []);

    const handleClick = (item: IMao) => {
        active?.mao_id === item?.mao_id ? setActive(undefined) : setActive(item);
    };

    const [active, setActive] = useState<IMao>();

    const Item = (props: { item: IMao; isShowAll?: boolean }) => {
        const { item, isShowAll = false } = props;
        if (!item) return null;

        const [headList, setHeadList] = useState<ImageType[]>([]);

        // 获取猫咪头像照片
        const getHeadImgList = async (head_img_id: string) => {
            const res = await getImageListByOtherId(head_img_id, localStorage.getItem("username"));
            if (res) {
                setHeadList(res);
            }
        };
        // 获取该猫咪所有照片
        const [imgList, setImgList] = useState<ImageType[]>([]);
        const getOtherImgList = async (mao_id: string) => {
            const res = await getImageListByOtherId(mao_id, localStorage.getItem("username"));
            if (res) {
                setImgList(res);
            }
        };

        useEffect(() => {
            getHeadImgList(item.head_img_id);
            if (isShowAll) {
                getOtherImgList(item.mao_id);
            }
        }, [item]);

        return (
            <>
                {isShowAll && (
                    <>
                        <div>出生日期：{item.birthday}</div>
                        <div>父亲：{item.father}</div>
                        <div>母亲：{item.mother}</div>
                    </>
                )}
                {isShowAll && (
                    <UploadImageFile
                        type="mao"
                        otherId={item.mao_id}
                        refreshImgList={() => getOtherImgList(item.mao_id)}
                    />
                )}
                <PreviewImages imagesList={!isShowAll ? headList.slice(0, 1) : headList.concat(imgList)} />
                {!isShowAll && <div style={{ marginTop: 10, fontSize: 16 }}>{item.name}</div>}
            </>
        );
    };

    return (
        <>
            <Header title={"猫"} />
            <main className={styles.note}>
                <h2 className={styles.h2}>
                    <span>猫 ({total})</span>
                </h2>
                <div>
                    <Search
                        className={styles.search}
                        placeholder="输入搜索"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        enterButton
                        allowClear
                        onSearch={() => {
                            getData();
                        }}
                    />
                </div>
                <div className={styles.content}>
                    <div className={styles.list}>
                        {showList.map((item) => {
                            const isActive = active?.mao_id === item.mao_id;
                            return (
                                <div
                                    key={item.mao_id}
                                    className={`${styles.list_item} ${isActive ? styles.active : ""}`}
                                    onClick={() => handleClick(item)}
                                >
                                    <Item item={item} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Pagination
                    className={styles.pagination}
                    pageSize={pageSize}
                    current={pageNo}
                    total={total}
                    size="small"
                    onChange={(val) => setPageNo(val)}
                />
                <MyModal
                    visible={!!active}
                    title={active?.name}
                    onCancel={() => setActive(undefined)}
                    footer={() => null}
                    maxWidth={"100vw"}
                >
                    <div className={styles.modalContent}>
                        <Item item={active} isShowAll={true} />
                    </div>
                </MyModal>
            </main>
        </>
    );
};

export default MaoPu;

export async function getServerSideProps(context) {
    return {
        props: {
            // props for your component
        },
    };
}
