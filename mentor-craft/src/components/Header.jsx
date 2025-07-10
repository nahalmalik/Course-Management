import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png"; // Ensure correct path

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgb(32, 125, 140);
  padding: 18px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
`;

const LogoImg = styled.img`
  height: 55px;
  margin-right: 12px;
`;

const LogoText = styled.span`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const IconGroup = styled.div`
  display: flex;
  gap: 15px;
  font-size: 18px;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <LogoLink to="/">
        <LogoImg src={logo} alt="Mentor Craft Logo" />
        <LogoText>Mentor Craft</LogoText>
      </LogoLink>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/login"><FaUser /></NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/student-dashboard">Dashboard</NavLink>
        <IconGroup>
          <FaSearch />
          <NavLink to="/cart"><FaShoppingCart /></NavLink>
        </IconGroup>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
