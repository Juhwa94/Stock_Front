import React, { useEffect, useState } from "react";
import styles from "./nommForm.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../comp/AuthProvider";


interface NoticeVO {

    nnum?: number;
    ntitle: string;
    nwriter: string;
    ncontent: string;
    nhit?: number;
    ndate?: string;
    membernum?: number;

}


const NommForm: React.FC = () => {

    const { member } = useAuth();

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const navigate = useNavigate();

    const { num } = useParams<{ num: string }>();


    const [notice, setNotice] = useState<NoticeVO>({

        ntitle: "",
        nwriter: "관리자",
        ncontent: "",
        membernum: 8

    });



    // 수정일 경우 데이터 조회
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


                console.error(
                    "공지 상세 조회 실패",
                    error
                );


            }


        };


        getNotice();


    }, [num, backendUrl]);





    // 입력 변경
    const changeValue = (

        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

    ) => {


        const { name, value } = e.target;


        setNotice(prev => ({

            ...prev,

            [name]: value

        }));


    };





    // 등록 / 수정
    const submitNotice = async (

        e: React.FormEvent<HTMLFormElement>

    ) => {


        e.preventDefault();



        if (notice.ntitle.trim() === "") {

            alert("제목을 입력하세요.");
            return;

        }



        if (notice.ncontent.trim() === "") {

            alert("내용을 입력하세요.");
            return;

        }





        const formData = new FormData();


        formData.append(
            "ntitle",
            notice.ntitle
        );


        formData.append(
            "nwriter",
            notice.nwriter
        );


        formData.append(
            "ncontent",
            notice.ncontent
        );


        formData.append(
            "membernum",
            String(member?.mnum)
        );



        // 수정
        if (num) {


            formData.append(
                "nnum",
                num
            );


        }




        try {



            const url = num

                ? `${backendUrl}/api/notice/noUpdate`

                : `${backendUrl}/api/notice/noAdd`;




            await axios.post(

                url,

                formData,

                {

                    headers: {

                        "Content-Type":
                            "multipart/form-data"

                    }

                }

            );



            alert(

                num
                    ? "공지 수정 완료"
                    : "공지 등록 완료"

            );



            navigate("/notice");



        } catch(error) {


            console.error(
                "공지 처리 실패",
                error
            );


            alert(
                "처리 중 오류가 발생했습니다."
            );


        }


    };





    return (


        <form

            className={styles.container}

            onSubmit={submitNotice}

        >



            <div className={styles.pageTitle}>

                {
                    num
                    ?
                    "공지사항 수정"
                    :
                    "공지사항 등록"
                }

            </div>





            <div className={styles.formGroup}>


                <label className={styles.label}>

                    제목

                </label>



                <input

                    type="text"

                    name="ntitle"

                    className={styles.input}

                    value={notice.ntitle}

                    onChange={changeValue}

                />


            </div>






            <div className={styles.formGroup}>


                <label className={styles.label}>

                    작성자

                </label>



                <input

                    type="text"

                    className={styles.input}

                    value={notice.nwriter}

                    readOnly

                />


            </div>






            <div className={styles.formGroup}>


                <label className={styles.label}>

                    내용

                </label>



                <textarea

                    name="ncontent"

                    className={styles.textarea}

                    value={notice.ncontent}

                    onChange={changeValue}

                />



            </div>






            <div className={styles.buttonArea}>


                <button

                    type="submit"

                    className={styles.button}

                >

                    {
                        num
                        ?
                        "수정"
                        :
                        "등록"
                    }


                </button>





                <button

                    type="button"

                    className={styles.button}

                    onClick={() => navigate("/notice")}

                >

                    취소

                </button>



            </div>



        </form>


    );


};


export default NommForm;