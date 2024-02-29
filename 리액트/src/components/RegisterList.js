import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import axios from 'axios';
import '../widget.css';

// Bunho / Ccode / User / Add / Imgurl / Title / Time / Workcode

function RegisterList() {
    const { Ccode } = useAppContext();
    const [registers, setRegisters] = useState([]);
    const [membership, setMembership] = useState([]);

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
        <div className="basic-post-list-page">
            <section className="list-board ik-board-basic">
                <div className="div-head">
                    <span className="wr-num hidden-xs">번호</span>
                    <span className="wr-subject">요청사항</span>
                    <span className="wr-name hidden-xs">접수자</span>
                    <span className="wr-date hidden-xs">접수일</span>
                </div>
                <ul className="post-list list-body">
                    {registers.filter(register => register.Ccode === Ccode)
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
    );
}

export default RegisterList;
