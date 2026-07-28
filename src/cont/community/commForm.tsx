import React, { useEffect, useState } from "react";
import styles from "./commForm.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface CommunityVO {
    cnum?: number;
    chit?: number;
    ctitle: string;
    cwriter: string;
    ccontent: string;
    cimgn: string;
    cdate?: string;
    membernum?: number;
    mfile: File | null;
}

const CommForm: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const navigate = useNavigate();

    const { num } = useParams<{ num: string }>();

    const [formData, setFormData] = useState<CommunityVO>({
        ctitle: "",
        cwriter: "나",
        ccontent: "",
        cimgn: "",
        membernum: 4,
        mfile: null
    });

    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

    // 수정일 경우 상세조회
    useEffect(() => {

        if (!num) return;

        const detailServer = async () => {

            try {

                const url = `${backendUrl}/api/community/codetail?num=${num}`;

                const resp = await axios.get(url);

                setFormData({
                    ...resp.data,
                    mfile: null
                });

                if (resp.data.cimgn) {
                    setPreview(`${backendUrl}/imgfile/${resp.data.cimgn}`);
                }

            } catch (error) {

                console.error(error);

            }

        };

        detailServer();

    }, [num, backendUrl]);

    // input 변경
    const formChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    // 파일 선택
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) return;

        const file = e.target.files[0];

        const reader = new FileReader();

        reader.onloadend = () => {

            setPreview(reader.result);

        };

        reader.readAsDataURL(file);

        setFormData({
            ...formData,
            mfile: file
        });

    };

    // 이미지 삭제
    const removeImage = () => {

        setPreview(null);

        setFormData({
            ...formData,
            cimgn: "",
            mfile: null
        });

    };

    // 등록 / 수정
    const myFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const data = new FormData();

        data.append("ctitle", formData.ctitle);
        data.append("cwriter", formData.cwriter);
        data.append("ccontent", formData.ccontent);
        data.append("membernum", String(formData.membernum));

        if (formData.mfile) {
            console.log(formData.mfile);
            data.append("mfile", formData.mfile);
        }

        if (num) {
            data.append("cnum", num);
        }

        try {

            const url = num
                ? `${backendUrl}/api/community/coUpdate`
                : `${backendUrl}/api/community/commAdd`;

            await axios.post(url, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert(num ? "수정되었습니다." : "등록되었습니다.");

            navigate("/community");

        } catch (error) {

            console.error(error);

            alert("처리 중 오류가 발생했습니다.");

        }

    };

    return (

        <form
            className={styles.container}
            onSubmit={myFormSubmit}
        >

            {/* 제목 */}
            <div className={styles.pageTitle}>
                [{num ? "게시글 수정" : "게시글 등록"}]
            </div>

            {/* 제목 */}
            <div className={styles.formGroup}>

                <label className={styles.label}>
                    제목
                </label>

                <input
                    type="text"
                    name="ctitle"
                    className={styles.input}
                    value={formData.ctitle}
                    onChange={formChange}
                />

            </div>

            {/* 내용 */}
            <div className={styles.formGroup}>

                <label className={styles.label}>
                    내용
                </label>

                <textarea
                    name="ccontent"
                    className={styles.textarea}
                    value={formData.ccontent}
                    onChange={formChange}
                />

            </div>

            {/* 이미지 */}
            <div className={styles.formGroup}>

                <label className={styles.label}>
                    이미지
                </label>

                <div className={styles.imageArea}>

                    <div className={styles.previewBox}>

                        {preview ? (

                            <img
                                src={preview as string}
                                alt="preview"
                                className={styles.previewImage}
                            />

                        ) : (

                            <span>이미지 미리보기</span>

                        )}

                    </div>

                    <div className={styles.imageButtonArea}>

                        <label
                            htmlFor="file"
                            className={styles.smallButton}
                        >
                            이미지 선택
                        </label>

                        <input
                            id="file"
                            type="file"
                            className={styles.fileInput}
                            onChange={fileChange}
                        />

                        <button
                            type="button"
                            className={styles.smallButton}
                            onClick={removeImage}
                        >
                            이미지 삭제
                        </button>

                    </div>

                </div>

            </div>

            {/* 버튼 */}
            <div className={styles.buttonArea}>

                <button
                    type="submit"
                    className={styles.button}
                >
                    {num ? "수정" : "등록"}
                </button>

                <button
                    type="button"
                    className={styles.button}
                    onClick={() => navigate("/community")}
                >
                    취소
                </button>

            </div>

        </form>

    );

};

export default CommForm;