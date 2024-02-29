import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../widget.css';

// Bunho / Ccode / User / Add / Imgurl / Title / Time / Workcode

function Lv3page() {
    const [registers, setRegisters] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [membership, setMembership] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [membershipCcode, setMembershipCcode] = useState(null);
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


    // company 테이블 조회
    useEffect(() => {
        axios.get('http://localhost:8000/companies/')
            .then(response => {
                setCompanies(response.data);
            })
            .catch(error => {
                console.error('There was an error retrieving the company data!', error);
            });
    }, []);

    // 로그인한 Ccode에 대한 company테이블 Cname 조회
    useEffect(() => {
        // localStorage에서 Ccode를 가져옴
        const ccode = localStorage.getItem('Ccode');
        
        if (ccode) {
            axios.get(`http://localhost:8000/get_company_name/${ccode}/`)
                .then(response => {
                    setCompanyName(response.data.Cname);
                    setIsLoading(false); // 데이터 로드 완료
                })
                .catch(error => {
                    console.error("There was an error fetching the company name:", error);
                    setIsLoading(false); // 오류 발생 시 로딩 상태 업데이트
                });
        } else {
            console.error("Ccode is not available in localStorage");
            setIsLoading(false);
        }
    }, []);


    // membership 테이블 조회
    useEffect(() => {
        axios.get('http://localhost:8000/get_membership/')
            .then(response => {
                setMembership(response.data);
            })
            .catch(error => {
                console.error('There was an error retrieving the company data!', error);
            });
    }, []);

    // 로그인한 Ccode에 대한 membership테이블 Ccode 조회
    useEffect(() => {
        // localStorage에서 Ccode를 가져옴
        const ccode = localStorage.getItem('Ccode');
        
        if (ccode) {
            axios.get(`http://localhost:8000/get_membership_ccode/ccode/${ccode}/`)
                .then(response => {
                    setMembershipCcode(response.data.Ccode);
                    console.log(membershipCcode);
                    setIsLoading(false); // 데이터 로드 완료
                })
                .catch(error => {
                    console.error("There was an error fetching the company name:", error);
                    setIsLoading(false); // 오류 발생 시 로딩 상태 업데이트
                });
        } else {
            console.error("Ccode is not available in localStorage");
            setIsLoading(false);
        }
    }, []);

  
    // User 해당하는 Name 찾기
    const getNameByUser = (user) => {
        const member = membership.find(member => member.User === user);
        return member ? member.Name : '알 수 없음';
    }

    // 날짜변환
    function formatDate(dateString) {
        const date = new Date(dateString);
        let year = date.getFullYear().toString().substring(2); // 년도의 마지막 두 자리
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (0-11 이므로 1을 더함)
        let day = date.getDate().toString().padStart(2, '0'); // 일

        return `${year}.${month}.${day}`;
    }


    return (
        <div className='HYUN lv3_page'>
            <section id="title_sub">
                <div class="bg"></div>
                <h2 class="title">{companyName} 회사 접수 게시판</h2>
                <div class="scroll"><span></span></div>
            </section>
            <section className='containerV1'>
                <div className="basic-post-list-page">
                    <section className="list-board ik-board-basic">
                        <div className="div-head">
                            <span className="wr-num hidden-xs">번호</span>
                            <span className="wr-subject">요청사항</span>
                            <span className="wr-name hidden-xs">접수자</span>
                            <span className="wr-date hidden-xs">접수일</span>
                        </div>
                        <ul className="post-list list-body">
                            {/* 배당자 회사로 요청들어온 접수만 출력 */}
                            {registers.filter(register => register.Ccode === membershipCcode)
                                .map(filteredRegister => (
                                    <li className="list-item" key={filteredRegister.Bunho}>
                                        <div className="wr-num hidden-xs">{filteredRegister.Bunho}</div>
                                        <div className="wr-subject">
                                            <Link className="item-subject" to={`/register_detail/${filteredRegister.Bunho}`}>
                                                {filteredRegister.Title}
                                            </Link>
                                        </div>
                                        <div className="wr-name hidden-xs">
                                            {getNameByUser(filteredRegister.User)}
                                        </div>
                                        <div className="wr-date hidden-xs">
                                            {formatDate(filteredRegister.Time)}
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </section>
                </div>
            </section >
        </div >
    );
}

export default Lv3page;
