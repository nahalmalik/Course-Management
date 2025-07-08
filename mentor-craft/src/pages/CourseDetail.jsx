import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import courseData from "../components/courseData";
import courseExtraData from "../components/courseExtraData";
import CourseCardGrid from "../components/CourseCardGrid";
import { FaArrowLeft, FaBookOpen, FaList, FaQuestion, FaStar, FaUser, FaClock, FaBook } from "react-icons/fa";
import EnrollButton from "../components/EnrollButton";

// Styled Components
const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 40px 30px;
  background: rgb(32, 125, 140);
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

const Info = styled.div` flex: 1; `;
const Title = styled.h1` font-size: 28px; `;
const Instructor = styled.p` font-weight: bold; margin-top: 10px; `;
const Meta = styled.div`
  display: flex; gap: 15px; margin-top: 10px; flex-wrap: wrap;
  svg { color: #ffd700; margin-right: 5px; }
`;
const Rating = styled.div` display: flex; align-items: center; `;

const BackButton = styled(Link)`
  display: inline-flex; align-items: center; font-size: 14px;
  color: rgb(32, 125, 140); margin: 20px 30px 0;
  text-decoration: none; font-weight: 500;
  svg { margin-right: 8px; }
  &:hover { text-decoration: underline; }
`;

const Breadcrumb = styled.div`
  padding: 20px 30px 0; font-size: 14px; color: #777;
  a { color: rgb(32, 125, 140); text-decoration: none; }
  a:hover { text-decoration: underline; }
  span { margin: 0 8px; color: #aaa; }
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
  box-shadow: 0 0 10px rgba(0,0,0,0.06);
  position: sticky;
  top: 120px;
  height: fit-content;
`;

const PriceBadge = styled.div`
  display: inline-block;
  background: rgb(32, 125, 140);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 15px;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    background: rgb(42, 98, 113);
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
      background: rgb(32, 125, 140);
      color: white;
    }

    &:hover {
      background: rgb(42, 98, 113);
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
  color: rgb(42, 98, 113);
  margin-bottom: 25px;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 25px;
`;

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseData.find((c) => c.id === parseInt(id));
  const courseExtra = courseExtraData[parseInt(id)];

  const [activeTab, setActiveTab] = useState("overview");
  const [openIndex, setOpenIndex] = useState(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!course || !courseExtra) return <p>Course not found.</p>;

  return (
    <>
      <Banner>
        <CourseImage src={course.image} alt={course.title} />
        <Info>
          <Title>{course.title}</Title>
          <Instructor><FaUser /> Instructor: {course.instructor}</Instructor>
          <Meta>
            <Rating>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.round(course.rating) ? "#ffd700" : "#ccc"} />
              ))}
              &nbsp; {course.rating}
            </Rating>
            <span><FaClock /> {course.duration}</span>
            <span><FaBook /> {course.lessons} Lessons</span>
          </Meta>
          <EnrollButton course={course} />
        </Info>
      </Banner>

      <BackButton to="/courses"><FaArrowLeft /> Back to Courses</BackButton>

      <Breadcrumb>
        <Link to="/">Home</Link> <span>&gt;</span>
        <Link to="/courses">Courses</Link> <span>&gt;</span>
        {course.title}
      </Breadcrumb>

      <TabSection>
        <LeftContent>
          <TabNav>
            <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
              <FaBookOpen /> Overview
            </button>
            <button className={activeTab === "curriculum" ? "active" : ""} onClick={() => setActiveTab("curriculum")}>
              <FaList /> Curriculum
            </button>
            <button className={activeTab === "faq" ? "active" : ""} onClick={() => setActiveTab("faq")}>
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
                      src={url}
                      title={`Video ${i + 1}`}
                      allowFullScreen
                      style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                    ></iframe>
                  </div>
                ))}

                <Accordion>
                  {courseExtra.curriculum.map((item, idx) => (
                    <AccordionItem key={idx}>
                      <AccordionHeader onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
  <span>{item.icon} {item.title}</span>
  <span>{openIndex === idx ? "-" : "+"}</span>
</AccordionHeader>

                      <AccordionBody open={openIndex === idx}>
  <p><strong>Description:</strong> {item.description}</p>
  <p><strong>Duration:</strong> {item.duration}</p>
  <div style={{ margin: "15px 0" }}>
    <iframe
      width="100%"
      height="300"
      src={item.video}
      title={`Video ${idx + 1}`}
      allowFullScreen
      style={{ borderRadius: "8px", border: "1px solid #ccc" }}
    ></iframe>
  </div>
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
                  {courseExtra.faqs?.map((faq, i) => (
                    <AccordionItem key={i}>
                      <AccordionHeader onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}>
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
    src={course.image}
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
    <FaUser style={{ marginRight: "8px", color: "#205b63" }} />
    <strong>Instructor:</strong> {course.instructor}
  </p>
  <p>
    <FaClock style={{ marginRight: "8px", color: "#205b63" }} />
    <strong>Duration:</strong>{" "}
    <span style={{ background: "#e7f4f6", padding: "4px 10px", borderRadius: "6px", fontSize: "14px" }}>
      {course.duration}
    </span>
  </p>
  <p>
    <FaBook style={{ marginRight: "8px", color: "#205b63" }} />
    <strong>Lessons:</strong>{" "}
    <span style={{ background: "#e8f5e9", padding: "4px 10px", borderRadius: "6px", fontSize: "14px" }}>
      {course.lessons}
    </span>
  </p>
  <p>
    <strong style={{ display: "inline-block", marginBottom: "5px" }}>Rating:</strong><br />
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        color={i < Math.round(course.rating) ? "#ffd700" : "#ccc"}
        style={{ marginRight: "3px" }}
      />
    ))}{" "}
    <span style={{ fontWeight: "bold", fontSize: "14px" }}>{course.rating}</span>
  </p>
  <p>
    <strong>Category:</strong>{" "}
    <span style={{ background: "#fbe9e7", padding: "4px 10px", borderRadius: "6px", fontSize: "14px" }}>
      {course.category}
    </span>
  </p>
  <p>
    <strong>Enrolled Students:</strong>{" "}
    <span style={{ background: "#ede7f6", padding: "4px 10px", borderRadius: "6px", fontSize: "14px" }}>
      {100 + course.id * 12}
    </span>
  </p>
  <p>
    <strong>Price:</strong>{" "}
    <span style={{
      background: course.price.toLowerCase() === "free" ? "#c8e6c9" : "#fff3e0",
      color: "#000",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "14px"
    }}>
      {course.price}
    </span>
  </p>

  <div style={{ marginTop: "20px" }}>
    <EnrollButton course={course} />
  </div>
</RightSidebar>


      </TabSection>

      <RelatedSection>
        <RelatedTitle>Related Courses</RelatedTitle>
        <RelatedGrid>
          {courseData.filter((c) => c.id !== course.id).slice(0, 4).map((rel) => (
            <CourseCardGrid key={rel.id} course={rel} />
          ))}
        </RelatedGrid>
      </RelatedSection>
    </>
  );
};

export default CourseDetail;
