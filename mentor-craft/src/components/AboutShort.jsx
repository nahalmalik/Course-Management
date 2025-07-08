import React from "react";
import styled from "styled-components";
import aboutImage from "../assets/about-us.jpg";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #f9f9f9;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  min-width: 300px;

  img {
    width: 100%;
    border-radius: 12px;
  }
`;

const Text = styled.div`
  flex: 1;
  min-width: 300px;

  h2 {
    font-size: 28px;
    color: rgb(42, 98, 113);
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
    color: #444;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  ul {
    list-style: disc;
    padding-left: 20px;
    color: rgb(32, 125, 140);
    font-size: 15px;

    li {
      margin-bottom: 10px;
    }
  }
`;

const AboutShort = () => {
  return (
    <Section>
      <Container>
        <ImageWrapper>
          <img src={aboutImage} alt="About Mentor Craft" />
        </ImageWrapper>
        <Text>
          <h2>Why Choose Mentor Craft?</h2>
          <p>
            Mentor Craft is your trusted platform for skill-building, career development,
            and professional learning. We believe in accessible, high-quality education for all.
          </p>
          <ul>
            <li>Interactive and self-paced learning modules</li>
            <li>Expert instructors with industry experience</li>
            <li>Certificates of completion to showcase your skills</li>
          </ul>
        </Text>
      </Container>
    </Section>
  );
};

export default AboutShort;
