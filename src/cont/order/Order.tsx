import React, { useEffect, useRef, useState } from 'react'
import Stayle from './order.module.css'
import Signature from './Signature'
import axios from 'axios';

import { useAuth } from '../../comp/AuthProvider';



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
    oiSumPrice: number;
    oipublisher: string;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const Order: React.FC = () => {
    //-------Form--------------------------------
    const [orderForm, setOrderForm] = useState<OrderForm | null>(null);
    const [oname, setOname] = useState<string>('');
    const [oaddr, setOaddr] = useState<string>('');
    const [ofcompany, setOfcompany] = useState<string>('');
    const [ophone, setOphone] = useState<string>('');
    const [ofdate, setOfdate] = useState<string>('');


    //-----------Item---------------------------
    const [orderItem, setOrderItem] = useState<OrderItem[]>([]);
    const [oiname, setOiname] = useState<string >("");
    const [oipublisher, setOipublisher] = useState<string >("");
    const [oiprice, setOiprice] = useState<number>(0);
    const [oiamount, setOiamount] = useState<number>(0);

    // 세션 회원 데이터 가져오기
    const { member } = useAuth();

    const itmeList = () => {
        let oiSumPrice = oiprice * oiamount;

        // 발주품중 빈칸을 제출한 케이스에 대해 예외처리
        if(!(oiname && oiprice && oipublisher && oiamount && oiSumPrice)) {
            alert("빈칸을 허용하지 않습니다");
            return;
        }

        const inputRowList = {
            oiname: oiname,
            oiprice: oiprice,
            oipublisher: oipublisher,
            oiamount: oiamount,
            oiSumPrice: oiSumPrice
        }

        setOrderItem([...orderItem, inputRowList]);

        oiSumPrice = 0;
        setOiname('');
        setOipublisher('');
        setOiprice(0);
        setOiamount(0);
    }


    useEffect(() => {
        const assembledForm = {
            mnum: String(member?.mnum),
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
        <div className={Stayle.container}>

            <div className={Stayle.header_title_area}>
                <h2>발주자 작성란</h2>
                <h3>서명 및 발주하기</h3>
            </div>

            <div className={Stayle.header_container}>
                <div className={Stayle.header_container_text_right}>
                    <ul className={Stayle.header_container_li}>
                        <li>
                            대표자 :{' '}
                            <input
                                type="text"
                                name="oname"
                                value={oname}
                                onChange={(e) => setOname(e.target.value)}
                            />
                        </li>
                        <li>
                            주소 :{' '}
                            <input
                                type="text"
                                name="oaddr"
                                value={oaddr}
                                onChange={(e) => setOaddr(e.target.value)}
                            />
                        </li>
                        <li>
                            법인명 :{' '}
                            <input
                                type="text"
                                name="ofcompany"
                                value={ofcompany}
                                onChange={(e) => setOfcompany(e.target.value)}
                            />
                        </li>
                        <li>
                            연락처 :{' '}
                            <input
                                type="text"
                                name="ophone"
                                value={ophone}
                                onChange={(e) => setOphone(e.target.value)}
                            />
                        </li>
                        <li>
                            발주일 :{' '}
                            <input
                                type="date"
                                name="ofdate"
                                value={ofdate}
                                onChange={(e) => setOfdate(e.target.value)}
                            />
                        </li>
                    </ul>
                </div>
                <div className={Stayle.header_container_text_left}>
                    <Signature order={orderForm} />
                </div>
            </div>

            <table className={Stayle.Table}>
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
                        <td>
                            <input
                                type="text"
                                name="oiname"
                                value={oiname}
                                onChange={(e) => setOiname(e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="oipublisher"
                                value={oipublisher}
                                onChange={(e) => setOipublisher(e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                name="oiprice"
                                value={oiprice || ''}
                                onChange={(e) => setOiprice(parseInt(e.target.value) || 0)}
                            />
                        </td>
                        <td>{(oiprice * oiamount).toLocaleString()} 원</td>
                        <td>
                            <input
                                type="number"
                                name="oiamount"
                                value={oiamount || ''}
                                onChange={(e) => setOiamount(parseInt(e.target.value) || 0)}
                            />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <button className={Stayle.button_oeder} type="button" onClick={itmeList}>
                                주문리스트 추가!
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <table className={Stayle.Table}>
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
                    {orderItem.map((e, i) => (
                        <tr key={i}>
                            <td>{e.oiname}</td>
                            <td>{e.oipublisher}</td>
                            <td>{e.oiprice}</td>
                            <td>{e.oiSumPrice}</td>
                            <td>{e.oiamount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Order