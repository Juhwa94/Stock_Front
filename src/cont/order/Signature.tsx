import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Stayle from './order.module.css'
import { OrderForm } from './Order';
import axios from 'axios';


//OrderForm객체를 매개변수로 받기위한 인터페이스
interface SignatureProps {
    order: OrderForm | null; 
}

//백엔드 주소가 담긴 .env파일의 키값
//const backendUrl = process.env.REACT_APP_BACK_END_URL;

export default function Signature({ order }: SignatureProps) {
    
    // useRef로 서명파일이 깨지지않도록 안정화 시켰습니다
    const canvasRef = useRef<SignatureCanvas | null>(null);

    // 트리거함수
    const handleSubmit = async (): Promise<void> => {
        // 타입 가드
        if (!canvasRef.current) return;

        // 서명하지 않고 제출한 케이스에대해 예외처리
        if (!canvasRef) {
            alert("서명확인");
            return;
        }

        //주문서를 작성하지 않고 제출한 케이스에 대해 예외처리
        if (!order) {
            alert("주문서 정보가 없습니다.");
            return;
        }

        //그려진 공간을 이미지 데이터(Base64 문자열)로 추출
        const trimmedCanvas = canvasRef.current.getCanvas();
        const image64: string = trimmedCanvas.toDataURL('image/png');

        // 스프링부트 백엔드로 전송할 FormData 객체 생성
        const orderData = new FormData();

        try {
            // Base64 문자열을 실제 파일(Blob/File) 객체로 변환하여 담기
            const response = await fetch(image64);
            const blob: Blob = await response.blob();

            //서명파일이 백엔드에 저장될 이름 생성
            const fileName = order?.ophone
                ? `signature_${order.ophone}.png` //서명파일 작명양식 : signature_핸드폰번호.png
                : 'canvas_signature.png';

            //백엔드에서 파일을 받을 키값과 데이터 구조 전처리
            orderData.append('signature', blob, fileName); // 백엔드에서 'signature'이라는 이름으로 받음
            if (order) {
                orderData.append(
                    'orderData',
                    new Blob([JSON.stringify(order)], { type: 'application/json' })
                );
            }
            // 백엔드로 전송 (fetch 사용), pa)axios사용해 보실 분들은 저한테 말하고 바꾸셔도 됩니다!
            const res = await fetch(`http://192.168.0.114/myictstudy/api/order/orderForm`, {
                method: 'POST',
                body: orderData, // Multipart FormData 전송
            });

            //전송결과 출력
            if (res.ok) {
                alert("전송 완료!");
            } else {
                alert("전송 실패 서버 에러");
            }
        } catch (err) {
            console.error("업로드 중 에러 발생:", err);
        }
    };

    // 지우기 버튼용 함수
    const handleClear = (): void => {
        if (canvasRef.current) {
            canvasRef.current.clear();
        }
    };

    return (
        <div className={Stayle.Signature_div}>
            <div style={{ border: '2px solid #ccc', width: '400px', height: '200px', background: '#f9f9f9' }}>
                <SignatureCanvas
                    ref={canvasRef}
                    canvasProps={{ width: 500, height: 300, className: 'sigCanvas' }}
                    penColor="black"
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button className={Stayle.Signature_btn1} onClick={handleClear}>재서명</button>
                <button className={Stayle.Signature_btn2} onClick={handleSubmit} style={{ backgroundColor: '#0088FE', color: '#fff' }}>
                    (서명)
                </button>
            </div>
        </div>
    );
}