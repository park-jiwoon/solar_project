import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';

function Head() {
    const { logout,User } = useAppContext();
    const [membership, setMembership] = useState([]);
    const [membershipLevel, setMembershipLevel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 로그아웃
    const handleLogout = () => {
        logout(); // 로그아웃 처리
        navigate('/'); // 메인 페이지로 이동
    };

    // 회원탈퇴
    const handleDel = () => {
        const user = { User: User };

        console.log("user : "+user);

        axios.post('http://localhost:8000/delete_user/', user)
            .then(response => {
                console.log("user"+user);
                console.log(response.data);
                alert('회원 탈퇴가 성공적으로 처리되었습니다');
                navigate('/'); // 메인 페이지로 이동
            })
            .catch(error => {
                console.error('Error:', error);
                alert('회원 탈퇴에 실패했습니다: ' + error.message);
            });
    };

    // 작업자게시판 이동
    const handleLv2 = () => {
        navigate('/lv2page');
    };

    // 접수게시판 이동
    const handleLv3 = () => {
        navigate('/lv3page');
    };

    // membership 테이블 조회
    useEffect(() => {
        axios.get('http://localhost:8000/get_membership/')
            .then(response => {
                setMembership(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error retrieving the company data!', error);
            });
    }, []);

    // 로그인한 User에 대한 membership테이블 Level 조회
    useEffect(() => {
        // localStorage에서 Ccode를 가져옴
        const User = localStorage.getItem('User');

        if (User) {
            axios.get(`http://localhost:8000/get_membership_level/${User}/`)
                .then(response => {
                    setMembershipLevel(response.data.Level);
                    console.log(response.data.Level);
                    setIsLoading(false); // 데이터 로드 완료
                })
                .catch(error => {
                    console.error("There was an error fetching the company name:", error);
                    setIsLoading(false); // 오류 발생 시 로딩 상태 업데이트
                });
        } else {
            console.error("User is not available in localStorage");
            setIsLoading(false);
        }
    }, []);

    const renderMembershipLevel = (level) => {
        // 5. 권한에 따른 메뉴 및 화면 업데이트
        // 일반회원 -> 회원탈퇴 / 로그아웃 / 접수신청(메인화면)
        // 작업자 -> 회원탈퇴 / 로그아웃 / 작업자게시판(메인화면)
        // 배당자 -> 회원탈퇴 / 로그아웃 / 접수게시판(메인화면)

        switch (level) {
            case "1": // 일반회원
                return (
                    <>
                        <li className="shincheong">
                            <a className='link' href="#section6_2n">접수 신청하기</a>
                        </li>
                    </>
                );

            case "2": // 작업자
                return (
                    <>
                        <li className="shincheong">
                            <button className='link' onClick={handleLv2}>작업자게시판</button>
                        </li>
                    </>
                );

            case "3": // 배당자
                return (
                    <>
                        <li className="shincheong">
                            <button className='link' onClick={handleLv3}>접수게시판</button>
                        </li>
                    </>
                );

            default:
                return <p>Unknown Membership Level</p>;
        }
    }


    const handleLogo = (level) => {
        // 멤버십 레벨에 따른 리디렉션
        switch (level) {
            case "1": // 일반 회원
                navigate('/login');
                break;
            case "2": // 작업자
                navigate('/lv2page');
                break;
            case "3": // 배당자
                navigate('/lv3page');
                break;
            default:
                navigate('/'); // 기본 경로
        }
    };


    return (
        <nav id="head_2n">
            <h2 className="logo_2n">
                <button onClick={() => handleLogo(membershipLevel)}><img src="/img/logo.png" alt="" /></button>
            </h2>
            <ul className="linkBox">
                <li>
                    <button className='link' onClick={handleLogout}>로그아웃</button>
                </li>
                <li>
                    <button className='link' onClick={handleDel}>회원탈퇴</button>
                </li>
                {renderMembershipLevel(membershipLevel)}
            </ul>
        </nav>
    );
}

export default Head;
