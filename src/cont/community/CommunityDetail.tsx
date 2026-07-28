import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './commdetail.module.css';
import Comments from './Comments';

interface CommunityVO {
    cnum: number;
    ctitle: string;
    cwriter: string;
    ccontent: string;
    cimgn: string;
    chit: number;
    cdate: string;
    membernum?: number;
}


const CommunityDetail: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;
    const imageBasePath = `${backendUrl}/imgfile/`;
    const navigate = useNavigate();
    const { num } = useParams<{ num: string }>();
    const [community, setCommunity] = useState<CommunityVO | null>(null);
    // 수정 상태
    const [isEdit, setIsEdit] = useState(false);
    // 새 이미지
    const [mfile, setMfile] = useState<File | null>(null);
    // 이미지 미리보기
    const [preview, setPreview] = useState<string>("");
    // 상세 조회
    useEffect(() => {
        if (!num) return;
        const detailServer = async () => {
            try {
                const resp = await axios.get(
                    `${backendUrl}/api/community/coDetail`,
                    {
                        params: {
                            num
                        }
                    }
                );


                setCommunity(resp.data);


                if (resp.data.cimgn) {

                    setPreview(
                        `${backendUrl}/imgfile/${resp.data.cimgn}`
                    );

                }


            } catch (e) {

                console.error(e);

            }

        };


        detailServer();


    }, [num, backendUrl]);

    console.log(community?.cnum);




    // 수정할 데이터 변경
    const changeValue = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        if (!community) return;


        setCommunity({

            ...community,

            [e.target.name]: e.target.value

        });

    };
    // 이미지 변경
    const changeFile = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {


        const file = e.target.files?.[0];


        if (file) {

            setMfile(file);

            setPreview(
                URL.createObjectURL(file)
            );

        }

    };

    // 수정 저장
    const updateCommunity = async () => {
        if (!community) return;
        const formData = new FormData();
        formData.append(
            "cnum",
            String(community.cnum)
        );
        formData.append(
            "ctitle",
            community.ctitle
        );
        formData.append(
            "cwriter",
            community.cwriter
        );
        formData.append(
            "ccontent",
            community.ccontent
        );
        if (mfile) {

            formData.append(
                "mfile",
                mfile
            );
        }
        try {
            await axios.post(

                `${backendUrl}/api/community/coUpdate`,

                formData,

                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }

            );



            alert("수정 완료");


            setIsEdit(false);



            // 수정 후 다시 조회
            const resp = await axios.get(

                `${backendUrl}/api/community/coDetail`,

                {
                    params: {
                        num: community.cnum
                    }
                }

            );


            setCommunity(resp.data);


            if (resp.data.cimgn) {

                setPreview(
                    `${backendUrl}/imgfile/${resp.data.cimgn}`
                );

            }



        } catch (e) {

            console.error(e);

            alert("수정 실패");

        }


    };





    // 삭제
    const deleteCommunity = async () => {


        if (!community) return;


        const check =
            window.confirm(
                "게시글을 삭제하시겠습니까?"
            );


        if (!check) return;



        try {


            await axios.delete(

                `${backendUrl}/api/community/coDelete`,

                {
                    params: {
                        num: community.cnum
                    }
                }

            );


            alert("삭제 완료");


            navigate("/community");



        } catch (e) {

            console.error(e);

            alert("삭제 실패");

        }

    };





    if (!community) {

        return null;

    }





    return (

        <div className={styles.container}>


            <div className={styles.category}>
                [ 게시글 ]
            </div>




            {/* 제목 */}

            {
                isEdit ?

                    <input

                        className={styles.title}

                        name="ctitle"

                        value={community.ctitle}

                        onChange={changeValue}

                    />

                    :

                    <h2 className={styles.title}>

                        {community.ctitle}

                    </h2>

            }





            <div className={styles.info}>

                <span>
                    작성자 : {community.cwriter}
                </span>

                <span>
                    작성일 : {community.cdate}
                </span>

                <span>
                    조회수 : {community.chit}
                </span>


            </div>





            {/* 내용 */}

            {

                isEdit ?

                    <textarea

                        className={styles.content}

                        name="ccontent"

                        value={community.ccontent}

                        onChange={changeValue}

                    />


                    :

                    <div className={styles.content}>

                        {community.ccontent}

                    </div>

            }





            {/* 이미지 */}

            <div className={styles.imageBox}>


                {

                    preview &&

                    <img

                        src={preview}

                        alt={community.ctitle}

                        className={styles.image}

                    />

                }



                {

                    isEdit &&

                    <input

                        type="file"

                        onChange={changeFile}

                    />

                }


            </div>

            <Comments communityNum={community.cnum!} />



            {/* 버튼 */}

            <div className={styles.buttonArea}>


                <Link

                    to="/community"

                    className={styles.button}

                >

                    목록

                </Link>



                {

                    isEdit ?

                        <button

                            onClick={updateCommunity}

                            className={styles.button}

                        >

                            저장

                        </button>


                        :

                        <button

                            onClick={() => setIsEdit(true)}

                            className={styles.button}

                        >

                            수정

                        </button>


                }





                <button

                    onClick={deleteCommunity}

                    className={styles.deleteButton}

                >

                    삭제

                </button>



            </div>



        </div>

    );

};


export default CommunityDetail;