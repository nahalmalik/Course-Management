import React from "react";
import styled from "styled-components";
import student1 from "../assets/student1.png";
import student2 from "../assets/student2.png";
import student3 from "../assets/student3.png";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #fff;
`;

const Title = styled.h2`
  font-size: 32px;
  color: rgb(42, 98, 113);
  text-align: center;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.06);
  text-align: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 3px solid rgb(32, 125, 140);
  }

  h4 {
    margin: 10px 0 5px;
    color: rgb(32, 125, 140);
    font-size: 18px;
  }

  small {
    color: #888;
    display: block;
    margin-bottom: 15px;
  }

  p {
    font-size: 15px;
    color: #444;
    line-height: 1.5;
  }
`;

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    course: "Web Dev Student",
    image: student1,
    quote:
      "Mentor Craft helped me land my first job as a frontend developer. The instructors are truly top-notch!",
  },
  {
    id: 2,
    name: "Ali Raza",
    course: "Python Bootcamp",
    image: student2,
    quote:
      "The courses are well-structured and easy to follow. I learned Python from scratch and loved it!",
  },
  {
    id: 3,
    name: "Sarah Malik",
    course: "UI/UX Design",
    image: student3,
    quote:
      "Clear explanations, great assignments, and responsive support. Best online learning experience!",
  },
];

const Testimonials = () => {
  return (
    <Section>
      <Title>What Our Students Say</Title>
      <Grid>
        {testimonials.map((t) => (
          <Card key={t.id}>
            <img src={t.image} alt={t.name} />
            <h4>{t.name}</h4>
            <small>{t.course}</small>
            <p>"{t.quote}"</p>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default Testimonials;
