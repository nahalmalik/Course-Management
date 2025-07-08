import React from "react";
import styled from "styled-components";
import { FaCode, FaChartLine, FaPalette, FaBullhorn, FaMobileAlt, FaServer, FaDatabase, FaLaptopCode, FaPencilRuler, FaLanguage, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Force 5 columns */
  gap: 20px;
  justify-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background-color: white;
  padding: 20px 15px;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  width: 100%;
  max-width: 180px;
  min-height: 170px;

  &:hover {
    background-color: rgb(32, 125, 140);
    color: white;

    h4, a {
      color: white;
    }

    svg {
      color: white;
    }
  }

  svg {
    font-size: 30px;
    color: rgb(32, 125, 140);
    margin-bottom: 10px;
    transition: 0.3s;
  }

  h4 {
    font-size: 16px;
    color: rgb(42, 98, 113);
    margin-bottom: 10px;
    transition: 0.3s;
  }

  a {
    font-size: 14px;
    color: rgb(32, 125, 140);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    transition: 0.3s;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const categories = [
  { icon: <FaCode />, title: "Web Development" },
  { icon: <FaChartLine />, title: "Business Strategy" },
  { icon: <FaPalette />, title: "Graphic Design" },
  { icon: <FaBullhorn />, title: "Digital Marketing" },
  { icon: <FaMobileAlt />, title: "App Development" },
  { icon: <FaServer />, title: "Cloud Computing" },
  { icon: <FaDatabase />, title: "Data Science" },
  { icon: <FaLaptopCode />, title: "Machine Learning" },
  { icon: <FaPencilRuler />, title: "UI/UX Design" },
  { icon: <FaLanguage />, title: "Language Learning" },
];

const TopCategories = () => {
  return (
    <Section>
      <Title>Top Categories</Title>
      <Grid>
        {categories.map((cat, index) => (
          <CategoryCard key={index}>
            {cat.icon}
            <h4>{cat.title}</h4>
            <Link to={`/courses/${cat.title.toLowerCase().replace(/\s+/g, "-")}`}>
              See Details <FaArrowRight />
            </Link>
          </CategoryCard>
        ))}
      </Grid>
    </Section>
  );
};

export default TopCategories;
