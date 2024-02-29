import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../AppContext';
import Form from './Form';
import Mypage from './Mypage';

function Main() {
    const { appName, appName1, User } = useAppContext();
    const [isUserTaken, setIsUserTaken] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/check_register/${User}/`)
            .then(response => {
                setIsUserTaken(response.data.is_taken);
                console.log(response.data.is_taken);
            })
            .catch(error => {
                console.error('Error checking user:', error);
            });
    }, [User]);

    if (!isUserTaken) {
        return (
            <div className='HYUN main_frame'>
                <main id="index_2n">
                    <article className="section section1">
                        <div className="itemBox1 containerV3">
                            <div className="titleBox">
                                <h2 className="title-v1">
                                    많은 발전소 운영자와 협력하는 <br />
                                    <span className='txt1 txt'>{appName} </span>
                                    <span className='txt2 txt'>{appName1}</span>
                                </h2>
                                <p className="text-v1">
                                    태양광 관리로 신속한 결함 진단과 효율적인 유지보수를 제공합니다.
                                </p>
                                <div className="line"></div>
                            </div>
                        </div>
                    </article>

                    <article className="section section6" id="section6_2n">
                        <div className="containerV3">
                            <div className="titleBox">
                                <p className="text-v2">
                                    <span className='txt1 txt'>{appName} </span>
                                    <span className='txt2 txt'>{appName1}</span>
                                    에 접수신청 하고
                                </p>
                                <h2 className="title-v1">
                                    당신만의 솔루션을 받아보세요.
                                </h2>
                            </div>
                            <Form />
                        </div>
                    </article>
                </main>
            </div>
        );
    } else {
        return (
            <>
                <Mypage/>
            </>
        );
    }
}

export default Main;
