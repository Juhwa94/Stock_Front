import React, { useEffect, useState } from 'react'
import Stayle from './product.module.css'
import { useNavigate } from 'react-router-dom'

interface ProductForm {
    pfnum?: number; //pk
    pstartdate: string; //시작일
    penddate: string;  //마감일
    productItem: ProductItem[];
}
interface ProductItem {
    pinum?: number; //pk
    piname: string;  //도서명
    piisbn: string; //도서번호
    piprice: number; //단가
    piamount: number; //수량
    pisumprice: number; //1행의 합계 가격 (가격*수량)
    piunitCost: number; //원가
}


//백엔드 주소가 담긴 .env파일의 키값
const backendUrl = process.env.REACT_APP_BACK_END_URL;

const Product: React.FC = () => {

    //useState 
    //--------form 
    const [productForm, setProductForm] = useState<ProductForm | null>(null);

    const [pstartdate, setPstartdate] = useState<string>("");
    const [penddate, setPenddate] = useState<string>("");
    const [productItem, setProductItem] = useState<ProductItem[]>([]);

    //-------item
    const [piname, setPiname] = useState<string>("");
    const [piisbn, setPiisbn] = useState<string>("");
    const [piprice, setPiprice] = useState<number>(0);
    const [piamount, setPiamount] = useState<number>(0);
    const [piunitCost, setpiunitCost] = useState<number>(0);
    const pisumprice = (piprice && piamount) ? (piprice * piamount) : 0;

    //useNavigate
    const nav = useNavigate();

    // 트리거함수
    const productSumit = async () => {
        
        //날짜를 선택하지 않고 제출한 케이스에 대해 예외처리
        if (!pstartdate || !penddate) {
            alert("시작일과 마감일을 모두 선택해 주세요.");
            return;
        }
        // 판매정보를 등록하지 않고 제출한 케이스에 대해 예외처리
        if (!productItem || productItem.length === 0) {
            alert("등록할 상품을 최소 하나 이상 추가해 주세요.");
            return;
        }
        
        const isConfirmed = window.confirm("수정이 불가합니다.\n정말 등록하시겠습니까?\n(수락시 매출관리 페이지로 이동됩니다.)");
        
        //경고창의 결과값이 수락일경우 실행
        if (isConfirmed) {
            //백엔드에 보낼 데이터 조립
            const assembledForm = {
                pstartdate: pstartdate,
                penddate: penddate,
                productItem: productItem,
            };
            //혹시몰라서 useState setter깔아둡니다 이 부분은 지우셔도 무방합니다
            setProductForm(assembledForm);
            try {
                // 서버에 보낼 데이터 json화
                // 주의: productForm를 보내지않는 이유 
                // useState는 비동기처리라 productForm를 보내고싶으면 어딘가에서 이 함수가 실행되기전에 
                // productForm를 랜더링하는 과정을 일으켜야합니다
                const productData = JSON.stringify(assembledForm);

                //백엔드로 전송 (fetch 사용), pa)axios사용해 보실 분들은 저한테 말하고 바꾸셔도 됩니다!
                const res = await fetch(`${backendUrl}/api/productForm`, {
                    method: 'POST',
                    //header-Type은 application/json : 백엔드에 보낼 데이터가 순수한 json형태(포맷)이기 때문
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: productData,
                });

                //전송결과 출력
                if (res.ok) {
                    nav("/revenue");
                } else {
                    alert("전송 실패 서버 에러");
                }
            } catch (error) {
                console.error(error);
            }

        }
    }

    // productItem조립을 위한 함수
    const addItem = () => {
        //조립된 데이터
        const inputRowList = {
            piname: piname,
            piisbn: piisbn,
            piprice: piprice,
            piamount: piamount,
            pisumprice: pisumprice,
            piunitCost: piunitCost
        }

        //조립된 데이터를 기존 데이터에 스프레드 연산
        setProductItem([...productItem, inputRowList]);

        //데이터 초기화(기본값)
        setPiname("");
        setPiisbn("");
        setPiprice(0);
        setPiamount(0);
        setpiunitCost(0);
    }

    return (
        <div className={Stayle.container}>
            <h2>판매 폼</h2>
            <div className={Stayle.sal_div_header}>
                <p>시작일 : <input type='date' name='pstartdate' onChange={(e) => { setPstartdate(e.target.value) }} /></p>
                <p> ~ </p>
                <p>마감일 : <input type='date' name='penddate' onChange={(e) => { setPenddate(e.target.value) }} /></p>
            </div>
            <h2 className={Stayle.total_price_title}>총 판매 단가 : {pisumprice.toLocaleString()}원</h2>
            <table className={Stayle.Table}>
                <thead>
                    <tr>
                        <th>도서번호</th>
                        <th>도서명</th>
                        <th>도매단가</th>
                        <th>판매단가</th>
                        <th>수량</th>
                        <th>합계금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" name="piisbn" value={piisbn} onChange={(e) => setPiisbn(e.target.value)} /></td>
                        <td><input type="text" name="piname" value={piname} onChange={(e) => setPiname(e.target.value)} /></td>
                        <td><input type="number" name="piunitCost" value={piunitCost || ''} onChange={(e) => setpiunitCost(parseInt(e.target.value) || 0)} /></td>
                        <td><input type="number" name="piprice" value={piprice || ''} onChange={(e) => setPiprice(parseInt(e.target.value) || 0)} /></td>
                        <td><input type="number" name="piamount" value={piamount || ''} onChange={(e) => setPiamount(parseInt(e.target.value) || 0)} /></td>
                        <td>{pisumprice.toLocaleString()}원</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6}>
                            <button type="button" onClick={addItem}>입력하기</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <hr />
            <table className={Stayle.Table}>
                <thead>
                    <tr>
                        <th>도서번호</th>
                        <th>도서명</th>
                        <th>도매단가</th>
                        <th>판매단가</th>
                        <th>수량</th>
                        <th>합계금액</th>
                    </tr>
                </thead>
                <tbody>
                    {productItem.map((e, i) => (
                        <tr key={i}>
                            <td>{e.piisbn}</td>
                            <td>{e.piname}</td>
                            <td>{e.piunitCost}원</td>
                            <td>{e.piprice}원</td>
                            <td>{e.piamount}</td>
                            <td>{e.pisumprice}원</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6}>
                            <button type="button" onClick={productSumit}>결산확정</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Product