import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEnrollments } from '../../components/enrollmentUtils';
import { Link } from 'react-router-dom';
import '../../styles/studentDashboard/StudentOverview.css';
import studentData from '../../contexts/studentData';
import courseData from '../../components/courseData';

const PageWrapper = styled.div`
  padding: 50px 30px;
  background: #f9f9f9;
  min-height: 100vh;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: rgb(42, 98, 113);
`;

const Filters = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  select {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
  }
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

const ButtonGroup = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ViewButton = styled(Link)`
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    background: #ddd;
    cursor: pointer;
    transition: background 0.2s ease;

    &.active {
      background: rgb(32, 125, 140);
      color: white;
    }
  }
`;

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'progress'
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 5;
  const email = localStorage.getItem('studentEmail');

  useEffect(() => {
    const enrolled = getEnrollments(email) || [];

    const student = studentData.find((s) => s.email === email);
    const assignedCourseIds = student?.enrolledCourses || [];

    const assignedCourses = assignedCourseIds
      .map((id) => courseData.find((c) => c.id === id))
      .filter(Boolean);

    const allCoursesMap = {};

    [...enrolled, ...assignedCourses].forEach((course) => {
      if (course && course.id) {
        allCoursesMap[course.id] = {
          ...course,
          enrolledAt: course.enrolledAt || new Date().toISOString(),
          orderId: course.orderId || `ASSIGNED-${course.id}`,
        };
      }
    });

    const allCourses = Object.values(allCoursesMap);
    setCourses(allCourses);
    setFilteredCourses(allCourses);
  }, [email]);

  // Filtering + Sorting
  useEffect(() => {
    let updated = [...courses];

    if (categoryFilter !== 'All') {
      updated = updated.filter((c) => c.category === categoryFilter);
    }

    if (sortBy === 'date') {
      updated.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
    } else if (sortBy === 'progress') {
      updated.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    }

    setFilteredCourses(updated);
    setCurrentPage(1); // reset to first page on filter/sort change
  }, [categoryFilter, sortBy, courses]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <PageWrapper>
      <TitleRow>
        <Title>Your Enrolled Courses</Title>
        <Filters>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="progress">Sort by Progress</option>
          </select>
        </Filters>
      </TitleRow>

      {currentCourses.length === 0 ? (
        <p>You haven’t enrolled in any courses yet.</p>
      ) : (
        <CourseGrid>
          {currentCourses.map((course) => (
            <Card key={course.id}>
              <CourseImage src={course.image} alt={course.title} />
              <CardBody>
                <CourseTitle>{course.title}</CourseTitle>
                <Meta>Instructor: {course.instructor}</Meta>
                <Meta>Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}</Meta>
                <ButtonGroup>
                  <ViewButton to={`/courses/${course.id}`}>View Course</ViewButton>
                  {course.orderId?.startsWith('ASSIGNED-') ? null : (
                    <ViewButton to={`/receipt/${course.orderId}`}>View Receipt</ViewButton>
                  )}
                </ButtonGroup>
              </CardBody>
            </Card>
          ))}
        </CourseGrid>
      )}

      {totalPages > 1 && (
        <Pagination>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              className={currentPage === idx + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </Pagination>
      )}
    </PageWrapper>
  );
};

export default StudentDashboard;
