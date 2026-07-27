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

    const deleteOldRequest = async () => {
        try {
            const response = await axios.delete(`${backendUrl}/api/survey/delOldRequest`);
            console.log(response.data);
        } catch (error) {
            console.log("삭제하는데 오류가 생겼습니다.", error);
        }
    }

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
            <li>
                <div className={style.buttonContainer}>
                    <button
                        type="button"
                        onClick={deleteOldRequest}
                    >
                        오래된 요청 사항 삭제
                    </button>
                </div>
            </li>
        </ul>
    );
};

export default RequestList;