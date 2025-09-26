import { HomeTodoList, TodoItemType } from '@xiaxiazheng/blog-libs';
import React, { useState } from 'react';
import TodoDetailDrawer from '../../todo/todo-detail-drawer';
import TodoPagination from '../../todo/todo-pagination';
import styles from './index.module.scss';

interface IProps {
    refreshFlag?: number;
    keyword?: string;
}

/** pc 版首页能看到的 todo 的内容 */
const HomeTodo: React.FC<IProps> = props => {
    const { refreshFlag = 0, keyword } = props

    const [activeTodo, setActiveTodo] = useState<TodoItemType | undefined | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const [flag, setFlag] = useState<number>(0);

    return <>
        <div style={{ color: 'white', padding: '5px 0' }}>游客能看到的内容：</div>
        <HomeTodoList
            keyword={keyword}
            refreshFlag={refreshFlag + flag}
            getActiveTodo={setActiveTodo}
            defaultPageSize={10}
            PaginationComp={TodoPagination}
            paginationProps={{
                className: styles.pagination
            }}
            onClick={() => {
                setVisible(true);
            }}
        />
        {visible && <TodoDetailDrawer
            activeTodo={activeTodo}
            visible={visible}
            onClose={() => setVisible(false)}
            onRefresh={() => setFlag(prev => prev + 1)}
            keyword={keyword}
        />}
    </>
}

export default HomeTodo;