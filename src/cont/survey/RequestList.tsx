import axios from "axios";
import style from "./requestList.module.css"

interface RequestData {
    REQUEST: string;
    RESDATE: string;
}

interface Props {
    requests: RequestData[];
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const RequestList: React.FC<Props> = ({ requests }) => {


    return (
        <ul className={style.board}>
            {requests.length > 0 ? (
                requests.map((item, index) => (
                    <li
                        key={index}
                        className={style.item}
                    >
                        <span className={style.content}>
                            {item.REQUEST}
                        </span>

                        <span className={style.hiddencontent}>
                            {item.REQUEST}
                        </span>

                        <span className={style.date}>
                            {item.RESDATE}
                        </span>
                    </li>
                ))
            ) : (
                <p>
                    등록된 요청 사항이 없습니다.
                </p>
            )
            }
        </ul>
    );
};

export default RequestList;
