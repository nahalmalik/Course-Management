import React from "react";
import styled from "styled-components";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import instructor1 from "../assets/teacher1.png";
import instructor2 from "../assets/teacher2.jpeg";
import instructor3 from "../assets/teacher3.png";
import instructor4 from "../assets/teacher4.png";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  color: rgb(42, 98, 113);
  font-size: 30px;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(32, 125, 140);
    border-radius: 4px;
  }
`;


const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  min-width: 220px;
  max-width: 220px;
  flex: 0 0 auto;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
  }

  h4 {
    font-size: 16px;
    color: rgb(32, 125, 140);
    margin-bottom: 5px;
  }

  small {
    display: block;
    color: #666;
    margin-bottom: 10px;
  }

  .socials {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .socials a {
    color: rgb(42, 98, 113);
    font-size: 14px;
    transition: 0.3s;
  }

  .socials a:hover {
    color: rgb(32, 125, 140);
  }
`;


const instructors = [
  {
    id: 1,
    name: "Ayesha Rehman",
    subject: "Full-Stack Developer",
    image: instructor1,
  },
  {
    id: 2,
    name: "Ali Murtaza",
    subject: "Python & AI Expert",
    image: instructor2,
  },
  {
    id: 3,
    name: "Fatima Rizvi",
    subject: "UI/UX Designer",
    image: instructor3,
  },
   {
    id: 4,
    name: "Omar Farooq",
    subject: "Data Scientist",
    image: instructor4,
  },
  
];

const Instructors = () => {
  return (
    <Section>
      <Title>Meet Our Instructors</Title>
      <Grid>
        {instructors.map((ins) => (
          <Card key={ins.id}>
            <img src={ins.image} alt={ins.name} />
            <h4>{ins.name}</h4>
            <small>{ins.subject}</small>
            <div className="socials">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default Instructors;
