import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";

const HeaderWrapper = styled.header`
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

// Dropdown styles
const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownIcon = styled.div`
  cursor: pointer;
  font-size: 18px;
  color: white;
`;

const DropdownContent = styled.div`
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.25s ease;
  
  position: absolute;
  background-color: white;
  color: black;
  min-width: 160px;
  right: 0;
  top: 35px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  z-index: 10;
`;

const DropdownItem = styled(Link)`
  padding: 10px 16px;
  display: block;
  text-decoration: none;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* USER DROPDOWN */}
        <DropdownWrapper ref={dropdownRef}>
          <DropdownIcon onClick={toggleDropdown}><FaUser /></DropdownIcon>
          <DropdownContent open={dropdownOpen}>
            <DropdownItem to="/login/student" onClick={() => setDropdownOpen(false)}>Login as Student</DropdownItem>
            <DropdownItem to="/login/instructor" onClick={() => setDropdownOpen(false)}>Login as Instructor</DropdownItem>
          </DropdownContent>
        </DropdownWrapper>

        <NavLink to="/instructor-dashboard">Instructor Dashboard</NavLink>
        <NavLink to="/student/overview">Student Dashboard</NavLink>

        <IconGroup>
          <FaSearch />
          <NavLink to="/cart"><FaShoppingCart /></NavLink>
        </IconGroup>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
