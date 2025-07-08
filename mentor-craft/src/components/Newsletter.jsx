import React from "react";
import styled from "styled-components";

const Section = styled.section`
  background-color: rgb(42, 98, 113);
  padding: 60px 30px;
  color: #fff;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 25px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;

  @media(min-width: 600px) {
    flex-direction: row;
  }

  input {
    padding: 14px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    flex: 1;
  }

  button {
    padding: 14px 24px;
    background-color:#FFBF00 ;
    color: black;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background-color:#FFEA00;
    }
  }
`;

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for subscribing! 🚀");
  };

  return (
    <Section>
      <Title>Subscribe to Our Newsletter</Title>
      <Subtitle>Get updates on new courses, special discounts, and more!</Subtitle>
      <Form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </Form>
    </Section>
  );
};

export default Newsletter;
