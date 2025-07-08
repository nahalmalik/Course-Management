import React from "react";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import course1 from "../assets/course1.jpeg"; // Add images to match template
import course2 from "../assets/course2.jpeg";
import course3 from "../assets/course3.jpg";

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

    button {
      background-color: rgb(32, 125, 140);
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: rgb(42, 98, 113);
      }
    }
  }
`;

const courses = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    image: course1,
    rating: 5,
    price: "$39.99",
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    image: course2,
    rating: 4,
    price: "$29.99",
  },
  {
    id: 3,
    title: "Python for Beginners",
    image: course3,
    rating: 5,
    price: "$24.99",
  },
];

const FeaturedCourses = () => {
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
                {Array(course.rating).fill(<FaStar />)}
              </div>
              <div className="price">{course.price}</div>
              <button>Enroll Now</button>
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default FeaturedCourses;
