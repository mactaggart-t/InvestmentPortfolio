import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';
import Header from "../header/header"
import './about.css'
import personalInv from '../../images/personalInvestments.jpeg'
import sp500 from '../../images/s&p500.jpg'
import research from '../../images/research.jpg'

function Card(props) {
    const history = useHistory();
    return (
        <>
            <div className="card">
                <img src={props.image}
                     alt={props.title} style={{width : "100%"}}/>
                <div className="container">
                    <h2>{props.title}</h2>
                    <p>{props.desc}</p>
                    <p>
                        <button onClick={() => history.push(props.location)} type="button"
                                className="button">{props.title}
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
};


function Pages() {
    return (
        <>
            <h2 style={{"text-align": "center"}}>Pages</h2>
            <div className="row">
                <div className="column">
                    <Card
                    title={"Personal Investments"}
                    desc={"Sign in to manage your portfolio or view a sample"}
                    image={personalInv}
                    location={"/personalInv"}>
                    </Card>
                </div>
                <div className="column">
                    <Card
                    title={"S&P500"}
                    desc={"Take a look at the S&P500 to see how the securities are performing today"}
                    image={sp500}
                    location={"/sp500"}>
                    </Card>
                </div>
                <div className="column">
                    <Card
                    title={"Research"}
                    desc={"Research securities and compare past performance"}
                    image={research}
                    location={"/research"}>
                    </Card>
                </div>
            </div>
        </>
    );
}

function About() {
    return (
        <>
            <Header selected={'about'}/>
            <div className ={"about-section"}>
            <h1> About This Website </h1>
            <p>My name is Thomas Mactaggart and I'm a Computer Engineering and Computer Science major at Northeastern
                university.
                This is a project I've been working on since July 2020 to help research and manage my investment portfolio. The
                goal is to replace
                the old style excel document used to manage investments. Feel free to take a look around and make an account to
                log your investments
                if you'd like. If you find a bug or a glitch in the site, email me at mactaggart.thomas@gmail.com. A note about
                data storage and privacy:
                any data you enter into the Portfolio page (i.e. sales and purchases of stocks) will be stored in an AWS
                database instance. I am the only one with
                access to the password and thus the database information. I am not doing anything with the data outside of this
                website, once again feel free to email
                me with any questions.
            </p>
            </div>
            <Pages/>
        </>
    );
}

export default About