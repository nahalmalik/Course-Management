// components/CourseCardList.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Card = styled.div`
  display: flex;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0,0,0,0.06);
  transition: 0.3s;
  text-decoration: none;
  color: inherit;a

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Image = styled.img`
  width: 250px;
  height: auto;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Info = styled.div`
  padding: 20px;
  flex: 1;
`;

const Title = styled.h3`
  color: #1E3A8A;
  margin: 0 0 10px;
`;

const Meta = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

const Instructor = styled.p`
  margin: 5px 0;
  font-size: 15px;
  color: #444;
`;

const Rating = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const Price = styled.div`
  font-weight: bold;
  color: #1E3A8A;
`;

const Badge = styled.span`
  display: inline-block;
  background: #eee;
  color: #444;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 10px;
`;

const CourseCardList = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
      <Card>
        <img
  src={
    course.thumbnail?.startsWith('data:image')
      ? course.thumbnail
      : course.image || course.thumbnail || '/assets/default-course.jpg'
  }
  alt={course.title}
  style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
/>

        <Info>
          <Badge>{course.category}</Badge>
          <Title>{course.title}</Title>
          <Instructor>By {course.instructor}</Instructor>
          <Rating>
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(course.rating) ? "#f9b234" : "#ccc"}
              />
            ))}
            &nbsp; ({course.rating})
          </Rating>
          <Meta>
            {course.lessons} Lessons • {course.duration}
          </Meta>
          <Price>{course.price}</Price>
        </Info>
      </Card>
    </Link>
  );
};

export default CourseCardList;
