import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./nommDetail.module.css";
import { useAuth } from "../../comp/AuthProvider";

interface NoticeVO {
    nnum: number;
    ntitle: string;
    nwriter: string;
    ncontent: string;
    nhit: number;
    ndate: string;
}

const NoticeDetail: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const navigate = useNavigate();

    const { num } = useParams<{ num: string }>();

    const { member } = useAuth();

    const isAdmin = member?.authority === "ADMIN";

    const [notice, setNotice] = useState<NoticeVO | null>(null);

    // 상세 조회
    useEffect(() => {

        if (!num) return;

        const getNotice = async () => {

            try {

                const response = await axios.get(
                    `${backendUrl}/api/notice/noDetail`,
                    {
                        params: {
                            num
                        }
                    }
                );

                setNotice(response.data);

            } catch (error) {

                console.error("공지 상세 조회 실패", error);

            }

        };

        getNotice();

    }, [num, backendUrl]);

    // 삭제
    const deleteNotice = async () => {

        if (!notice) return;

        if (!window.confirm("공지사항을 삭제하시겠습니까?")) {
            return;
        }

        try {

            await axios.delete(
                `${backendUrl}/api/notice/noDelete`,
                {
                    params: {
                        num: notice.nnum
                    }
                }
            );

            alert("삭제되었습니다.");

            navigate("/notice");

        } catch (error) {

            console.error("공지 삭제 실패", error);

            alert("삭제 중 오류가 발생했습니다.");

        }

    };

    // 수정 페이지 이동
    const updateNotice = () => {

        if (!notice) return;

        navigate(`/admin/notice/update/${notice.nnum}`);

    };

    if (!notice) {
        return (
            <div>
                공지사항 정보를 불러오는 중입니다.
            </div>
        );
    }

    return (

        <div className={styles.container}>

            <div className={styles.category}>
                [ 공지사항 ]
            </div>

            <h2 className={styles.title}>
                {notice.ntitle}
            </h2>

            <div className={styles.info}>

                <span>
                    작성자 : {notice.nwriter}
                </span>

                <span>
                    작성일 : {notice.ndate}
                </span>

                <span>
                    조회수 : {notice.nhit}
                </span>

            </div>

            <div className={styles.content}>
                {notice.ncontent}
            </div>

            <div className={styles.buttonArea}>

                <Link
                    to="/notice"
                    className={styles.button}
                >
                    목록
                </Link>

                {isAdmin && (

                    <>

                        <button
                            type="button"
                            className={styles.button}
                            onClick={updateNotice}
                        >
                            수정
                        </button>

                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={deleteNotice}
                        >
                            삭제
                        </button>

                    </>

                )}

            </div>

        </div>

    );

};

export default NoticeDetail;