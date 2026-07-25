import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./comment.module.css";

interface CommentVO {
    cnum: number;
    cwriter: string;
    ccontent: string;
    cregdate: string;
    communitynum: number;
}

const Comment: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const { num } = useParams<{ num: string }>();

    const [commentList, setCommentList] = useState<CommentVO[]>([]);

    const [writer, setWriter] = useState("");
    const [content, setContent] = useState("");

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    // 댓글 조회
    const fetchCommentList = async (page: number) => {

        try {

            const url = `${backendUrl}/api/comments/list`;

            const response = await axios.get(url, {
                params: {
                    num: num,
                    cPage: page
                }
            });

            setCommentList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        if (num) {
            fetchCommentList(currentPage);
        }

    }, [num, currentPage]);

    // 댓글 등록
    const addComment = async () => {

        if (writer.trim() === "") {
            alert("작성자를 입력하세요.");
            return;
        }

        if (content.trim() === "") {
            alert("댓글을 입력하세요.");
            return;
        }

        try {

            const url = `${backendUrl}/api/comments/add`;

            const formData = new FormData();

            formData.append("cwriter", writer);
            formData.append("ccontent", content);
            formData.append("communitynum", String(num));

            await axios.post(url, formData);

            alert("댓글이 등록되었습니다.");

            setWriter("");
            setContent("");

            fetchCommentList(currentPage);

        } catch (error) {

            console.error(error);

        }

    };

    // 댓글 삭제
    const deleteComment = async (cnum: number) => {

        if (!window.confirm("삭제하시겠습니까?")) {
            return;
        }

        try {

            await axios.delete(
                `${backendUrl}/api/comments/delete`,
                {
                    params: {
                        num: cnum
                    }
                }
            );

            alert("삭제되었습니다.");

            fetchCommentList(currentPage);

        } catch (error) {

            console.error(error);

        }

    };

    // 페이지 이동
    const pageChange = (page: number) => {

        setCurrentPage(page);

    };

    return (

        <div className={styles.container}>

            <h3 className={styles.title}>
                댓글 ({totalItems})
            </h3>

            {
                commentList.map((item) => (

                    <div
                        key={item.cnum}
                        className={styles.commentBox}
                    >

                        <div className={styles.header}>

                            <span>{item.cwriter}</span>

                            <span>{item.cregdate}</span>

                        </div>

                        <div className={styles.content}>

                            {item.ccontent}

                        </div>

                        <div className={styles.buttonArea}>

                            <button
                                className={styles.deleteButton}
                                onClick={() => deleteComment(item.cnum)}
                            >
                                삭제
                            </button>

                        </div>

                    </div>

                ))
            }

            <div className={styles.writeBox}>

                <input
                    type="text"
                    placeholder="작성자"
                    value={writer}
                    onChange={(e) => setWriter(e.target.value)}
                    className={styles.input}
                />

                <textarea
                    placeholder="댓글을 입력하세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.textarea}
                />

                <button
                    onClick={addComment}
                    className={styles.submitButton}
                >
                    등록
                </button>

            </div>

            <div className={styles.pageArea}>

                {
                    startPage > 1 &&
                    <button
                        onClick={() => pageChange(startPage - 1)}
                    >
                        이전
                    </button>
                }

                {
                    Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => i + startPage
                    ).map((page) => (

                        <button
                            key={page}
                            className={
                                page === currentPage
                                    ? styles.active
                                    : ""
                            }
                            onClick={() => pageChange(page)}
                        >
                            {page}
                        </button>

                    ))
                }

                {
                    endPage < totalPages &&
                    <button
                        onClick={() => pageChange(endPage + 1)}
                    >
                        다음
                    </button>
                }

            </div>

        </div>

    );

};

export default Comment;