import HeroBanner from "../components/HeroBanner";
import AboutShort from "../components/AboutShort";
import Highlights from "../components/Highlights";
import WhyChoose from "../components/WhyChoose";
import MissionVision from "../components/MissionVision";
import Instructors from "../components/Instructors";
import Testimonials from "../components/Testimonials";

const About = () => {
  return (
    <>
      <HeroBanner
        title="About Mentor Craft"
        subtitle="Empowering learners across the world through flexible and expert-led online education."
      />
      <Highlights />
      <AboutShort />
      <MissionVision />
      <WhyChoose /> 
      <Instructors />
    </>
  );
};

export default About;
