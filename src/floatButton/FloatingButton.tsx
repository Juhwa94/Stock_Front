import { Link } from "react-router-dom";
import style from "./floatingButton.module.css";
import { BsPeopleFill } from "react-icons/bs";
import { useState } from "react";
import SurveyAddForm from "../cont/survey/SurveyAddForm";

const FloatingButton = () => {

    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);

    const openSurveyModal = () => setIsSurveyModalOpen(true);
    const closeSurveyModal = () => setIsSurveyModalOpen(false);

    return (
        <>
            <div className={style.floatingContainer} style={{ textAlign: 'center' }}>

                <Link to="/mypage" className={style.floatingButton}>
                    <BsPeopleFill size={30} />
                </Link>


                <button
                    type="button"
                    className={style.floatingButton}
                    onClick={openSurveyModal}
                >평가
                </button>


                <Link to="/inquiry" className={style.floatingButton}>
                    문의
                </Link>


                <button
                    className={style.floatingButton}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    TOP
                </button>
            </div>

            <SurveyAddForm
                isOpen={isSurveyModalOpen}
                onClose={closeSurveyModal}
            />
        </>
    );
};

export default FloatingButton;