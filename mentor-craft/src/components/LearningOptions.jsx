import React from "react";
import styled from "styled-components";
import { FaClock, FaChalkboardTeacher, FaCertificate } from "react-icons/fa";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  color: #1E3A8A;
  font-size: 30px;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px 25px;
  max-width: 300px;
  flex: 1 1 280px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  svg {
    font-size: 40px;
    margin-bottom: 20px;
    color: #1E3A8A;
  }

  h4 {
    font-size: 20px;
    color: #1E3A8A;
    margin-bottom: 12px;
  }

  p {
    font-size: 15px;
    color: #666;
    line-height: 1.5;
  }
`;

const cards = [
  {
    icon: <FaClock />,
    title: "Learn at Your Own Pace",
    desc: "Access courses anytime, anywhere — learn on your schedule.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "Expert Instructors",
    desc: "Courses taught by industry leaders with real-world experience.",
  },
  {
    icon: <FaCertificate />,
    title: "Earn Certificates",
    desc: "Receive certificates to showcase your achievements and skills.",
  },
];

const LearningOptions = () => {
  return (
    <Section>
      <Title>Flexible Learning Options</Title>
      <Grid>
        {cards.map((card, index) => (
          <Card key={index}>
            {card.icon}
            <h4>{card.title}</h4>
            <p>{card.desc}</p>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default LearningOptions;
