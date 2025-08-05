import React from "react";
import styled from "styled-components";
import heroImg from "../assets/hero-img.png";

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  height: 60vh; /* reduced height */

  @media (max-width: 768px) {
    height: 70vh; /* slightly taller on small screens */
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(40%) contrast(1.1) brightness(0.9);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Content = styled.div`
  color: white;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;

  h1 {
    font-size: 42px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  p {
    font-size: 18px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  button {
    margin: 6px 10px;
    padding: 10px 24px;
    font-size: 15px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;

    @media (max-width: 768px) {
      display: block;
      width: 100%;
      max-width: 280px;
      margin: 8px auto;
    }
  }

  .get-started {
    background-color: #1e3a8a;
    color: white;
  }

  .get-started:hover {
    background-color: #f0f0f0;
    color: #1e3a8a;
  }

  .view-courses {
    background-color: #f0f0f0;
    color: #1e3a8a;
  }

  .view-courses:hover {
    background-color: #1e3a8a;
    color: #f0f0f0;
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
