import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';
import styles from "./stock.module.css";
import axios from 'axios';

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

const StockUpdate: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const { member } = useAuth();
    const { snum } = useParams();

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


    // 기존 데이터 가져오기
    useEffect(() => {

        fetch(`${backendUrl}/api/stock/stockDetail?snum=${snum}`)
            .then(res => res.json())
            .then(data => {

                setFormData({
                    snum: data.snum,
                    sname: data.sname,
                    sisbn: data.sisbn,
                    scategory: data.scategory,
                    spublisher: data.spublisher,
                    sauthor: data.sauthor,
                    samount: data.samount,
                    sprice: data.sprice,
                    membernum: data.membernum
                });

            })
            .catch(err => console.log(err));

    }, [snum]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === "samount" || name === "sprice"
                ? Number(value)
                : value
        }));

    }
    const updateSubmit = async (
    e: React.SubmitEvent
) => {

    e.preventDefault();

    try {

        const response = await axios.put(
            `${backendUrl}/api/stock/updateStock`,
            formData,
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );
        if(response.status === 200){
            alert("수정 완료");
            navigate("/stock");
        }
    } catch(error){
        console.error(error);
    }
}



    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={updateSubmit}>
                <input className={styles.input} name="sname" value={formData.sname}
                    onChange={handleChange} placeholder="도서명"/>
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