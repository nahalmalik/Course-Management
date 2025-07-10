import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const HeaderWrapper = styled.header`
  background-color: rgb(32, 125, 140);
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
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
      <Logo>Mentor Craft</Logo>
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
          <NavLink to="/cart">
          <FaShoppingCart /></NavLink>
        </IconGroup>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
