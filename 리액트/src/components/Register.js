import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../AppContext';

function Register() {
    const [User, setUser] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [Name, setName] = useState('');
    const [Hp, setHp] = useState('');
    const [Level, setLevel] = useState('');
    const [Count, setCount] = useState(0);
    const [pwValidationMessage, setPwValidationMessage] = useState('');
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [membership, setMembership] = useState([]);
    const [membershipLevel, setMembershipLevel] = useState(null);
    const [role, setRole] = useState('');
    const { login } = useAppContext();
    const navigate = useNavigate();
    // 기본 회사 코드 설정
    const defaultCompanyCcode = companies.length > 0 ? companies[1].Ccode : null;


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

    // 중복 아이디 검사
    const checkUsername = () => {
        axios.get(`http://localhost:8000/check_username/?User=${User}`)
            .then(response => {
                if (response.data.is_taken) {
                    alert("이미 사용중인 아이디입니다.");
                } else {
                    alert("사용 가능한 아이디입니다.");
                }
            })
            .catch(error => {
                console.error("There was an error!", error);
            });
    };

    // 비밀번호 확인 입력시 일치 여부를 확인하는 함수
    const checkPasswordMatch = (password, confirmPassword) => {
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                setPwValidationMessage("비밀번호가 일치하지 않습니다.");
            } else {
                setPwValidationMessage("비밀번호가 일치합니다.");
            }
        } else {
            setPwValidationMessage("");
        }
    };

    // 회사명 변경시 연락처 업데이트 
    const handleCompanyChange = e => {
        const companyCode = parseInt(e.target.value);
        const company = companies.find(c => c.Ccode === companyCode);
        setSelectedCompany(company); // 선택된 회사 상태 업데이트

        if (company) {
            setHp(company.Call || '');
        }
    };

    const handleRoleChange = e => {
        setRole(e.target.value);
    };

    useEffect(() => {
        console.log("role : "+role);
    }, [role]);


    // 작성완료 클릭 후 유효성 검사
    const handleSignup = () => {

        // 비밀번호 일치 여부 검사
        if (pw !== confirmPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 모든 필드가 채워졌는지 검사
        if (!User || !pw || !confirmPw || !Name || !Hp) {
            alert("모든 정보를 입력해주세요.");
            return;
        }


        const requestData = {
            User,
            Pw: pw, // 'Pw' 필드명으로 변경
            Name,
            Hp,
            Ccode: activeTab === 'individual' ? 0 : (selectedCompany ? selectedCompany.Ccode : defaultCompanyCcode),
            Level: role || "1", // Level 필드 추가, 값이 없으면 null
            Count: Count || 0    // Count 필드 추가, 값이 없으면 0
        };

        // 전송하는 데이터를 콘솔에 출력
        console.log('Sending request data:', requestData);

        axios.post('http://localhost:8000/register/', requestData)
            .then(response => {
                alert('회원가입 성공!');
                login(User, requestData.Ccode);
                // 여기서 멤버십 레벨을 업데이트하고 리디렉션 처리
                axios.get(`http://localhost:8000/get_membership_level/${User}/`)
                    .then(response => {
                        const level = response.data.Level;
                        setMembershipLevel(level);
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
                    })
                    .catch(error => {
                        console.error("There was an error fetching the membership level:", error);
                        navigate('/'); // 오류 시 기본 경로로 리디렉션
                    });
            })
            .catch(error => {
                alert('회원가입 실패: ' + error.message);
            });
    };

    // 탭이 개인인지 기업인지 체크
    const [activeTab, setActiveTab] = useState('individual');

    // 개인 / 기업 탭 전환시 모든 필드 초기화
    const changeTab = (tabName) => {
        setActiveTab(tabName);
        // 모든 필드 초기화
        setUser('');
        setPw('');
        setConfirmPw('');
        setName('');
        setHp('');
        setPwValidationMessage('');

        // 기업 탭이 선택되면, 첫 번째 회사의 정보로 필드 초기화
        if (tabName === 'corporate' && companies.length > 0) {
            const firstCompany = companies[1]; // 첫 번째 회사 (0번 인덱스는 제외)
            setHp(firstCompany.Call || '');
            setRole('2');
        }
    };

    // 탭 변경 감지 및 초기 기업 선택
    useEffect(() => {
        if (activeTab === 'corporate' && companies.length > 0) {
            const firstCompany = companies[1]; // 첫 번째 회사 (0번 인덱스는 제외)
            setHp(firstCompany.Call || '');
            setRole('2');
        }
    }, [activeTab, companies]);

    // 개인 회원가입 폼을 렌더링하는 함수입니다.
    const renderIndividualForm = () => {
        // companies 배열이 비어 있지 않은지 확인
        if (!companies.length) {
            return <div>로딩 중...</div>; // 또는 다른 로딩 표시
        }

        return (
            <>
                <li>
                    <input
                        type="hidden"
                        name='Ccode'
                        id='Ccode'
                        value={companies[0]['Ccode']}
                        readOnly
                    />
                </li>
            </>
        );
    };

    // 기업 회원가입 폼을 렌더링하는 함수입니다.
    const renderCorporateForm = () => (
        <>
            <li>
                <label htmlFor="Ccode">회사명</label>
                <div className='select_container'>
                    <select className="select_v1" id='Cname' name="Cname" onChange={handleCompanyChange}>
                        {companies.slice(1).map(company => (
                            <option key={company.Ccode} value={company.Ccode}>{company.Cname}</option>
                        ))}
                    </select>
                </div>
            </li>
            {activeTab === 'corporate' && (
                <li>
                    <label>직급</label>
                    <div className='select_container'>
                        <select className="select_v1" value={role} onChange={handleRoleChange}>
                            <option value="2">작업자</option>
                            <option value="3">관리자</option>
                        </select>
                    </div>
                </li>
            )}

        </>
    );

    // 공통 폼 렌더링
    const renderForm = () => (
        <div>
            <ul className='field_box'>
                {activeTab === 'individual' ? renderIndividualForm() : renderCorporateForm()}
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
                    <button className='check_user' onClick={checkUsername}>중복검사</button>
                </li>
                <li>
                    <label htmlFor="Pw">비밀번호</label>
                    <input
                        id='Pw'
                        name='Pw'
                        type="password"
                        value={pw}
                        onChange={e => {
                            setPw(e.target.value);
                            checkPasswordMatch(e.target.value, confirmPw);
                        }}
                        placeholder="비밀번호 입력"
                        required
                    />
                </li>
                <li>
                    <label htmlFor="pwcheck">비밀번호 확인</label>
                    <div className='pwcheckBox'>
                        <input
                            id='pwcheck'
                            name='pwcheck'
                            type="password"
                            value={confirmPw}
                            onChange={e => {
                                setConfirmPw(e.target.value);
                                checkPasswordMatch(pw, e.target.value);
                            }}
                            placeholder="비밀번호 재입력"
                            required
                        />
                        <div className={
                            pwValidationMessage === "비밀번호가 일치하지 않습니다."
                                ? "password-validation-message warning"
                                : "password-validation-message match"
                        }>
                            {pwValidationMessage}
                        </div>

                    </div>
                </li>
                <li>
                    <label htmlFor="Name">이름</label>
                    <input
                        type="text"
                        name='Name'
                        id='Name'
                        value={Name}
                        onChange={e => setName(e.target.value)}
                        placeholder=""
                        required
                    />
                </li>
                <li>
                    <label htmlFor="Hp">연락처</label>
                    <input
                        type="text"
                        name='Hp'
                        id='Hp'
                        value={Hp}
                        onChange={e => setHp(e.target.value)}
                        placeholder=""
                        required
                        readOnly={activeTab === 'corporate'}
                    />
                </li>
            </ul>
        </div>
    );

    return (
        <div className='HYUN register_frame containerV1'>
            <h1>회원가입</h1>
            <div className="tab-menu">
                <button
                    onClick={() => changeTab('individual')}
                    className={activeTab === 'individual' ? 'active' : ''}
                >
                    개인
                </button>
                <button
                    onClick={() => changeTab('corporate')}
                    className={activeTab === 'corporate' ? 'active' : ''}
                >
                    기업
                </button>
            </div>
            <div className="tab-content">
                {renderForm()}
                <div className='btn_v1'>
                    <Link to="/" className="link auth-link">취소</Link>
                    <button className='link auth-link' onClick={handleSignup}>작성완료</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
