interface RequestData {
    request: string;
    resdate: string;
}

interface Props {
    requests: RequestData[];
}

const RequestList: React.FC<Props> = ({ requests }) => {
    return (
        <>
            {
                requests.length > 0 ? (
                    requests.map((item, index) => (
                        <div 
                            key={`${item.request}-${item.resdate}-${index}`}
                        >
                            <span>
                                {item.request}
                            </span>

                            <span>
                                {item.resdate}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>
                        등록된 요청 사항이 없습니다.
                    </p>
                )
            }
        </>
    );
};

export default RequestList;