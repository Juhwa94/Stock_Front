import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./adminNotice.module.css";


interface NoticeVO {

    nnum: number;
    ntitle: string;
    nwriter: string;
    ncontent: string;
    nhit: number;
    ndate: string;

}


const AdminNotice: React.FC = () => {


    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const navigate = useNavigate();


    const [noticeList, setNoticeList] = useState<NoticeVO[]>([]);


    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);



    // 공지 목록 조회
    const getNoticeList = async (page:number)=>{


        try{


            const resp = await axios.get(
                `${backendUrl}/api/notice/noList`,
                {
                    params:{
                        cPage:page
                    }
                }
            );


            setNoticeList(resp.data.data);

            setTotalItems(resp.data.totalItems);
            setTotalPages(resp.data.totalPages);
            setCurrentPage(resp.data.currentPage);
            setStartPage(resp.data.startPage);
            setEndPage(resp.data.endPage);



        }catch(error){

            console.error(
                "공지 목록 조회 실패",
                error
            );

        }


    };



    useEffect(()=>{

        getNoticeList(currentPage);

    },[currentPage]);





    // 삭제
    const deleteNotice = async(nnum:number)=>{


        if(!window.confirm("삭제하시겠습니까?")){
            return;
        }


        try{


            await axios.delete(
                `${backendUrl}/api/notice/noDelete`,
                {
                    params:{
                        num:nnum
                    }
                }
            );


            alert("삭제되었습니다.");


            getNoticeList(currentPage);



        }catch(error){

            console.error(
                "삭제 실패",
                error
            );

        }


    };





    return (

        <div className={styles.container}>


            <div className={styles.header}>


                <h2>
                    공지사항 관리
                </h2>



                <button
                    className={styles.writeButton}
                    onClick={()=>navigate("/admin/notice/form")}
                >

                    공지 등록

                </button>


            </div>



            <div className={styles.count}>

                총 {totalItems}개

            </div>




            <table className={styles.table}>


                <thead>

                    <tr>

                        <th>
                            번호
                        </th>

                        <th>
                            제목
                        </th>

                        <th>
                            작성자
                        </th>

                        <th>
                            조회수
                        </th>

                        <th>
                            작성일
                        </th>

                        <th>
                            관리
                        </th>

                    </tr>


                </thead>



                <tbody>


                {
                    noticeList.length === 0 ?


                    <tr>

                        <td colSpan={6}>
                            등록된 공지가 없습니다.
                        </td>

                    </tr>


                    :


                    noticeList.map((notice)=>(


                        <tr key={notice.nnum}>


                            <td>
                                {notice.nnum}
                            </td>


                            <td>


                                <Link
                                    to={`/notice/detail?num=${notice.nnum}`}
                                >

                                    {notice.ntitle}

                                </Link>


                            </td>


                            <td>
                                {notice.nwriter}
                            </td>


                            <td>
                                {notice.nhit}
                            </td>


                            <td>
                                {notice.ndate}
                            </td>



                            <td>


                                <button
                                    onClick={()=>
                                        navigate(
                                            `/admin/notice/form/${notice.nnum}`
                                        )
                                    }
                                >

                                    수정

                                </button>



                                <button
                                    onClick={()=>
                                        deleteNotice(notice.nnum)
                                    }
                                >

                                    삭제

                                </button>


                            </td>



                        </tr>


                    ))

                }



                </tbody>


            </table>





            <div className={styles.pageArea}>


                {
                    startPage > 1 &&

                    <button
                        onClick={()=>
                            setCurrentPage(startPage-1)
                        }
                    >
                        이전
                    </button>

                }




                {

                    Array.from(
                        {
                            length:endPage-startPage+1
                        },
                        (_,i)=>startPage+i
                    )
                    .map(page=>(

                        <button

                            key={page}

                            className={
                                page===currentPage
                                ?
                                styles.active
                                :
                                ""
                            }

                            onClick={()=>
                                setCurrentPage(page)
                            }

                        >

                            {page}

                        </button>


                    ))

                }





                {
                    endPage < totalPages &&


                    <button

                        onClick={()=>
                            setCurrentPage(endPage+1)
                        }

                    >

                        다음

                    </button>


                }



            </div>



        </div>

    );

};


export default AdminNotice;