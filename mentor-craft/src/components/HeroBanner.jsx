import React from "react";
import styled from "styled-components";

const Banner = styled.section`
  background-color: #0A1F44;
  padding: 80px 20px;
  text-align: center;
  color: #fff;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const HeroBanner = ({ title, subtitle }) => {
  return (
    <Banner>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Banner>
  );
};

export default HeroBanner;
