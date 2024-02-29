import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import MapComponent from './MapComponent';

function Form() {       // 입력받은 값 저장
    const { User } = useAppContext();
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState({});
    const [Add, setAdd] = useState('');
    const [file, setFile] = useState(null);
    const [Title, setTitle] = useState('');
    const navigate = useNavigate();

    // company 테이블 조회
    useEffect(() => {   // 장고서버 리스폰, 데이터 있으면 가져옴
        axios.get('http://localhost:8000/companies/')
            .then(response => {
                console.log(response.data)
                setCompanies(response.data);
            })
            .catch(error => {
                console.error('There was an error retrieving the company data!', error);
            });
    }, []);

    // 회사코드, 회사 선택하면 SelectedCompany 업데이트 함순
    const handleCompanyChange = (company) => {
        setSelectedCompany(company);
    };

    // 입력값 변경 핸들러
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'Add':
                setAdd(value);
                break;
            case 'file':
                setFile(event.target.files[0]);
                break;
            case 'Title':
                setTitle(value);
                break;
            default:
                break;
        }
    };

    // 작성완료시, 비동기함수(동시진행)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 현재 날짜와 시간을 얻기
        const now = new Date();
        // ISO 형식으로 변환 (예: 2023-01-31T14:45:07.123Z)
        const isoDateTime = now.toISOString();
        // 입렵데이터 서버 전송
        const formData = new FormData();
        formData.append('Ccode', selectedCompany.Ccode);
        formData.append('User', User);
        formData.append('Add', Add);
        formData.append('file', file);
        formData.append('Title', Title);
        formData.append('Time', isoDateTime);

        try {
            const response = await axios.post('http://localhost:8000/register_v1', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('접수 신청 성공');
                // 성공 후 마이페이지 이동
                navigate('/login');
            } else {
                console.error('접수 신청 실패:', response.data);
            }
        } catch (error) {
            console.error('서버 오류:', error);
        }
    };

    return (
        <div className='HYUN form_frame'>
            <form id="form_2n" name="fwrite" method="post" onSubmit={handleSubmit}>
                <input type='hidden' value={User} name='User' id='User' />
                <article id="formBox">
                    <ul className="itemBox">
                        <li className='map_container'>
                            <label className='title_v1' htmlFor="Ccode">회사명</label>
                            <section className='tab_wrap'>
                                {selectedCompany && (
                                    <div className="company-address">
                                        {/* <p>주소: {selectedCompany.Add}</p> */}
                                        <MapComponent address={selectedCompany.Add} />
                                    </div>
                                )}
                                <div className="tab-container">
                                    {companies.map((company, index) => (
                                        index !== 0 &&  // 첫 번째 회사는 렌더링하지 않습니다.
                                        <div className="tab" key={company.Ccode}>
                                            <input
                                                type="radio"
                                                id={company.Ccode}
                                                name="Cname"
                                                value={company.Ccode}
                                                checked={selectedCompany && selectedCompany.Ccode === company.Ccode}
                                                onChange={() => handleCompanyChange(company)}
                                            />
                                            <label htmlFor={company.Ccode}>{company.Cname}</label>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </li>
                        <li className="two-input">
                            <label htmlFor="Title" className='title_v1'>요청사항</label>
                            <input
                                type="text"
                                name='Title'
                                id='Title'
                                className="inputType1"
                                value={Title}
                                onChange={handleChange}
                                placeholder='50자 이내로 기입해주세요.'
                                required />
                        </li>
                        <li className="two-input">
                            <label htmlFor="Add" className='title_v1'>주소</label>
                            <input
                                type="text"
                                name='Add'
                                id='Add'
                                className="inputType1"
                                value={Add}
                                onChange={handleChange}
                                placeholder='주소를 기입해주세요.'
                                required />
                        </li>
                        <li>
                            <label htmlFor="Title" className='title_v1'>첨부파일</label>
                            <div className='file_wrap'>
                                <input type="file" name="file" id="Title" onChange={handleChange} />
                            </div>
                        </li>
                    </ul>
                    <ul className="agreeAndSubmit">
                        <li>
                            <input type="submit" id="ibtn_submit" value="접수 신청하기" className="submitType1" />
                        </li>
                    </ul>
                </article>
            </form>
        </div>
    );
}

export default Form;
