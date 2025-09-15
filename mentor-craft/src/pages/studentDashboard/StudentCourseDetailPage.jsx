import React, { useEffect, useState } from 'react';
import { getAccessToken } from '../../contexts/authUtils';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaUser, FaClock, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StudentCourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [openTab, setOpenTab] = useState('lectures');
  const [modalLecture, setModalLecture] = useState(null);
  const [descOpen, setDescOpen] = useState({}); 
  const [enrolledUsers, setEnrolledUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = getAccessToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [c, l, n, u] = await Promise.all([
        axios.get(`http://localhost:8000/api/student/course-details/${courseId}/`, config),
        axios.get(`http://localhost:8000/api/student/course-details/${courseId}/lectures/`, config),
        axios.get(`http://localhost:8000/api/student/course-details/${courseId}/notes/`, config),
        axios.get(`http://localhost:8000/api/student/course-details/${courseId}/enrolled-users/`, config),
      ]);
      setCourse(c.data);
      setLectures(l.data);
      setNotes(n.data);
      setEnrolledUsers(u.data);
    }
    fetchData();
  }, [courseId]);

  if (!course) return <Loader>Loading…. </Loader>;

  return (
    <Container>
      <Banner>
        {course.image && <CourseImage src={course.image} alt={course.title} />}
        <Info>
          <Title>{course.title}</Title>
          <Instructor><FaUser /> {course.instructor}</Instructor>
          <Meta>
            <Rating>
              {[...Array(5)].map((_, i) => (
                <FaStar color={i < Math.round(course.rating || 4.5) ? '#ffd700' : '#ccc'} key={i} />
              ))} {course.rating?.toFixed(1)}
            </Rating>
            <span title="Total duration"><FaClock /> {course.duration}</span>
            <span title="Number of lessons"><FaBook /> {lectures.length} Lessons</span>
          </Meta>
        </Info>
      </Banner>

      <TabNav>
        <TabButton active={openTab==='lectures'} onClick={() => setOpenTab('lectures')}>Lectures</TabButton>
        <TabButton active={openTab==='notes'} onClick={() => setOpenTab('notes')}>Notes</TabButton>
        <TabButton active={openTab==='quizzes'} onClick={() => setOpenTab('quizzes')}>Quizzes</TabButton>
        <TabButton active={openTab==='assignments'} onClick={() => setOpenTab('assignments')}>Assignments</TabButton>
        <TabButton active={openTab==='students'} onClick={() => setOpenTab('students')}>Students</TabButton>
      </TabNav>

  {openTab === 'lectures' && (
  <ContentPanel>
    <TableHeader>
      <span>Icon</span><span>Title</span><span>Duration</span><span>Action</span>
    </TableHeader>

    {lectures.length > 0 ? (
      lectures.map((l) => (
        <Row key={l.id}>
          <Icon title="Lecture icon">{l.icon || '🎥'}</Icon>
          <span>{l.title}</span>
          <span>{l.duration}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* 🎥 Lecture button (YouTube) */}
            {(l.video?.includes("youtube.com") || l.video?.includes("youtu.be")) && (
              <Button onClick={() => setModalLecture(l)}>Lecture</Button>
            )}
            {/* 🚀 Join Class button (Google Meet) */}
            {l.video?.includes("meet.google.com") && (
              <Button as="a" href={l.video} target="_blank" rel="noopener noreferrer">
                Join Class
              </Button>
            )}
            <ToggleDesc onClick={() => setDescOpen(d => ({ ...d, [l.id]: !d[l.id] }))}>
              {descOpen[l.id] ? <FaChevronUp /> : <FaChevronDown />}
            </ToggleDesc>
          </div>
          {descOpen[l.id] && <Desc>{l.description}</Desc>}
        </Row>
      ))
    ) : (
      <Row>
        <span>📭</span>
        <span>No lectures yet</span>
        <span>–</span>
        <span>–</span>
      </Row>
    )}
  </ContentPanel>
)}

