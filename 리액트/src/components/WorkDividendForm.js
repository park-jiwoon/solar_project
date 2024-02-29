// WorkDividendForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WorkDividendForm({ user, bunho }) {
    const [workerDetails, setWorkerDetails] = useState([]); // 초기값을 빈 배열로 설정
    const [isLoading, setIsLoading] = useState(true);
    const [userState,setUserState] = useState('');

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8000/predict_image/user/${user}/`)
                .then(response => {
                    console.log("상태 : ");
                    console.log(response.data.predicted_state);
                    setUserState(response.data.predicted_state);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("상태 못불러옴:", error.response.data);
                    setIsLoading(false); // 오류 발생 시 로딩 상태 업데이트
                });
        } else {
            console.error("user is not available in localStorage");
            setIsLoading(false);
        }
    }, []);

    // 초기 폼 상태를 설정합니다. 실제 사용 시에는 추가적인 초기값을 설정할 수 있습니다.
    const [formData, setFormData] = useState({
        Workcode: '', // 작업 코드
        Adate: '',    // 작업 시작일
        Cdate: '',    // 작업 종료일
        User: '',     // 사용자
        Saveurl: '',  // 저장된 작업 이미지 URL
        Worker: '',   // 작업자
        state: ''     // 상태
    });

    // 입력값 변경 시 상태를 업데이트하는 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData.state);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        // FormData 객체를 생성하여 파일과 다른 폼 데이터를 함께 전송합니다.
        const dataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            dataToSubmit.append(key, formData[key]);
        });

        // bunho도 함께 전송합니다.
        dataToSubmit.append('Bunho', bunho);

        try {
            // Django 백엔드 엔드포인트로 POST 요청을 보냅니다.
            const response = await axios.post('/api/dividend', dataToSubmit);
            console.log(response.data);
            // 성공 메시지 표시 또는 추가 작업을 수행합니다.
        } catch (error) {
            console.error('작업 배당 신청 에러', error
            );
            // 에러 처리 로직을 구현합니다. 사용자에게 에러 메시지를 표시할 수 있습니다.
        }
    };

    useEffect(() => {
        // localStorage에서 Ccode를 가져옴
        const ccode = localStorage.getItem('Ccode');
        const level = "2";
        
        if (ccode) {
            axios.get(`http://localhost:8000/get_membership_ccode/ccode/${ccode}/level/${level}/`)
                .then(response => {
                    // response.data가 문자열인 경우에만 JSON.parse()를 사용
                    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                    setWorkerDetails(data); // 데이터를 상태에 설정
                })
                .catch(error => {
                    console.error("There was an error fetching the data:", error);
                });
        } else {
            console.error("Ccode is not available in localStorage");
        }
      }, []);
      

    // 폼 렌더링
    return (
        <form onSubmit={handleSubmit}>
            {/* 각 필드를 입력 요소로 렌더링합니다. */}
            <div>
                <label htmlFor="Workcode">작업 코드:</label>
                <input
                    type="text"
                    id="Workcode"
                    name="Workcode"
                    value={formData.Workcode}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="Adate">작업 시작일:</label>
                <input
                    type="date"
                    id="Adate"
                    name="Adate"
                    value={formData.Adate}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="Cdate">작업 종료일:</label>
                <input
                    type="date"
                    id="Cdate"
                    name="Cdate"
                    value={formData.Cdate}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="User">사용자:</label>
                <input
                    type="text"
                    id="User"
                    name="User"
                    value={formData.User}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="Saveurl">저장된 작업 이미지 URL:</label>
                <input
                    type="text"
                    id="Saveurl"
                    name="Saveurl"
                    value={formData.Saveurl}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="Worker">작업자:</label>
                <select>
                    {workerDetails.map((detail, index) => (
                        <option key={index} value={detail.pk}>
                            {detail.fields.Name} - {detail.fields.Count}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="state">상태:</label>
                <input
                    type="state"
                    id="state"
                    name="state"
                    value={userState}
                    onChange={handleInputChange}
                    readOnly
                />
            </div>
            <button type="submit">작업 배당 신청</button>
        </form>
    );
}

export default WorkDividendForm;