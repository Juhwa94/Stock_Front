import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./comments.module.css";
import { useAuth } from "../../comp/AuthProvider";

interface CommentsVO {
    cnum: number;
    cwriter: string;
    ccontent: string;
    cregdate: string;
    communitynum: number;
}

interface CommentsProps {
    communityNum: number;
}

const Comments: React.FC<CommentsProps> = ({ communityNum }) => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const { member } = useAuth();


    const [commentsList, setCommentsList] = useState<CommentsVO[]>([]);
    const [content, setContent] = useState("");

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    // 댓글 조회
    const fetchCommentsList = async (page: number) => {

        try {

            const response = await axios.get(
                `${backendUrl}/api/comments/toList`,
                {
                    params: {
                        num: communityNum,
                        cPage: page
                    }
                }
            );

            setCommentsList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);

        } catch (error) {

            console.error("댓글 조회 실패", error);

        }

    };

    useEffect(() => {

        if (communityNum) {
            setCurrentPage(1);
        }

    }, [communityNum]);

    useEffect(() => {

        if (communityNum) {
            fetchCommentsList(currentPage);
        }

    }, [communityNum, currentPage]);

    // 댓글 등록
    const addComment = async () => {

        if (!member) {
            alert("로그인 후 이용해주세요.");
            return;
        }

        if (content.trim() === "") {
            alert("댓글을 입력하세요.");
            return;
        }

        try {

            const formData = new FormData();

            formData.append("communitynum", String(communityNum));
            formData.append("membernum", String(member?.mnum));
            formData.append("cwriter", String(member?.nick));
            formData.append("ccontent", content);

            await axios.post(
                `${backendUrl}/api/comments/toAdd`,
                formData
            );

            alert("댓글이 등록되었습니다.");

            setContent("");

            setCurrentPage(1);
            fetchCommentsList(1);

        } catch (error) {

            console.error("댓글 등록 실패", error);

        }

    };

    // 댓글 삭제
    const deleteComment = async (cnum: number) => {

        if (!window.confirm("댓글을 삭제하시겠습니까?")) {
            return;
        }

        try {

            await axios.delete(
                `${backendUrl}/api/comments/toDelete`,
                {
                    params: {
                        num: cnum
                    }
                }
            );

            alert("삭제되었습니다.");

            fetchCommentsList(currentPage);

        } catch (error) {

            console.error("댓글 삭제 실패", error);

        }

    };

    const pageChange = (page: number) => {

        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);

    };

    return (

        <div className={styles.container}>

            <h3 className={styles.title}>
                댓글 ({totalItems})
            </h3>

            {
                commentsList.length === 0 ?

                    <div className={styles.empty}>
                        등록된 댓글이 없습니다.
                    </div>

                    :

                    commentsList.map((item) => (

                        <div
                            key={item.cnum}
                            className={styles.commentsBox}
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
                    <button onClick={() => pageChange(startPage - 1)}>
                        이전
                    </button>
                }

                {
                    Array.from(
                        { length: endPage - startPage + 1 },
                        (_, i) => startPage + i
                    ).map((page) => (

                        <button
                            key={page}
                            className={page === currentPage ? styles.active : ""}
                            onClick={() => pageChange(page)}
                        >
                            {page}
                        </button>

                    ))
                }

                {
                    endPage < totalPages &&
                    <button onClick={() => pageChange(endPage + 1)}>
                        다음
                    </button>
                }

            </div>

        </div>

    );

};

export default Comments;