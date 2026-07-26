import React, { useEffect, useRef, useState } from 'react'
import Stayle from './order.module.css'
import Signature from './Signature'
import axios from 'axios';



//발주테이블, 서명을 이미지로 받을 컬럼 수정해야함 지금 없음
export interface OrderForm {
    ofnum?: number;
    mnum: string;
    oname: string;
    oaddr: string;
    ophone: string;
    ofdate: string;
    ofcompany: string;
    orderItem: OrderItem[];
}

interface OrderItem {
    oinum?: number;
    oiname: string;
    oiprice: number;
    oiamount: number;
    oipublisher: string;
}

const BackendUrl = process.env.REACT_APP_BACK_END_URL;

const Order: React.FC = () => {
    //-------Form--------------------------------
    const [orderForm, setOrderForm] = useState<OrderForm | null>(null);
    const [oname, setOname] = useState<string>('');
    const [mnum, setMnum] = useState<string>('');
    const [oaddr, setOaddr] = useState<string>('');
    const [ofcompany, setOfcompany] = useState<string>('');
    const [ophone, setOphone] = useState<string>('');
    const [ofdate, setOfdate] = useState<string>('');


    //-----------Item---------------------------
    const [orderItem, setOrderItem] = useState<OrderItem[]>([]);
    const [oiname, setOiname] = useState<string>('');
    const [oipublisher, setOipublisher] = useState<string>('');
    const [oiprice, setOiprice] = useState<number>(0);
    const [oiamount, setOiamount] = useState<number>(0);

    const itmeList = () => {
        const inputRowList = {
            oiname: oiname,
            oiprice: oiprice,
            oipublisher: oipublisher,
            oiamount: oiamount
        }
        setOrderItem([...orderItem, inputRowList]);

        setOiname('');
        setOipublisher('');
        setOiprice(0);
        setOiamount(0);
        setMnum('5');
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`http://192.168.0.114/myictstudy/api/login/session`, {
                    withCredentials: true,
                });
                setMnum(res.data.mnum);
            } catch (error) {
                console.error("세션 조회 실패(mnum), 더미데이터로 대체합니다(mnum : 5):", error);
            }
        })();
    }, []);


    useEffect(() => {
        const assembledForm = {
            mnum: mnum,
            oname: oname,
            oaddr: oaddr,
            ophone: ophone,
            ofdate: ofdate,
            ofcompany: ofcompany,
            orderItem: orderItem,
        };
        setOrderForm(assembledForm);
    }, [orderItem]);

    console.log(orderForm);
    return (
        <div>
            <div className={Stayle.header_container}>
                <h2 className={Stayle.header_container_text_right}>발주자 작성란</h2>
                <h3 className={Stayle.div_text}>서명 및 발주하기</h3>
            </div>
            <form>
                <div className={Stayle.header_container}>
                    <div className={Stayle.header_container_text_right}>
                        <ul className={Stayle.header_container_li}>
                            <li>대표자 : <input type="text" name='oname' onChange={(e) => setOname(e.target.value)} /></li>
                            <li>주소 : <input type="text" name='oaddr' onChange={(e) => setOaddr(e.target.value)} /></li>
                            <li>법인명 : <input type="text" name='ofcompany' onChange={(e) => setOfcompany(e.target.value)} /></li>
                            <li>연락처 : <input type="text" name='ophone' onChange={(e) => setOphone(e.target.value)} /></li>
                            <li>발주일 : <input type="date" name='ofdate' onChange={(e) => setOfdate(e.target.value)} /></li>
                        </ul>
                    </div>
                    <div className={Stayle.header_container_text_left}>
                        {/* <ul>
            <li>발주일 : <input type="text" name='date' /></li>
            <li>발주일 : <input type="text" name='date' /></li>
            <li>발주일 : <input type="text" name='date' /></li>
            <li>발주일 : <input type="text" name='date' /></li>
            <li>발주일 : <input type="text" name='date' /></li>
          </ul> */}

                        <Signature order={orderForm} />
                        {/* <input type="button" name='date'>발주하기</input> */}
                    </div>
                </div>
                <table >
                    <thead>
                        <tr>
                            <th>도서명</th>
                            <th>출판사</th>
                            <th>단가</th>
                            <th>합계금액</th>
                            <th>수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th><input type="text" name='oiname' onChange={(e) => setOiname(e.target.value)} /></th>
                            <th><input type="text" name='oipublisher' onChange={(e) => setOipublisher(e.target.value)} /></th>
                            <th><input type="number" name='oiprice' onChange={(e) => setOiprice(Number(e.target.value))} /></th>
                            <th>{oiprice * oiamount} 원</th>
                            <th><input type="number" name='oiamount' onChange={(e) => setOiamount(Number(e.target.value))} /></th>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={5}>
                                <button type="button" onClick={itmeList}>
                                    주문리스트 추가!
                                </button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    )
}

export default Order