import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MapComponent from './MapComponent';
import WorkDividendForm from './WorkDividendForm';

function RegisterDetail() {
    const { bunho } = useParams();
    const [details, setDetails] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/register_detail/${bunho}`)
            .then(response => {
                setDetails(response.data);
            })
            .catch(error => {
                console.log(error);
                // 사용자에게 오류 메시지를 표시
                setDetails({ error: "데이터를 불러오는데 실패했습니다." });
            });
    }, [bunho]);

    if (!details) return <div>Loading...</div>;

    if (details.error) return <div>{details.error}</div>;

    // 날짜변환
    function formatDate(dateString) {
        const date = new Date(dateString);
        let year = date.getFullYear().toString().substring(2); // 년도의 마지막 두 자리
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (0-11 이므로 1을 더함)
        let day = date.getDate().toString().padStart(2, '0'); // 일

        return `${year}.${month}.${day}`;
    }

    return (
        <div className='HYUN Detail'>
            <section id="title_sub">
                <div class="bg"></div>
                <h2 class="title">{details.Bunho} - {details.Title}</h2>
                <div class="scroll"><span></span></div>
            </section>
            <section className='detail_wrap containerV1'>
                <div className='map_wrap'>
                    <MapComponent address={details.Add} />
                </div>
                <div className='info_wrap'>
                    <h2 className='title_v1'>요청사항 : {details.Title}</h2>
                    <p className='textBox'>
                        <span className='text1'>user</span>
                        <span className='text2'>
                            아이디 : {details.User} | 이름 : {details.Name}
                        </span>
                    </p>
                    <p className='textBox'>
                        <span className='text1'>address</span>
                        <span className='text2'>주소 : {details.Add}</span>
                    </p>
                    <p className='textBox'>
                        <span className='text1'>date</span>
                        <span className='text2'>접수일: {formatDate(details.Time)}</span>
                    </p>
                    
                    {/* <p>Imgurl: {details.Imgurl}</p> */}
                </div>
            </section>
            <section className='dividend containerV1'>
                <div className='dividend_box'>
                    <WorkDividendForm user={details.User} bunho={details.Bunho}/>
                </div>
            </section>
        </div>
    );
}

export default RegisterDetail;

