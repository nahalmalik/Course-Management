// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getEnrolledCourses } from "../components/enrollmentUtils";
import { Link } from "react-router-dom";

const PageWrapper = styled.div`
  padding: 50px 30px;
  background: #f9f9f9;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 28px;
  color: rgb(42, 98, 113);
  margin-bottom: 30px;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CourseImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const CourseTitle = styled.h4`
  font-size: 18px;
  color: rgb(32, 125, 140);
  margin-bottom: 10px;
`;

const Meta = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0;
`;

const ViewButton = styled(Link)`
  display: inline-block;
  margin-top: 15px;
  padding: 8px 14px;
  background: rgb(32, 125, 140);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: rgb(42, 98, 113);
  }
`;

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const enrolled = getEnrolledCourses();
    setCourses(enrolled);
  }, []);

  return (
    <PageWrapper>
      <Title>Your Enrolled Courses</Title>

      {courses.length === 0 ? (
        <p>You haven’t enrolled in any courses yet.</p>
      ) : (
        <CourseGrid>
          {courses.map((course, idx) => (
            <Card key={idx}>
              <CourseImage src={course.image} alt={course.title} />
              <CardBody>
                <CourseTitle>{course.title}</CourseTitle>
                <Meta>Instructor: {course.instructor}</Meta>
                <Meta>Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}</Meta>
                <ViewButton to={`/course/${course.id}`}>View Course</ViewButton>
              </CardBody>
            </Card>
          ))}
        </CourseGrid>
      )}
    </PageWrapper>
  );
};

export default StudentDashboard;
