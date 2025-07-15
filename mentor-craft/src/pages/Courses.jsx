import React, { useState, useMemo } from "react";
import styled from "styled-components";
import courseData from "../components/courseData";
import { getCourses } from "../contexts/courseStorage";
import CourseFilters from "../components/CourseFilters";
import CourseCardGrid from "../components/CourseCardGrid";
import CourseCardList from "../components/CourseCardList";
import { FaThLarge, FaBars } from "react-icons/fa";
import HeroBanner from "../components/HeroBanner";

const Page = styled.div`
  display: flex;
  padding: 60px 30px;
  gap: 30px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 250px;
  @media (max-width: 992px) {
    width: 100%;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 26px;
  color: rgb(42, 98, 113);
`;

const ToggleButtons = styled.div`
  display: flex;
  gap: 10px;

  button {
    background: #eee;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 18px;
    border-radius: 6px;
    color: #444;
    transition: 0.2s;

    &.active {
      background: rgb(32, 125, 140);
      color: white;
    }
  }
`;

const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 25px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;

  button {
    background: #eee;
    border: none;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 6px;
    color: #444;

    &.active {
      background: rgb(32, 125, 140);
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const Courses = () => {
  const [view, setView] = useState("grid");
  const [filters, setFilters] = useState({
    categories: [],
    price: "all",
    duration: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Combine static and created (dynamic) courses
  const createdCourses = getCourses(); // from localStorage
  const allCourses = [...createdCourses, ...courseData]; // New first

  // Filter logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(course.category)
      ) {
        return false;
      }

      const priceValue = course.price.toString().toLowerCase();
      if (filters.price === "free" && priceValue !== "free") return false;
      if (filters.price === "paid" && priceValue === "free") return false;

      const durationStr = course.duration || "0h";
      const hours = parseInt(durationStr.replace("h", "")) || 0;

      if (filters.duration === "<5" && hours >= 5) return false;
      if (filters.duration === "5-15" && (hours < 5 || hours > 15)) return false;
      if (filters.duration === ">15" && hours <= 15) return false;

      return true;
    });
  }, [filters, allCourses]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <HeroBanner
        title="Explore All Mentor Craft Courses"
        subtitle="Browse our expertly crafted courses across a variety of categories. Whether you're just starting or advancing your career, we’ve got something for you."
      />
      <Page>
        <Sidebar>
          <CourseFilters
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
          />
        </Sidebar>

        <Content>
          <Header>
            <Title>All Courses</Title>
            <ToggleButtons>
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
              >
                <FaThLarge />
              </button>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                <FaBars />
              </button>
            </ToggleButtons>
          </Header>

          {filteredCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : view === "grid" ? (
            <GridWrap>
              {paginatedCourses.map((course) => (
                <CourseCardGrid key={course.id} course={course} />
              ))}
            </GridWrap>
          ) : (
            <ListWrap>
              {paginatedCourses.map((course) => (
                <CourseCardList key={course.id} course={course} />
              ))}
            </ListWrap>
          )}

          {totalPages > 1 && (
            <Pagination>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </Pagination>
          )}
        </Content>
      </Page>
    </>
  );
};

export default Courses;
