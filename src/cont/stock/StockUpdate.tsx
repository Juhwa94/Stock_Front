import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';
import styles from "./stock.module.css";
import axios from 'axios';

interface StockUpdateProps {
    snum: number;
    onClose: () => void;
}

interface FormData {
    snum: number;
    sname: string;
    sisbn: string;
    scategory: string;
    spublisher: string;
    sauthor: string;
    samount: number;
    sprice: number;
    membernum: number;
}

const StockUpdate: React.FC<StockUpdateProps> = ({ snum, onClose }) => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const { member } = useAuth();

    const navigate = useNavigate();


    const [formData, setFormData] = useState<FormData>({
        snum: Number(snum),
        sname: '',
        sisbn: '',
        scategory: '',
        spublisher: '',
        sauthor: '',
        samount: 0,
        sprice: 0,
        membernum: member?.mnum || 2
    });




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === "samount" || name === "sprice"
                    ? Number(value)
                    : value
        }));

    }
    const updateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();

        data.append("snum", String(snum));
        data.append("sisbn", formData.sisbn);
        data.append("sname", formData.sname);
        data.append("scategory", formData.scategory);
        data.append("spublisher", formData.spublisher);
        data.append("sauthor", formData.sauthor);
        data.append("samount", String(formData.samount));
        data.append("sprice", String(formData.sprice));
        data.append("membernum", String(member?.mnum));


        try {
            const response = await axios.put(
                `${backendUrl}/api/stock/updateStock`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.status === 200) {
                alert("수정 완료");
                onClose();           // 모달 닫기
                navigate(`/stock/stockDetail/${snum}`);
                window.location.reload();
            }

        } catch (error) {
            console.error(error);
            alert("수정 실패");
        }
    };



    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={updateSubmit}>
                <input className={styles.input} name="sname" value={formData.sname}
                    onChange={handleChange} placeholder="도서명" />
                <input
                    className={styles.input}
                    name="sisbn"
                    value={formData.sisbn}
                    onChange={handleChange}
                    placeholder="ISBN"
                />
                <input
                    className={styles.input}
                    name="scategory"
                    value={formData.scategory}
                    onChange={handleChange}
                    placeholder="카테고리"
                />
                <input
                    className={styles.input}
                    name="spublisher"
                    value={formData.spublisher}
                    onChange={handleChange}
                    placeholder="출판사"
                />
                <input
                    className={styles.input}
                    name="sauthor"
                    value={formData.sauthor}
                    onChange={handleChange}
                    placeholder="저자"
                />
                <input
                    className={styles.input}
                    type="number"
                    name="samount"
                    value={formData.samount}
                    onChange={handleChange}
                    placeholder="수량"
                />
                <input
                    className={styles.input}
                    type="number"
                    name="sprice"
                    value={formData.sprice}
                    onChange={handleChange}
                    placeholder="가격"
                />
                <button
                    type="submit"
                    className={styles.button}
                >
                    수정
                </button>


            </form>


        </div>

    )

}


export default StockUpdate;