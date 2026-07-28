import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../comp/AuthProvider';

interface InquireCommProps {
    num?: string;
}

interface CommentVO {
    membernum?: number;
    rnum?: number;
    rcode: number;
    rwriter: string;
    rcontent: string;
    rdate?: string;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquireComm: React.FC<InquireCommProps> = ({ num }) => {

    // 로그인한 회원 정보 가져오기
    const { member, isLoggedIn } = useAuth();
    console.log("member =", member);
console.log("isLoggedIn =", isLoggedIn);

    // 댓글 목록
    const [rcomments, setRComments] = useState<CommentVO[]>([]);

    // 댓글 내용
    const [rcontent, setRContent] = useState("");

    // 댓글 조회
    const getComments = async () => {
        try {

            const url =
                `${backendUrl}/api/reply/list?num=${num}`;

            const response = await axios.get(url);

            setRComments(response.data);

        } catch (error) {

            console.log("댓글 조회 실패");
            console.log(error);

        }
    };

    // 게시글 번호가 바뀔 때마다 조회
    useEffect(() => {
        getComments();
    }, [num]);


    // 댓글 등록
    const commentSubmit = async (
        e: React.SubmitEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        // 로그인 확인
        if (!isLoggedIn) {
            alert("로그인 후 댓글을 작성할 수 있습니다.");
            return;
        }

        const commentData = {

            rcode: Number(num),
            rwriter: member?.nick,
            rcontent: rcontent

        };

        try {

            await axios.post(

                `${backendUrl}/api/reply/add`,
                commentData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }

            );

            // 입력창 초기화
            setRContent("");

            // 댓글 다시 조회
            getComments();

        } catch (error) {

            console.log("댓글 등록 실패");
            console.log(error);

        }
    };


    return (

        <div>

            <h3>댓글</h3>

            {/* 댓글 작성 */}
            <form onSubmit={commentSubmit}>

                {/* 로그인한 회원의 닉네임 표시 */}
                <input
                    type="text"
                    value={member?.nick || ""}
                    readOnly
                />

                <br />

                <textarea
                    style={{
                        width: "700px",
                        height: "180px",
                        resize: "none"
                    }}
                    placeholder="비방, 욕설, 광고성 댓글은 사전 통보 없이 삭제될 수 있습니다."
                    value={rcontent}
                    onChange={(e) =>
                        setRContent(e.target.value)
                    }
                />

                <br />

                <button type="submit">
                    댓글 작성
                </button>

            </form>

            <hr />

            {/* 댓글 목록 */}
            <ul>
                {
                    rcomments.map((comment) => (
                        <li key={comment.rnum}>
                            <strong>
                                {comment.rwriter}
                            </strong>

                            <p>
                                {comment.rcontent}
                            </p>

                            <small>
                                {comment.rdate}
                            </small>
                        </li>
                    ))
                }
            </ul>

        </div>
    );
};

export default InquireComm;