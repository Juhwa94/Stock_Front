import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
    // 댓글 목록
    const [rcomments, setRComments] = useState<CommentVO[]>([]);

    // 작성자
    const [rwriter, setRWriter] = useState("");

    // 댓글 내용
    const [rcontent, setRContent] = useState("");


    // 댓글 조회
    const getComments = async () => {

        try {
            const url =
                `${backendUrl}/api/reply/list?num=${num}`;

                console.log(url);


            const response = await axios.get(url);

            setRComments(response.data);
            console.log(response.data);

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
        const commentData = {
            rcode: num,
            rwriter: rwriter,
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
            setRWriter("");
            setRContent("");

            // 다시 조회
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

                <input
                    type="text"
                    placeholder="작성자"
                    value={rwriter}
                    onChange={(e) =>
                        setRWriter(e.target.value)
                    }
                />
                <br />
                <textarea style={{}}
                    placeholder="댓글을 입력하세요."
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