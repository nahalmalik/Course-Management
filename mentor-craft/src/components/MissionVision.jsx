import React from "react";
import styled from "styled-components";
import { FaBullseye, FaEye, FaHeart } from "react-icons/fa";

const Section = styled.section`
  padding: 60px 20px;
  background-color: #fff;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 30px;
  color: rgb(42, 98, 113);
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px 25px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
  text-align: center;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.08);
  }

  svg {
    font-size: 36px;
    margin-bottom: 15px;
    color: rgb(32, 125, 140);
    transition: 0.3s;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: rgb(42, 98, 113);
  }

  p {
    font-size: 15px;
    color: #555;
    line-height: 1.6;
  }
`;

const missionItems = [
  {
    icon: <FaBullseye />,
    title: "Our Mission",
    desc: "To provide quality education through online platforms to students from all walks of life, empowering them to grow, achieve, and succeed in their careers and goals."
  },
  {
    icon: <FaEye />,
    title: "Our Vision",
    desc: "To become the most trusted and innovative online learning provider globally, ensuring every learner has access to skill-based, flexible, and accessible education."
  },
  {
    icon: <FaHeart />,
    title: "Our Values",
    desc: "We value integrity, inclusiveness, innovation, and continuous learning. We aim to build a community that supports collaboration and curiosity."
  }
];

const MissionVision = () => {
  return (
    <Section>
      <Container>
        <Title>Mission, Vision & Values</Title>
        <Grid>
          {missionItems.map((item, i) => (
            <Card key={i}>
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default MissionVision;
