import React from "react";
import styled from "styled-components";
import heroImg from "../assets/hero-img.png"; // Add an image similar to the template

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 60px 30px;
  background-color: #f9f9f9;
`;

const Left = styled.div`
  flex: 1;
  min-width: 300px;

  h1 {
    font-size: 48px;
    color: rgb(32, 125, 140);
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #444;
    margin-bottom: 30px;
  }

  button {
    margin-right: 15px;
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .get-started {
    background-color: rgb(32, 125, 140);
    color: white;
  }

  .view-courses {
    background-color: #eee;
    color: rgb(32, 125, 140);
  }
`;

const Right = styled.div`
  flex: 1;
  min-width: 300px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const HeroSection = () => {
  return (
    <Wrapper>
      <Left>
        <h1>Learn from the Best with Mentor Craft</h1>
        <p>Build skills with online courses from top instructors. Anytime, anywhere.</p>
        <button className="get-started">Get Started</button>
        <button className="view-courses">View Courses</button>
      </Left>
      <Right>
        <img src={heroImg} alt="Online Learning" />
      </Right>
    </Wrapper>
  );
};

export default HeroSection;
