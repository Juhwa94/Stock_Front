import React, { useState } from 'react'
import styles from './Inquire.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface InquireVO {
    inum?: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn?: string;
    idate?: string;
    membernum : number;
    mfile?: File | null;
}
const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquireForm: React.FC = () => {    
    const [formData, setFormData] = useState<InquireVO>({
        ititle: '',
        iwriter: '',
        icontent: '',
        membernum:1,
        mfile: null
        // mfile: null as File | null
    })
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
    const navigate = useNavigate();
    const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    }

    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]; // input type=file 
            //파일을 읽어 들이기 위한 FileReader() 객체 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("파일 이미지가 감지 됨");
                console.log(reader.result);
                setPreview(reader.result); //useState에 저장 
            }
            //읽어올 파일의 주소를 FileReader에게 등록하자.
            reader.readAsDataURL(file);
            //useState에 등록 - 서버로 전송 
            setFormData({ ...formData, mfile: file });
        }
    }
    const myFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('ititle', formData.ititle);
        data.append('iwriter', formData.iwriter);
        data.append('icontent', formData.icontent);
        data.append('membernum', formData.membernum.toString());
        console.log(formData.mfile);
        
        if (formData.mfile) {
            data.append('mfile', formData.mfile);
            console.log(`FormData 전송 시 name이 필수!  Title => ${formData.ititle}, 
           Writer =>${formData.iwriter}`);
            //-여기까지 useState에 저장된 값을 찾아와서 다시 FormData에 모든 값을 저장
            try {
                const url = `${backendUrl}/api/inquiry/inquiryAdd`;
                await axios.post(url, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("정상적으로 등록처리 되었습니다.");


                //오류가 없으면 리스트로 이동 
                navigate('/inquiry');

            } catch (error) {
                console.log(`Erro =>${error}`);
            }
        }
    }


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>문 의 하 기</h2>
            <form className={styles.form} onSubmit={myFormSubmit}>
                <table className={styles.boardTable}>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name="ititle" id="ititle" className={styles.input}
                                    onChange={formChange} required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input type="text" name="iwriter" id="iwriter" className={styles.input}
                                    onChange={formChange} required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name="icontent" id="icontent"
                                    style={{ width: '90%', height: '150px', padding: '8px' }}
                                    onChange={formChange} required
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>이미지</th>
                            <td>
                                <input type="file" name="mfile" id="mfile" className={styles.input}
                                    onChange={fileChange} required
                                />
                            </td>
                        </tr>
                        {preview && (

                            <tr>
                                <td colSpan={2} style={{ textAlign: 'center' }}>
                                    <img src={preview as string} alt=""
                                        style={{
                                            width: '150px', height: '150px',
                                            marginRight: '10px', marginBottom: '10px'
                                        }}
                                    />
                                </td>
                            </tr>

                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2} className={styles.buttonArea}>
                                <button type="submit" className={styles.button}
                                >
                                    등록하기
                                </button>
                                <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => window.history.back()}
                                >
                                    돌아가기
                                </button>
                            </th>
                        </tr>
                    </tfoot>
                </table>

            </form>
        </div>
    )
}

export default InquireForm