import React from "react";
import styled from "styled-components";
import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaUserFriends,
  FaCertificate,
} from "react-icons/fa";

const Section = styled.section`
  padding: 80px 20px;
  background-image: url("https://www.transparenttextures.com/patterns/white-wall.png");
  background-color: #f4f8f9;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  color: rgb(42, 98, 113);
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
  font-size: 16px;
  color: #555;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Feature = styled.div`
  display: flex;
  gap: 20px;
  background: white;
  padding: 25px 25px;
  border-radius: 15px;
  border: 1px solid #e2e2e2;
  align-items: flex-start;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
  transition: 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-5px);
    opacity: 1;
  }

  .iconWrapper {
    background-color: rgb(32, 125, 140);
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .text {
    h4 {
      font-size: 18px;
      color: rgb(42, 98, 113);
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const features = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Skilled Instructors",
    desc: "Our instructors are experts in their fields, committed to providing high-quality education and mentorship.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Online Classes",
    desc: "Flexible and interactive online learning with modern tools and techniques.",
  },
  {
    icon: <FaUserFriends />,
    title: "International Students",
    desc: "A diverse community of learners from all over the world.",
  },
  {
    icon: <FaCertificate />,
    title: "Certificates",
    desc: "Earn recognized certificates that validate your skills and boost your career.",
  },
];

const WhyChoose = () => {
  return (
    <Section>
      <Container>
        <Title>What Sets Us Apart</Title>
        <Subtitle>
          We provide a world-class learning experience backed by expert instructors, a global
          community, and a focus on real-world success.
        </Subtitle>

        <Grid>
          {features.map((item, index) => (
            <Feature key={index} style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="iconWrapper">{item.icon}</div>
              <div className="text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </Feature>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default WhyChoose;
