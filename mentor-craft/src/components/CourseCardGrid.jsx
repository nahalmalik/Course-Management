// components/CourseCardGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: 0.3s;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #1E3A8A;// Secondary color
`;

const Instructor = styled.p`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

const Badge = styled.span`
  background: #1E3A8A; // Primary color
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin-right: 8px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #f9b234;
  margin-bottom: 8px;
`;

const Meta = styled.div`
  font-size: 13px;
  color: #666;
`;

const CourseCardGrid = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
      <Card>
        <img
          src={
            course.thumbnail?.startsWith("data:image")
              ? course.thumbnail
              : course.image || course.thumbnail || "/assets/default-course.jpg"
          }
          alt={course.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px"
          }}
        />
        <Content>
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
            {course.lessons} Lessons • {course.duration} • {course.price}
          </Meta>
        </Content>
      </Card>
    </Link>
  );
};

export default CourseCardGrid;
