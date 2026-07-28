import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';
import styles from "./stock.module.css";

// interface 지정
interface FormData {
    snum?: number;
    sname: string;
    sisbn: string;
    scategory: string;
    spublisher: string;
    sauthor: string;
    samount: number;
    sprice: number;
    membernum: number;
    // @RequestParam("images") MultipartFile[] images
    // File Interface는 javascript에서 파일을 접근할 수 있는 자바스크립트 객체이다.
    images: File[]
}

const StockForm: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const { member } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        sname: '',
        sisbn: '',
        scategory: '',
        spublisher: '',
        sauthor: '',
        samount: 0,
        sprice: 0,
        membernum: member?.mnum || 2,
        images: [] // 여러개의 이미지 파일 [data:img/psgAS,data:img/pngAS]
    })
    // 미리보기를 구현할때 사용하는 상태관리 + 미리보기를 모달로
    const [preview, setPreview] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    // navigate
    const navigate = useNavigate();
    // post , 이미지들을 배열로 전송
    const stockFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        console.log("submit");
        const stockFormData = new FormData();

        stockFormData.append('sname', formData.sname);
        stockFormData.append('sisbn', formData.sisbn);
        stockFormData.append('scategory', formData.scategory);
        stockFormData.append('spublisher', formData.spublisher);
        stockFormData.append('sauthor', formData.sauthor);
        stockFormData.append('samount', String(formData.samount));
        stockFormData.append('sprice', String(formData.sprice));
        stockFormData.append('membernum', String(formData.membernum));
        // 이미지 배열 => @RequestParam("images") MultipartFile[] images
        // 업로드할 이미지 file
        formData.images.forEach((file, index) => {
            stockFormData.append('images', file);
        });
        try {
            const repsonse = await fetch(
                `${backendUrl}/api/stock/addStock`, {
                method: 'POST',
                body: stockFormData
            });
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === "images" && files) {
            const fileArray = Array.from(files);

            const filePreviews = fileArray.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePreviews).then(urls => {
                setPreview(prev => [...prev, ...urls]);
            });

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...fileArray]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));

        setPreview(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={stockFormSubmit}>
                <input className={styles.input} type="text" placeholder="도서명"
                    onChange={handleChange} required name='sname' id="sname"
                />
                <input className={styles.input} type="text" placeholder="isbn"
                    onChange={handleChange} required name='sisbn' id="sisbn"
                />
                <input type='text' id='scategory' name='scategory' onChange={handleChange}
                    className={styles.input}
                    placeholder="카테고리"
                />
                <input type='text' id='spublisher' name='spublisher'
                    onChange={handleChange} className={styles.input}
                    placeholder="출판사"
                />
                <input type='text' id='sauthor' name='sauthor'
                    onChange={handleChange} className={styles.input}
                    placeholder="저자"
                />
                <input type='number' id='samount' name='samount'
                    onChange={handleChange} className={styles.input}
                    placeholder="수량"
                />
                <input type='number' id='sprice' name='sprice'
                    onChange={handleChange} className={styles.input}
                    placeholder="개당 가격"
                />
                <input className={styles.input} type="file" placeholder="이미지 URL 입력"
                    onChange={handleChange} required name='images' multiple
                />
                {formData.images.length > 0 && (
                    <>
                        {formData.images.map((file, index) => (
                            <div key={index} className={styles.fileItem}>
                                <span>{file.name}</span>

                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => removeImage(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.previewBtn}
                            onClick={() => setShowModal(true)}
                        >
                            이미지 미리보기
                        </button>
                    </>
                )}
                <button type="submit" className={styles.button}>등록</button>
            </form>
            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>이미지 미리보기</h3>

                        <div className={styles.imageGrid}>
                            {preview.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt=""
                                    className={styles.previewImage}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => setShowModal(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default StockForm