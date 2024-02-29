import React, { useEffect,useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../AppContext';

function Login() {
    const [User, setUser] = useState('');
    const [Pw, setPw] = useState('');
    const [membership, setMembership] = useState([]);
    const [membershipLevel, setMembershipLevel] = useState(null);
    const navigate = useNavigate();
    const { login } = useAppContext();

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

    const handleLogin = () => {
        const requestData = {
            User,
            Pw,
        };

        // 전송하는 데이터를 콘솔에 출력
        console.log('Sending request data:', requestData);

        // 로그인 요청 전송
        axios.post('http://localhost:8000/login/', requestData)
            .then(response => {
                // 장고서버에 요청해서 아이디 비번 맞으면 로그인
                const { Ccode } = response.data;
                console.log('response.data:', response.data);
                alert('로그인 성공!');
                login(User, Ccode);
                // User를 요청 , Level을 응답 받아서
                axios.get(`http://localhost:8000/get_membership_level/${User}/`)
                    .then(response => {
                        const level = response.data.Level;
                        setMembershipLevel(level);
                        // Level 따라 이동하는 페이지가 다름
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
                    })
                    .catch(error => {
                        console.error("There was an error fetching the membership level:", error);
                        navigate('/'); // 오류 시 기본 경로로 리디렉션
                    });
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                } else {
                    alert('로그인 실패: ' + error.message);
                }
            });
    };

    return (
        <div className='HYUN login_frame containerV1'>
            <figure className='img'><img src='/img/logo.png' /></figure>
            <section className='login_contents'>
                <div className='inner'>
                    <ul className='box1'>
                        <li>
                            <label htmlFor="User">아이디</label>
                            <input
                                type="text"
                                name='User'
                                id='User'
                                value={User}
                                onChange={e => setUser(e.target.value)}
                                placeholder=""
                                required
                            />
                        </li>
                        <li>
                            <label htmlFor="Pw">비밀번호</label>
                            <input
                                type="password"
                                name='Pw'
                                id='Pw'
                                value={Pw}
                                onChange={e => setPw(e.target.value)}
                                placeholder=""
                            />
                        </li>
                    </ul>
                    <div className='btn_v1'>
                        <button className='link auth-link' onClick={handleLogin}>로그인</button>
                        <Link to="/register" className="link auth-link">회원가입</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
