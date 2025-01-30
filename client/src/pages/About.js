import React from 'react';
import './About.css';
import Header from './Header';
import profileImg from '../asserts/profile.jpg';

const About = () => {
    return (
        <div className="about-container">
            <Header />
            <div className="about-content">
                <div className="hero-section">
                    <div className="profile-container">
                        <img src={profileImg} alt="Mohammed Safil" className="profile-image" />
                        <div className="social-links">
                            <a href="https://github.com/mohammedsafil" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/mohammedsafil039/" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin"></i>
                            </a>
                            <a href="https://www.instagram.com/ya__shafi__/" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                    <div className="hero-text">
                        <h1>Mohammed Safil</h1>
                        <h2>Full Stack Developer</h2>
                        <p className="tagline">Turning ideas into elegant digital solutions</p>
                    </div>
                </div>

                <div className="about-sections">
                    <section className="about-section">
                        <h2><i className="fas fa-user"></i> About Me</h2>
                        <p>Passionate Full Stack Developer with a love for creating beautiful and functional web applications. I specialize in modern web technologies and believe in writing clean, maintainable code that makes a difference.</p>
                    </section>

                    <section className="about-section">
                        <h2><i className="fas fa-laptop-code"></i> Skills</h2>
                        <div className="skills-grid">
                            <div className="skill-item">
                                <i className="fab fa-react"></i>
                                <span>React.js</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-node-js"></i>
                                <span>Node.js</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-js"></i>
                                <span>JavaScript</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-html5"></i>
                                <span>HTML5</span>
                            </div>
                            <div className="skill-item">
                                <i className="fab fa-css3-alt"></i>
                                <span>CSS3</span>
                            </div>
                            <div className="skill-item">
                                <i className="fas fa-database"></i>
                                <span>MongoDB</span>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2><i className="fas fa-graduation-cap"></i> Education</h2>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-date">2020 - 2024</div>
                                <div className="timeline-content">
                                    <h3>Bachelor of Engineering in Computer Science</h3>
                                    <p>Sri Eshwar College of Engineering, Coimbatore</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-date">2019 - 2020</div>
                                <div className="timeline-content">
                                    <h3>Higher Secondary Education</h3>
                                    <p>Government Higher Secondary School</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2><i className="fas fa-briefcase"></i> Experience</h2>
                        <div className="experience-cards">
                            <div className="experience-card">
                                <div className="experience-header">
                                    <i className="fas fa-code"></i>
                                    <h3>Full Stack Development</h3>
                                </div>
                                <p>Specialized in building responsive web applications using modern technologies like React, Node.js, and MongoDB.</p>
                            </div>
                            <div className="experience-card">
                                <div className="experience-header">
                                    <i className="fas fa-mobile-alt"></i>
                                    <h3>Mobile-First Design</h3>
                                </div>
                                <p>Created mobile-responsive interfaces ensuring seamless user experience across all devices.</p>
                            </div>
                        </div>
                    </section>

                    <section className="about-section">
                        <h2><i className="fas fa-heart"></i> Interests</h2>
                        <div className="interests-container">
                            <div className="interest-item">
                                <i className="fas fa-code"></i>
                                <span>Coding</span>
                            </div>
                            <div className="interest-item">
                                <i className="fas fa-book"></i>
                                <span>Reading</span>
                            </div>
                            <div className="interest-item">
                                <i className="fas fa-dumbbell"></i>
                                <span>Fitness</span>
                            </div>
                            <div className="interest-item">
                                <i className="fas fa-futbol"></i>
                                <span>Sports</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
