import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import courseData from "../components/courseData";
import courseExtraData from "../components/courseExtraData";
import {
  getCourseById,
  getExtraData,
  cleanYouTubeURL,
  normalizeCurriculumVideos,
} from "../contexts/courseStorage";
import {
  FaArrowLeft,
  FaBookOpen,
  FaList,
  FaQuestion,
  FaStar,
  FaUser,
  FaClock,
  FaBook,
} from "react-icons/fa";
import CourseCardGrid from "../components/CourseCardGrid";
import EnrollButton from "../components/EnrollButton";

// Styled Components
const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 40px 30px;
  background: #0A1F44;
  color: white;
  border-radius: 0 0 20px 20px;
  flex-wrap: wrap;
`;

const CourseImage = styled.img`
  width: 260px;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
`;

const Info = styled.div`
  flex: 1;
`;
const Title = styled.h1`
  font-size: 28px;
`;
const Instructor = styled.p`
  font-weight: bold;
  margin-top: 10px;
`;
const Meta = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
  svg {
    color: #ffd700;
    margin-right: 5px;
  }
`;
const Rating = styled.div`
  display: flex;
  align-items: center;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #1E3A8A;
  margin: 20px 30px 0;
  text-decoration: none;
  font-weight: 500;
  svg {
    margin-right: 8px;
  }
  &:hover {
    text-decoration: underline;
  }
`;

const Breadcrumb = styled.div`
  padding: 20px 30px 0;
  font-size: 14px;
  color: #777;
  a {
    color: #1E3A8A;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  span {
    margin: 0 8px;
    color: #aaa;
  }
`;

const TabSection = styled.div`
  padding: 40px 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
`;

const LeftContent = styled.div`
  flex: 2;
  min-width: 60%;
`;

const RightSidebar = styled.div`
  flex: 1;
  min-width: 280px;
  background: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 120px;
  height: fit-content;
`;

const PriceBadge = styled.div`
  display: inline-block;
  background: #1E3A8A;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 15px;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    background: #1E3A8A;
    transform: scale(1.05);
  }
`;

const AnimatedStar = styled(FaStar)`
  transition: transform 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    color: #ffa500;
  }
`;

