import React from "react";
import styled from "styled-components";
import heroImg from "../assets/hero-img.png"; // Update this with your own image

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(40%) contrast(1.1) brightness(0.9);
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45); /* dark overlay for readability */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  color: white;
  text-align: center;
  max-width: 800px;
  padding: 20px;

  h1 {
    font-size: 52px;
    margin-bottom: 20px;
    color: #ffffffff ;
  }

  p {
    font-size: 20px;
    margin-bottom: 30px;
    color: #e0e0e0;
  }

  button {
    margin: 0 10px;
    padding: 12px 26px;
    font-size: 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .get-started {
    background-color: #1E3A8A ;
    color: white;
  }

  .get-started:hover {
    background-color: #f0f0f0;
    color: #1E3A8A;
  }

  .view-courses {
    background-color: #f0f0f0;
    color: #1E3A8A;
  }

  .view-courses:hover {
    background-color: #1E3A8A ;
    color:#f0f0f0;
  }
`;

const HeroSection = () => {
  return (
    <Wrapper>
      <BackgroundImage src={heroImg} alt="Online Learning" />
      <Overlay>
        <Content>
          <h1>Learn from the Best with Mentor Craft</h1>
          <p>Build skills with online courses from top instructors. Anytime, anywhere.</p>
          <button className="get-started">Get Started</button>
          <button className="view-courses">View Courses</button>
        </Content>
      </Overlay>
    </Wrapper>
  );
};

export default HeroSection;
