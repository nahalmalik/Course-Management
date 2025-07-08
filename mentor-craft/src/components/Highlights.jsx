import React from "react";
import styled from "styled-components";
import { FaUsers, FaChalkboardTeacher, FaLaptop, FaHeadset } from "react-icons/fa";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Box = styled.div`
  background: white;
  padding: 30px 20px;
  text-align: center;
  border-radius: 10px;
  border: 1px solid #eee;
  transition: 0.3s;

  &:hover {
    background: rgb(32, 125, 140);
    color: white;


    svg {
      color: white;
    }
  }

  svg {
    font-size: 32px;
    color: rgb(42, 98, 113);
    margin-bottom: 15px;
    transition: 0.3s;
  }

  h4 {
    font-size: 18px;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;

const highlights = [
  {
    icon: <FaUsers />,
    title: "15,000+ Students",
    desc: "Worldwide learners benefit from our flexible platform.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "100+ Instructors",
    desc: "Top-tier educators and industry professionals.",
  },
  {
    icon: <FaLaptop />,
    title: "500+ Courses",
    desc: "Wide range of technical, creative and business topics.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Our team is always here to assist you.",
  },
];

const Highlights = () => {
  return (
    <Section>
      <Grid>
        {highlights.map((item, index) => (
          <Box key={index}>
            {item.icon}
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </Box>
        ))}
      </Grid>
    </Section>
  );
};

export default Highlights;
