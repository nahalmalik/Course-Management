import React from "react";
import styled from "styled-components";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo.png"; // Use your actual logo path

const FooterWrapper = styled.footer`
  background-color: #1E3A8A;
  color: #fff;
  padding: 60px 30px 20px;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Column = styled.div`
  flex: 1;
  min-width: 220px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  img {
    width: 50px;
    height: auto;
  }

  h2 {
    color: #fff;
    font-size: 24px;
    margin: 0;
  }
`;

const Text = styled.p`
  font-size: 14px;
  margin-top: 15px;
  line-height: 1.6;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    color: #ddd;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }

  h4 {
    color: #fff;
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const SocialIcons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;

  a {
    color: white;
    background: #3B82F6;
    padding: 10px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #fff;
      color: #4EB4F6;
    }
  }
`;

const BottomBar = styled.div`
  text-align: center;
  margin-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
  font-size: 13px;
  color: #ccc;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        {/* Logo & Description */}
        <Column>
          <LogoWrapper>
            <img src={logo} alt="Mentor Craft Logo" />
            <h2>Mentor Craft</h2>
          </LogoWrapper>
          <Text>
            Mentor Craft is your companion in skill development and online learning. Learn
            from expert instructors and grow your career.
          </Text>
          <SocialIcons>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaInstagram /></a>
          </SocialIcons>
        </Column>

        {/* Useful Links */}
        <Column>
          <LinkGroup>
            <h4>Links</h4>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
            <a href="/courses">Purchase Courses</a>
          </LinkGroup>
        </Column>

        {/* Class Links */}
        <Column>
          <LinkGroup>
            <h4>Quick Access</h4>
            <a href="/login/instructor">Teachers Panel </a>
            <a href="/login/student">Students Panel</a>
            <a href="/become-instructor">Become Instructor</a>
          </LinkGroup>
        </Column>

        {/* Support */}
        <Column>
          <LinkGroup>
            <h4>Support</h4>
            <a href="/faq">FAQ</a>
            <a href="/guide">Purchase Guide</a>
            <a href="/terms">Terms & Conditions</a>
            <a href="/privacy">Privacy Policy</a>
          </LinkGroup>
        </Column>
      </FooterContainer>

      {/* Bottom Copyright */}
      <BottomBar>
        © {new Date().getFullYear()} Mentor Craft | FYP
      </BottomBar>
    </FooterWrapper>
  );
};

export default Footer;
