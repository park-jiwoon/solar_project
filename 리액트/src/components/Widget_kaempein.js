import React, { useEffect, useState } from 'react';
import axios from 'axios';
// 갤러리 형태 스타일
import '../kaempein_style.css';

function Widget_kaempein() {
    const [registers, setRegisters] = useState([]);
    const [companies, setCompanies] = useState([]);

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

    return (
        <article className='widget_kaempein'>
            {registers.map(register => (
                <div className='post-row' key={register.Bunho}>
                    <div className='post-list list-item'>
                        <figure className='post-image'>
                            {/* detail경로 */}
                            <a href=''>
                                {register.Imgurl}

                            </a>
                        </figure>
                        <section className='post-inner'>
                            <div className='line1'>
                                <p className='blog item-v1'>
                                    {register.Bunho}
                                </p>
                                <p class="hyeongtae item-v1">
                                    {register.Ccode}
                                </p>
                            </div>
                            <div className='titleBox'>
                                <div className="post-subject">
                                    {/* detail경로 */}
                                    <a href="">
                                        {register.Title}
                                    </a>
                                </div>
                                <p class="sub">
                                    {register.Add}
                                </p>
                            </div>
                            <div className="line3">
                                <div className="item-v1">
                                    <div className="current">{register.User}</div>
                                    /
                                    <div className="total">{register.Time}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ))}
        </article>
    );
}

export default Widget_kaempein;
