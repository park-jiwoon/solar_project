import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import axios from 'axios';
import '../CHAE.css';

function Mypage() {
    const [registers, setRegisters] = useState([]);
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // register 테이블 조회
    useEffect(() => {
        axios.get('http://localhost:8000/get_registers/')
            .then(response => {
                setRegisters(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);


    useEffect(() => {
        // localStorage에서 가져옴
        const user = localStorage.getItem('User');

        if (user) {
            axios.get(`http://localhost:8000/register_detail/${user}/`)
                .then(response => {
                    setDetails(response.data);
                    console.log("register_detail: ");
                    console.log(response.data);
                })
                .catch(error => {
                    console.log(error);
                    // 사용자에게 오류 메시지를 표시
                    setDetails({ error: "데이터를 불러오는데 실패했습니다." });
                });
        } else {
            console.error("user is not available in localStorage");
            setIsLoading(false);
        }
    }, []);

    // 날짜변환
    function formatDate(dateString) {
        const date = new Date(dateString);
        let year = date.getFullYear().toString().substring(2); // 년도의 마지막 두 자리
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (0-11 이므로 1을 더함)
        let day = date.getDate().toString().padStart(2, '0'); // 일

        return `${year}.${month}.${day}`;
    }

    // 배경 이미지 스타일 생성
    const backgroundImage = details ? `url(data:image/jpeg;base64,${details.ImgBase64})` : 'none';


    return (
        <div className='HYUN main_frame'>
            <main className='CHAE'>
                <h2 className='header' style={{ textAlign: "center" }}>조회페이지</h2>
                <h2 style={{ textAlign: "left" }}>작업 요청정보</h2>
                <div className='mypage_wrap'>
                    <div className='image-box'>
                        <figure style={{ backgroundImage: backgroundImage }}></figure>
                    </div>
                    <div className='content-box'>

                        <div className='contents'>
                            <div className="right">
                                <li className="list-item">
                                    <span className='text1'>회사 이름</span>
                                    <input type="text" value={details ? details.Cname : ''} readOnly className="input-item" />
                                </li>
                                <li className="list-item">
                                    <span className='text1'>사용자 ID</span>
                                    <input type="text" value={details ? details.User : ''} readOnly className="input-item" />
                                </li>
                                <li className="list-item">
                                    <span className='text1'>주소</span>
                                    <input type="text" value={details ? details.Add : ''} readOnly className="input-item" />
                                </li>
                                <li className="list-item">
                                    <span className='text1'>접수 시간</span>
                                    <p>{formatDate(details ? details.Time : '')}</p>
                                </li>
                                <li className="list-item">
                                    <span className='text1'>제목</span>
                                    <input type="text" value={details ? details.Title : ''} readOnly className="input-item" />
                                </li>
                                {details && details.State && (
                                    <li className="list-item">
                                        <span className='text1'>현재 상태</span>
                                        <input type="text" value={details.State} readOnly className="input-item" />
                                    </li>
                                )}
                                {details && details.Worker && (
                                    <li className="list-item">
                                        <span className='text1'>작업자명</span>
                                        <input type="text" value={details.Worker} readOnly className="input-item" />
                                    </li>
                                )}
                                {details && details.Adate && (
                                    <li className="list-item">
                                        <span className='text1'>작업 시작일</span>
                                        <input type="text" value={formatDate(details.Adate)} readOnly className="input-item" />
                                    </li>
                                )}
                                {details && details.Cdate && (
                                    <li className="list-item">
                                        <span className='text1'>작업 종료일</span>
                                        <input type="text" value={formatDate(details.Cdate)} readOnly className="input-item" />
                                    </li>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

            </main >
        </div >
    );
}

export default Mypage;
