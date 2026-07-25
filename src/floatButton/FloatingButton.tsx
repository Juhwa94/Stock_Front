import { Link } from "react-router-dom";
import style from "./floatingButton.module.css";
import { BsPeopleFill } from "react-icons/bs";

const FloatingButton = () => {
    return (
        <div className={style.floatingContainer} style={{ textAlign: 'center' }}>
            {/* {scheck || <Link to="/survey" className={style.floatingButton}>
                설문
            </Link>}
                만약 scheck가 false라면 설문조사를 1달 이내로 하지않았다는 것이므로 설문조사 버튼이 구현되어야 하고,
                true라면 설문조사를 1달 이내로 하였다는 것이므로 설문조사 버튼이 구현되지 않아야 한다.
            */}

            <Link to="/mypage" className={style.floatingButton}>
                <BsPeopleFill size={30}/>
            </Link>


            <Link to="/survey" className={style.floatingButton}>
                평가
            </Link>
            

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
    );
};

export default FloatingButton;