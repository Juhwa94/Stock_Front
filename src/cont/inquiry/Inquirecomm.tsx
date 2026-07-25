import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface inquireCommProps {
    num? : string;
}

interface InquireCommVO {
    inum?: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn?: string;
    idate?: string;
    membernum : number;
}

const InquireComm: React.FC<inquireCommProps> = ({num}) => {
 //num에 대한 댓글들이 들어와서 저장될 상태 값 
  const [comments, setcomments] = useState<InquireCommVO[]>([]);

  //---------------------------------------------------------------
  // 폼에서 입력한 값을 onChage 이벤트가 발생할 때 마다 값을 저장하기 위한 저장장소를 선언한다.
  // useState를 정의함. 
  const [iwriter, setIWriter] = useState<string>("");
  const [icontent, setIContent] = useState<string>("");
 //---------------------------------------------------------------
    const getComments = async () => {
        try {
            //부모로 부터 받은 num을 서버 api주소로 바인딩 처리 한다.
            const url = `http://192.168.0.163/myictstudy/inquiry/inquireList?num=${num}`;
            const response = await axios.get(url);
             console.log("=============댓글 axios 검수=================")
             console.log(response.data); 
             setcomments(response.data); //useState에 저장 
        } catch (error) {
            console.error("데이터 로딩 실패!", error);
        }
    }
    //상세보기의 키값인 num값이 변경이 될 때 마다 getComments()를 호출해서 새로운 데이터를 초기화 한다.  
  useEffect(()=>{
     console.log("Num => "+num);
     getComments();
  },[num]);
 //---------------------------------------------------------------
 // formSubmit
 const commnentSubmit = async (e:React.SubmitEvent) => {
    e.preventDefault();
    console.log(`IWriter => ${iwriter}`);
    console.log(`IContent => ${icontent}`); 
    //server api : @RequestBody 기 때문에 자바스크립트 object로 값을 대입
    const commentData = {
       ucode : num,
       uwriter : iwriter,
       ucontent: icontent,
       reip:'192.168.0.163'
    }
    try {
        const url = 'http://192.168.0.163/projectBack/inquiry/inquireAdd'
        await axios.post(url,commentData,{headers:{'Content-Type':'application/json'}})
        setIWriter("");
        setIContent("");
        getComments();
    } catch (error) {
        console.error("전송 실패!", error);
    }
 }

 //---------------------------------------------------------------
  return (
    <div className='mt-4'>
        <h4>Comments</h4>
        <form className='mb-3' onSubmit={commnentSubmit}>
            <div className='mb-2'>
                <input type="text" placeholder='작성자' className='form-control'
                 onChange={(e)=>{ setIWriter(e.target.value)}}
                />
            </div>
            <div className='mb-2'>
                <textarea  className='form-control' placeholder='댓글' 
                onChange={(e)=>{ setIContent(e.target.value)}}
                ></textarea>
            </div>
            <div className='text-center'>
                <button type='submit' className='btn btn-primary'>댓글작성</button>
            </div>
        </form>
        {/* 댓글 리스트  */}
        <ul className='list-group'>
           {
            comments.map((vo)=>(
                <li className='list-group-item' key={vo.inum}>
                    <strong>{vo.iwriter}</strong>
                    <span className='text-muted'>{vo.idate}</span>
                    <p>{vo.icontent}</p>
                </li>
            ))
           }
        </ul>
    </div>
  )
}

export default InquireComm