{openTab === 'notes' && (
  <ContentPanel>
    <TableHeader>
      <span>Icon</span><span>Title</span><span>Description</span><span>Download</span>
    </TableHeader>

    {notes.length > 0 ? (
      notes.map((n) => (
        <Row key={n.id}>
          <Icon title="Note icon">📄</Icon>
          <span>{n.title}</span>
          <span>{n.description}</span>
          <Button onClick={() => window.open(n.file)}>Download</Button>
        </Row>
      ))
    ) : (
      <Row>
        <span>📭</span>
        <span>No notes yet</span>
        <span>–</span>
        <span>–</span>
      </Row>
    )}
  </ContentPanel>
)}

      {openTab==='quizzes' && <CenterPanel>
        <ActionButton onClick={()=>navigate(`/student/quizzes`)}>Go to Quiz</ActionButton>
      </CenterPanel>}

      {openTab==='assignments' && <CenterPanel>
        <ActionButton onClick={()=>navigate(`/student/assignment-submit`)}>Go to Assignment</ActionButton>
      </CenterPanel>}

      {openTab === 'students' && (
  <ContentPanel>
    <TableHeader>
      <span>Icon</span>
      <span>Full Name</span>
      <span>Email</span>
      <span>Status</span>
    </TableHeader>

    {enrolledUsers.map((user) => (
      <Row key={user.id}>
        <Icon title="Student">👤</Icon>
        <span>{user.first_name} {user.last_name}</span>
        <span>{user.email}</span>
        <span>Enrolled</span>
      </Row>
    ))}
  </ContentPanel>
)}


            {modalLecture && (
        <ModalOverlay onClick={()=>setModalLecture(null)}>
          <ModalContent onClick={e=>e.stopPropagation()}>
            <h3>{modalLecture.title}</h3>
            <p>{modalLecture.description}</p>

            {modalLecture.video && (
              <>
                {modalLecture.video.includes("youtube.com") || modalLecture.video.includes("youtu.be") ? (
                  <VideoFrame
                    src={
                      modalLecture.video.includes("watch?v=")
                        ? modalLecture.video.replace("watch?v=", "embed/")
                        : modalLecture.video.includes("youtu.be")
                        ? `https://www.youtube.com/embed/${modalLecture.video.split("youtu.be/")[1]}`
                        : modalLecture.video
                    }
                    allowFullScreen
                  />
                ) : (
                  <p>⚠️ Unsupported video link</p>
                )}
              </>
            )}

            <Button onClick={()=>setModalLecture(null)}>Close</Button>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
};

export default StudentCourseDetailPage;
const fadeIn = keyframes` from { opacity:0 } to { opacity:1 } `;
const Container = styled.div`padding:2rem;background:#fff;color:#1F2937;animation:${fadeIn} 0.5s;`;
const Loader = styled.div`text-align:center;padding:3rem;color:#6B7280;`;
const Banner = styled.div`display:flex;align-items:center;gap:30px;padding:40px;background:#3B82F6;color:#fff;border-radius:0 0 20px 20px;flex-wrap:wrap;`;
const CourseImage = styled.img`width:260px;height:180px;object-fit:cover;border-radius:10px;box-shadow:0 8px 15px rgba(0,0,0,0.2);`;
const Info = styled.div`flex:1;`;
const Title = styled.h1`font-size:28px;margin:0;`;
const Instructor = styled.p`margin:10px 0;font-size:1rem;`;
const Meta = styled.div`display:flex;gap:15px;flex-wrap:wrap;font-size:0.95rem;`;
const Rating = styled.div`display:flex;align-items:center;`;
const TabNav = styled.div`display:flex;gap:1rem;margin:2rem 0;`;
const TabButton = styled.button`
  padding:0.6rem 1.2rem;font-size:1rem;border:none;background:none;cursor:pointer;color:#1F2937;
  ${({active})=>active && `border-bottom:3px solid #1E3A8A;font-weight:bold;`}
`;
const ContentPanel = styled.div`box-shadow:0 2px 8px rgba(0,0,0,0.1);border-radius:8px;overflow:hidden;`;
const TableHeader = styled.div`display:grid;grid-template-columns:60px 2fr 1fr 1fr;font-weight:bold;background:#1E3A8A;color:#fff;padding:0.75rem 1rem;`;
const Row = styled.div`
  display:grid;grid-template-columns:60px 2fr 1fr 1fr;align-items:center;padding:0.75rem 1rem;
  &:hover{background:#F5F7FA;}
  & span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
`;
const Icon = styled.span`font-size:1.2rem;`;
const Button = styled.button`
  background:#1E3A8A;color:#fff;border:none;padding:0.5rem 1rem;border-radius:6px;cursor:pointer;transition:background 0.2s;
  &:hover{background:#0A1F44;}
`;
const ToggleDesc = styled.span`cursor:pointer;color:#3B82F6;margin-left:0.5rem;`;
const Desc = styled.div`grid-column:2 / span 3;padding:0.5rem 1rem;font-size:0.9rem;color:#6B7280;`;
const CenterPanel = styled(ContentPanel)`display:flex;justify-content:center;padding:2rem;`;
const ActionButton = styled(Button)`margin:0 1rem;font-size:1.1rem;`;
const ModalOverlay = styled.div`position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;`;
const ModalContent = styled.div`background:#fff;padding:2rem;border-radius:8px;max-width:500px;width:90%;animation:${fadeIn} 0.3s;`;
const VideoFrame = styled.iframe`width:100%;height:240px;margin-top:1rem;border:none;border-radius:6px;`;
