import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

// Header Wrapper
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #1E3A8A;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 786) {
    padding: 10px 16px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
`;

const LogoImg = styled.img`
  height: 50px;
  margin-right: 10px;
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

// Nav styles
const Nav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ open }) => (open ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 0;
    width: 75%;
    background-color: #1E3A8A;
    padding: 20px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
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

// Toggle button
const ToggleBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 22px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);

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

      <ToggleBtn onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </ToggleBtn>

      <Nav open={menuOpen}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>

        <DropdownWrapper ref={dropdownRef}>
          <DropdownIcon onClick={toggleDropdown}><FaUser /></DropdownIcon>
          <DropdownContent open={dropdownOpen}>
            <DropdownItem to="/login/student" onClick={() => setDropdownOpen(false)}>Login as Student</DropdownItem>
            <DropdownItem to="/login/instructor" onClick={() => setDropdownOpen(false)}>Login as Instructor</DropdownItem>
          </DropdownContent>
        </DropdownWrapper>

        <IconGroup>
          <NavLink to="/cart"><FaShoppingCart /></NavLink>
        </IconGroup>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
