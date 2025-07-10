import React from "react";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import courseData from "../components/courseData";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #f9f9f9;
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
  border: 1px solid #eaeaea;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 10px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .content {
    padding: 20px;

    h3 {
      color: rgb(32, 125, 140);
      font-size: 20px;
      margin-bottom: 10px;
    }

    .rating {
      color: #f7b500;
      margin-bottom: 10px;
    }

    .price {
      font-weight: bold;
      color: rgb(42, 98, 113);
      margin-bottom: 10px;
    }

    a {
      display: inline-block;
      background-color: rgb(32, 125, 140);
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.3s ease;

      &:hover {
        background-color: rgb(42, 98, 113);
      }
    }
  }
`;

// ✅ Sort by highest rating, then pick top 3
const getTopCourses = (data, count = 3) => {
  const sorted = [...data].sort((a, b) => b.rating - a.rating);
  return sorted.slice(0, count);
};

const FeaturedCourses = () => {
  const courses = getTopCourses(courseData, 3);

  return (
    <Section>
      <Title>Explore Popular Courses</Title>
      <Grid>
        {courses.map((course) => (
          <Card key={course.id}>
            <img src={course.image} alt={course.title} />
            <div className="content">
              <h3>{course.title}</h3>
              <div className="rating">
                {Array.from({ length: Math.round(course.rating) }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <div className="price">{course.price}</div>
              <Link to={`/courses/${course.id}`}>Enroll Now</Link>
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default FeaturedCourses;
