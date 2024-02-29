import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// 갤러리 형태 스타일
import '../kaempein_style.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function Lv2page() {
    const [workerName, setWorkerName] = useState('');
    const [dividend, setDividend] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('User');

        if (user) {
            axios.get(`http://localhost:8000/get_membership_ccode/user/${user}/`)
                .then(response => {
                    setWorkerName(response.data.Name);
                    console.log("작업자 이름 : " + response.data.Name);
                    setIsLoading(false); // 데이터 로드 완료
                })
                .catch(error => {
                    console.error("작업자 이름 못불러옴:", error);
                    setIsLoading(false); // 오류 발생 시 로딩 상태 업데이트
                });
        } else {
            console.error("user is not available in localStorage");
            setIsLoading(false);
        }
    }, []);

    // dividend 테이블 조회
    useEffect(() => {
        const user = localStorage.getItem('User');
        if (user) {
            axios.get(`http://localhost:8000/get_dividend/user/${user}/`)
                .then(response => {
                    // 서버로부터 받은 데이터에 isOpen과 Cdate 상태를 추가합니다.
                    const dividendsData = response.data.map(item => ({
                        ...item,
                        isOpen: false,  // 달력 UI의 열림 상태
                        Cdate: item.Dividend.Cdate ? new Date(item.Dividend.Cdate) : null // Cdate가 있으면 Date 객체로 변환
                    }));
                    setDividend(dividendsData);
                    setIsLoading(false);
                    console.log("배당정보 : ");
                    console.log(response.data);
                })
                .catch(error => {
                    console.error("배당정보 못불러옴:", error);
                    setIsLoading(false); // 오류 발생 시 로딩 상태 업데이트
                });
        } else {
            console.error("user is not available in localStorage");
            setIsLoading(false);
        }
    }, []);

    // 날짜 변경 처리 함수
    const handleDateChange = (workcode, date) => {
        // 선택된 날짜를 로컬 상태에 저장합니다.
        setDividend(currentDividends =>
            currentDividends.map(div =>
                div.Dividend.Workcode === workcode ? { ...div, Cdate: date, isOpen: false } : div
            )
        );
        console.log(dividend);


        // 선택된 날짜를 서버에 저장하는 로직을 추가합니다.
        axios.post(`http://localhost:8000/update_dividend/`, {
            Workcode: workcode,
            // toLocaleDateString()을 사용하여 날짜를 YYYY-MM-DD 형식으로 변환
            Cdate: date.toLocaleDateString('en-CA'),
        })
            .then(response => {
                console.log("날짜 업데이트 성공: ", response);
            })
            .catch(error => {
                console.error("날짜 업데이트 실패: ", error);
            });
    };

    // 달력 토글 함수
    const toggleCalendar = (workcode) => {
        setDividend(currentDividends =>
            currentDividends.map(div =>
                div.Dividend.Workcode === workcode ? { ...div, isOpen: !div.isOpen } : { ...div, isOpen: false }
            )
        );
    };


    return (
        <div className='lv2_page'>
            <section id="title_sub">
                <div class="bg"></div>
                <h2 class="title">{workerName} 게시판</h2>
                <div class="scroll"><span></span></div>
            </section>
            <section className='containerV1'>
                <>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className='widget_kaempein'>
                            {dividend.length > 0 ? (
                                <>
                                    {dividend.map((item, index) => (
                                        <div className='post-row' key={index}>
                                            <div className='post-list list-item'>
                                                <button className='date_btn' onClick={() => toggleCalendar(item.Dividend.Workcode)}>
                                                </button>
                                                <div className='date_btn_text'>
                                                    완료일 지정
                                                </div>
                                                <div className={`date_ui ${item.isOpen ? 'open' : ''}`}>
                                                    {item.isOpen && (
                                                        <DatePicker
                                                            selected={item.Cdate}
                                                            onChange={(date) => handleDateChange(item.Dividend.Workcode, date)}
                                                            inline
                                                        />
                                                    )}
                                                </div>
                                                <figure className='post-image'>
                                                    <figure className='img' style={{
                                                        backgroundImage: `url(data:image/jpeg;base64,${item.ImgBase64})`,
                                                    }} />
                                                </figure>
                                                <section className='post-inner'>
                                                    <div className='line1'>
                                                        <p className='blog item-v1'>
                                                            {item.Dividend.Bunho}
                                                        </p>
                                                        <p class="hyeongtae item-v1">
                                                            송장코드 : {item.Dividend.Workcode}
                                                        </p>
                                                    </div>
                                                    <div className='titleBox'>
                                                        <div className="post-subject">
                                                            {item.Register.Title}
                                                        </div>
                                                        <p class="sub">
                                                            {item.Register.Add}
                                                        </p>
                                                    </div>
                                                    <div className="line3">
                                                        <div className="item-v1">
                                                            <div className="current">접수자 : {item.Dividend.UserName}</div>
                                                            /
                                                            <div className="total">시작 : {item.Dividend.Adate}</div>

                                                            <div className='status'>
                                                                <span className='color1'>{item.Cdate ? `완료 : ${new Date(item.Cdate).toLocaleDateString()}` : ""}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>배당 정보가 없습니다.</p>
                            )}
                        </div>
                    )}
                </>
            </section >
        </div >
    );
}

export default Lv2page;
