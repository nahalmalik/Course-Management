import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTrophy, FaCertificate, FaChartLine, FaMedal, FaDownload } from 'react-icons/fa';

const dummyBadges = [
  { id: 1, name: "Quiz Master", description: "Completed 5 quizzes", icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { id: 2, name: "Streak Star", description: "7-day login streak", icon: "https://cdn-icons-png.flaticon.com/512/4825/4825041.png" }
];

const dummyCertificates = [
  { id: 1, course_title: "React for Beginners", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { id: 2, course_title: "Django Essentials", file: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
];

const dummyActivities = [
  { id: 1, timestamp: new Date().toISOString(), action: "Completed Quiz", xp_earned: 30 },
  { id: 2, timestamp: new Date().toISOString(), action: "Finished Course", xp_earned: 100 }
];

const StudentAchievementsPage = () => {
  const [xpData, setXpData] = useState({ xp: 320, level: 3 });
  const [badges, setBadges] = useState(dummyBadges);
  const [certificates, setCertificates] = useState(dummyCertificates);
  const [activities, setActivities] = useState(dummyActivities);
  const [selectedCert, setSelectedCert] = useState(null);

  const xpThreshold = level => 100 + (level - 1) * 100;
  const currentLevelXP = xpData.xp - ((xpData.level - 1) * 100);
  const nextLevelXP = xpThreshold(xpData.level);
  const xpPercent = Math.min(100, (currentLevelXP / nextLevelXP) * 100) + '%';

  return (
    <Container>
      <Header>🎓 Your Learning Achievements</Header>
      
      <SummaryGrid>
        <Card>
          <Icon><FaChartLine /></Icon>
          <label>Level {xpData.level}</label>
          <ProgressBar><ProgressFill style={{ width: xpPercent }} /></ProgressBar>
          <small>{currentLevelXP} / {nextLevelXP} XP</small>
        </Card>
        <Card>
          <Icon><FaMedal /></Icon>
          <label>Badges Earned</label>
          <BadgeCount>{badges.length}</BadgeCount>
        </Card>
        <Card>
          <Icon><FaCertificate /></Icon>
          <label>Certificates</label>
          <BadgeCount>{certificates.length}</BadgeCount>
        </Card>
      </SummaryGrid>

      <Section>
        <SectionTitle><FaMedal /> Badges</SectionTitle>
        <BadgeGrid>
          {badges.length ? badges.map(b => (
            <BadgeCard key={b.id} title={b.description}>
              <img src={b.icon} alt={b.name} />
              <span>{b.name}</span>
            </BadgeCard>
          )) : <EmptyMessage>No badges yet 😢</EmptyMessage>}
        </BadgeGrid>
      </Section>

      <Section>
        <SectionTitle><FaCertificate /> Certificates</SectionTitle>
        <CertGrid>
          {certificates.length ? certificates.map(c => (
            <CertCard key={c.id} onClick={() => setSelectedCert(c)}>
              <span>{c.course_title}</span>
              <CertButton>Preview</CertButton>
            </CertCard>
          )) : <EmptyMessage>No certificates yet</EmptyMessage>}
        </CertGrid>
      </Section>

      <Section>
        <SectionTitle><FaTrophy /> Activity Timeline</SectionTitle>
        <ActivityList>
          {activities.length ? activities.map(a => (
            <ActivityRow key={a.id}>
              <Dot />
              <ActivityContent>
                <small>{new Date(a.timestamp).toLocaleString()}</small>
                <p>{a.action} (+{a.xp_earned} XP)</p>
              </ActivityContent>
            </ActivityRow>
          )) : <EmptyMessage>No activity recorded</EmptyMessage>}
        </ActivityList>
      </Section>

      {selectedCert && (
        <ModalOverlay onClick={() => setSelectedCert(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>{selectedCert.course_title}</h3>
            <iframe src={selectedCert.file} width="100%" height="400px" title="Certificate" />
            <DownloadButton onClick={() => window.open(selectedCert.file, '_blank')}>
              <FaDownload /> Download Certificate
            </DownloadButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default StudentAchievementsPage;

const fadeIn = keyframes`from {opacity: 0;} to {opacity: 1;}`;
const zoomIn = keyframes`from {transform: scale(0.9); opacity: 0;} to {transform: scale(1); opacity: 1;}`;

const Container = styled.div`
  padding: 2rem;
  background: var(--background);
  color: var(--textPrimary);
  animation: ${fadeIn} 0.5s ease;
`;

const Header = styled.h1`
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2rem;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s;
  &:hover { transform: translateY(-4px); }
`;

const Icon = styled.div`
  font-size: 2.5rem;
  color: var(--secondary);
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  background: #eee;
  border-radius: 6px;
  height: 12px;
  margin: 0.5rem 0;
`;

const ProgressFill = styled.div`
  background: var(--main);
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease;
`;

const BadgeCount = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--secondary);
  margin-top: 0.3rem;
`;

const Section = styled.section`margin-bottom: 2rem;`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--textPrimary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const BadgeCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  animation: ${zoomIn} 0.3s ease;
  &:hover { transform: scale(1.05); }
  img { width: 60px; height: 60px; margin-bottom: 0.5rem; }
`;

const CertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CertCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const CertButton = styled.div`
  background: var(--secondary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: background 0.2s;
  &:hover { background: var(--darkBlue); }
`;

const ActivityList = styled.div`
  border-left: 3px solid var(--main);
  padding-left: 1rem;
`;

const ActivityRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${fadeIn} 0.5s forwards;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  background: var(--main);
  border-radius: 50%;
  margin-right: 0.75rem;
  margin-top: 4px;
`;

const ActivityContent = styled.div`
  small { color: var(--textSecondary); font-size: 0.85rem; }
  p { margin: 0.2rem 0; font-weight: 500; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
`;

const DownloadButton = styled.button`
  margin-top: 1rem;
  background: var(--main);
  border: none;
  padding: 0.6rem 1.2rem;
  color: white;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { background: var(--secondary); }
`;

const EmptyMessage = styled.p`
  text-align: center;
  padding: 2rem;
  color: var(--textSecondary);
`;