const TabNav = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 25px;

  button {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    padding: 12px 16px;
    font-weight: 500;
    font-size: 15px;
    background: #f1f1f1;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #333;
    transition: all 0.3s ease;

    &.active {
      background: #1E3A8A;
      color: white;
    }

    &:hover {
      background: #1E3A8A;
      color: white;
    }
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Accordion = styled.div`
  border-top: 1px solid #ddd;
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid #ddd;
`;

const AccordionHeader = styled.div`
  padding: 15px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;

  &:hover {
    background: #e5f5f7;
  }
`;

const AccordionBody = styled.div`
  padding: 15px;
  display: ${({ open }) => (open ? "block" : "none")};
`;

const RelatedSection = styled.div`
  margin-top: 60px;
  padding: 40px 30px;
  background: #f9f9f9;
`;

const RelatedTitle = styled.h3`
  font-size: 22px;
  color: #1E3A8A;
  margin-bottom: 25px;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 25px;
`;

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseExtra, setCourseExtra] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [openIndex, setOpenIndex] = useState(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  useEffect(() => {
  window.scrollTo(0, 0);

  const loadCourse = async () => {
    const courseId = parseInt(id);

    // 1. Try dynamic course (from backend)
    const dynamicCourse = await getCourseById(courseId);

    if (dynamicCourse) {
      setCourse(dynamicCourse);

      // fallback or merge dynamic extra
      const fallbackCurriculum = [
        {
          title: "Introduction",
          description: "Welcome to the course!",
          duration: "5 min",
          icon: "📘",
          video: "",
        },
      ];

      const fallbackFAQs = [
        { question: "Who is this course for?", answer: "Anyone who wants to learn!" },
        { question: "Do I need prior knowledge?", answer: "No, beginners are welcome." },
      ];

      setCourseExtra({
        overview:
          dynamicCourse.overview || "This course helps you master key concepts step-by-step.",
        curriculumIntro: "Explore our carefully structured lectures and lessons.",
        curriculum: normalizeCurriculumVideos(dynamicCourse.curriculum || fallbackCurriculum),
        videos: dynamicCourse.videos || [], // You can add this in model later
        faqs: dynamicCourse.faqs?.length ? dynamicCourse.faqs : fallbackFAQs,
      });
    } else {
      // 2. Fallback to static courseData.js
      const staticCourse = courseData.find((c) => c.id === courseId);
      const staticExtra = courseExtraData[courseId];

      if (staticCourse) {
        setCourse(staticCourse);
        setCourseExtra(staticExtra);
      } else {
        setCourse(null);
        setCourseExtra(null);
      }
    }
  };

  loadCourse();
}, [id]);


  if (!course || !courseExtra)
    return <p style={{ padding: 40 }}>Course not found.</p>;

  // ✅ Universal image support
  const courseImage = course.thumbnail || course.image || "/assets/default-course.jpg";

  return (
    <>
      <Banner>
        <CourseImage src={courseImage} alt={course.title} />
        <Info>
          <Title>{course.title}</Title>
          <Instructor>
            <FaUser /> Instructor: {course.instructor}
          </Instructor>
          <Meta>
            <Rating>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(course.rating || 4.5) ? "#ffd700" : "#ccc"}
                />
              ))}
              &nbsp; {course.rating || "4.5"}
            </Rating>
            <span>
              <FaClock /> {course.duration}
            </span>
            <span>
              <FaBook /> {course.lessons} Lessons
            </span>
          </Meta>
          <EnrollButton course={course} />
        </Info>
      </Banner>

      <BackButton to="/courses">
        <FaArrowLeft /> Back to Courses
      </BackButton>

      <Breadcrumb>
        <Link to="/">Home</Link> <span>&gt;</span>
        <Link to="/courses">Courses</Link> <span>&gt;</span>
        {course.title}
      </Breadcrumb>

      <TabSection>
        <LeftContent>
          <TabNav>
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              <FaBookOpen /> Overview
            </button>
            <button
              className={activeTab === "curriculum" ? "active" : ""}
              onClick={() => setActiveTab("curriculum")}
            >
              <FaList /> Curriculum
            </button>
            <button
              className={activeTab === "faq" ? "active" : ""}
              onClick={() => setActiveTab("faq")}
            >
              <FaQuestion /> FAQs
            </button>
          </TabNav>

          <TabContent>
            {activeTab === "overview" && (
              <>
                <h4>What you'll learn</h4>
                <p>{courseExtra.overview}</p>
              </>
            )}

            {activeTab === "curriculum" && (
              <>
                <h4>Curriculum Overview</h4>
                <p>{courseExtra.curriculumIntro}</p>

                {courseExtra.videos?.map((url, i) => (
                  <div key={i} style={{ margin: "20px 0" }}>
                    <iframe
                      width="100%"
                      height="300"
                      src={cleanYouTubeURL(url)}
                      title={`Video ${i + 1}`}
                      allowFullScreen
                      style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                    ></iframe>
                  </div>
                ))}

                <Accordion>
                  {courseExtra.curriculum.map((item, idx) => (
                    <AccordionItem key={idx}>
                      <AccordionHeader
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      >
                        <span>
                          {item.icon} {item.title}
                        </span>
                        <span>{openIndex === idx ? "-" : "+"}</span>
                      </AccordionHeader>
                      <AccordionBody open={openIndex === idx}>
                        <p>
                          <strong>Description:</strong> {item.description}
                        </p>
                        <p>
                          <strong>Duration:</strong> {item.duration}
                        </p>
                        {item.video && (
                          <div style={{ margin: "15px 0" }}>
                            <iframe
                              width="100%"
                              height="300"
                              src={cleanYouTubeURL(item.video)}
                              title={`Video ${idx + 1}`}
                              allowFullScreen
                              style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                            ></iframe>
                          </div>
                        )}
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}

            {activeTab === "faq" && (
              <>
                <h4>Frequently Asked Questions</h4>
                <Accordion>
                  {courseExtra.faqs.map((faq, i) => (
                    <AccordionItem key={i}>
                      <AccordionHeader
                        onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}
                      >
                        {faq.question} <span>{faqOpenIndex === i ? "-" : "+"}</span>
                      </AccordionHeader>
                      <AccordionBody open={faqOpenIndex === i}>
                        <p>{faq.answer}</p>
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </TabContent>
        </LeftContent>

        <RightSidebar>
          <img
            src={courseImage}
            alt={course.title}
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
          <h4 style={{ marginBottom: "15px", color: "#205b63" }}>Course Summary</h4>
          <p>
            <FaUser style={{ marginRight: "8px" }} />
            <strong>Instructor:</strong> {course.instructor}
          </p>
          <p>
            <FaClock style={{ marginRight: "8px" }} />
            <strong>Duration:</strong> {course.duration}
          </p>
          <p>
            <FaBook style={{ marginRight: "8px" }} />
            <strong>Lessons:</strong> {course.lessons}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(course.rating || 4.5) ? "#ffd700" : "#ccc"}
              />
            ))}{" "}
            {course.rating || "4.5"}
          </p>
          <p>
            <strong>Category:</strong> {course.category}
          </p>
          <p>
            <strong>Enrolled:</strong> {100 + course.id * 12}
          </p>
          <p>
            <strong>Price:</strong> {course.price}
          </p>
          <div style={{ marginTop: "20px" }}>
            <EnrollButton course={course} />
          </div>
        </RightSidebar>
      </TabSection>

      <RelatedSection>
        <RelatedTitle>Related Courses</RelatedTitle>
        <RelatedGrid>
          {courseData
            .filter((c) => c.id !== course.id)
            .slice(0, 4)
            .map((rel) => (
              <CourseCardGrid key={rel.id} course={rel} />
            ))}
        </RelatedGrid>
      </RelatedSection>
    </>
  );
};

export default CourseDetail;
