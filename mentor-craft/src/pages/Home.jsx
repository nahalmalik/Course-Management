import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedCourses from "../components/FeaturedCourses";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import TopCategories from "../components/TopCategories";
import LearningOptions from "../components/LearningOptions";
import Instructors from "../components/Instructors";
import BlogUpdates from "../components/BlogUpdates";
import AboutShort from "../components/AboutShort";

const Home = () => {
  return (
    <>
            <HeroSection />
            <TopCategories />
            <FeaturedCourses />
            <LearningOptions />
            <AboutShort />           
            <Instructors />
            <BlogUpdates />
            <Testimonials />        
            <Newsletter />

    </>
  );
};

export default Home;
