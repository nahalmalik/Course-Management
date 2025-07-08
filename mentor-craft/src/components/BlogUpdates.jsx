import React from "react";
import styled from "styled-components";
import blog1 from "../assets/blog1.jpeg";
import blog2 from "../assets/blog2.webp";
import blog3 from "../assets/blog3.jpeg";
import { Link } from "react-router-dom";

const Section = styled.section`
  padding: 60px 30px;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  color: rgb(42, 98, 113);
  font-size: 30px;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  max-width: 320px;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 12px rgba(0,0,0,0.06);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .content {
    padding: 20px;

    h4 {
      font-size: 18px;
      color: rgb(32, 125, 140);
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      color: #555;
      margin-bottom: 15px;
    }

    a {
      font-weight: bold;
      font-size: 14px;
      text-decoration: none;
      color: rgb(42, 98, 113);

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const blogs = [
  {
    id: 1,
    title: "5 Tips to Succeed in Online Learning",
    excerpt: "Discover how to stay focused and productive in your online classes with these simple tips.",
    image: blog1,
  },
  {
    id: 2,
    title: "Top Programming Languages to Learn in 2025",
    excerpt: "Explore the most in-demand programming skills for developers and data scientists.",
    image: blog2,
  },
  {
    id: 3,
    title: "Design Trends Every UI/UX Student Should Know",
    excerpt: "Stay ahead in design by mastering these modern UI/UX patterns and practices.",
    image: blog3,
  },
];

const BlogUpdates = () => {
  return (
    <Section>
      <Title>News & Updates</Title>
      <Grid>
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <img src={blog.image} alt={blog.title} />
            <div className="content">
              <h4>{blog.title}</h4>
              <p>{blog.excerpt}</p>
              <Link to={`/blog/${blog.id}`}>Read More →</Link>
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

export default BlogUpdates;
