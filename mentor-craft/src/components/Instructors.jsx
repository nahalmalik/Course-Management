import React, { useEffect, useRef, useState } from "react";
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
  color: #1E3A8A;
  font-size: 30px;
  margin-bottom: 40px;
`;

const GridWrapper = styled.div`
  position: relative;
  overflow-x: hidden;
`;

const Grid = styled.div`
  display: flex;
  gap: 20px;
  transition: transform 0.5s ease-in-out;
`;

const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  flex: 0 0 50%;
  max-width: 50%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
    color: #1E3A8A;
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
    color: #1E3A8A;
    font-size: 14px;
    transition: 0.3s;
  }

  .socials a:hover {
    color: rgb(32, 125, 140);
  }

  @media (min-width: 768px) {
    flex: 0 0 25%;
    max-width: 25%;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.active ? '#1E3A8A' : '#ccc'};
  cursor: pointer;
  transition: 0.3s;
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
  const [index, setIndex] = useState(0);
  const gridRef = useRef(null);
  const totalSlides = Math.ceil(instructors.length / 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % totalSlides);
    }, 4000); // autoplay every 4 seconds
    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  return (
    <Section>
      <Title>Meet Our Instructors</Title>
      <GridWrapper>
        <Grid ref={gridRef}>
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
      </GridWrapper>

      <Dots>
        {[...Array(totalSlides)].map((_, i) => (
          <Dot key={i} onClick={() => setIndex(i)} active={i === index} />
        ))}
      </Dots>
    </Section>
  );
};

export default Instructors;
