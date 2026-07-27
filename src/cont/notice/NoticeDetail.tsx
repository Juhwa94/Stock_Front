import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./nommDetail.module.css";


interface NoticeVO {

    nnum: number;
    ntitle: string;
    nwriter: string;
    ncontent: string;
    nhit: number;
    ndate: string;

}



const NoticeDetail:React.FC =()=>{


    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const navigate = useNavigate();

    const { num } = useParams<{num:string}>();


    const [notice,setNotice] = useState<NoticeVO | null>(null);



    // 로그인 회원 확인

    const loginMember =
        JSON.parse(
            localStorage.getItem("loginMember") || "null"
        );


    const isAdmin =
        loginMember?.authority === "ADMIN";




    // 상세 조회

    useEffect(()=>{


        if(!num){
            return;
        }


        const getNotice = async()=>{


            try{


                const response = await axios.get(

                    `${backendUrl}/api/notice/noDetail`,

                    {
                        params:{
                            num
                        }
                    }

                );


                setNotice(response.data);



            }catch(error){

                console.error(
                    "공지 상세 조회 실패",
                    error
                );

            }


        };



        getNotice();



    },[num,backendUrl]);







    // 삭제

    const deleteNotice = async()=>{


        if(!notice){
            return;
        }



        const check =
            window.confirm(
                "공지사항을 삭제하시겠습니까?"
            );


        if(!check){
            return;
        }



        try{


            await axios.delete(

                `${backendUrl}/api/notice/noDelete`,

                {

                    params:{
                        num:notice.nnum
                    }

                }

            );



            alert(
                "삭제되었습니다."
            );


            navigate("/admin/notice");



        }catch(error){


            console.error(
                "공지 삭제 실패",
                error
            );


            alert(
                "삭제 실패"
            );


        }


    };






    if(!notice){

        return (

            <div>
                공지사항 정보를 불러오는 중입니다.
            </div>

        );

    }





    return(


        <div className={styles.container}>


            <div className={styles.category}>

                [ 공지사항 ]

            </div>




            {/* 제목 */}

            <h2 className={styles.title}>

                {notice.ntitle}

            </h2>






            {/* 정보 */}

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







            {/* 내용 */}

            <div className={styles.content}>

                {notice.ncontent}

            </div>







            {/* 버튼 */}

            <div className={styles.buttonArea}>


                <Link

                    to="/notice"

                    className={styles.button}

                >

                    목록

                </Link>





                {

                    isAdmin &&

                    <>


                        <button

                            className={styles.button}

                            onClick={()=>{

                                navigate(
                                    `/admin/notice/update/${notice.nnum}`
                                );

                            }}

                        >

                            수정

                        </button>




                        <button

                            className={styles.deleteButton}

                            onClick={deleteNotice}

                        >

                            삭제

                        </button>



                    </>

                }



            </div>





        </div>


    );


};



export default NoticeDetail;