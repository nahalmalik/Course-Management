// src/components/EnrollButton.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import CartSidebar from "./CartSidebar";
import { getCurrentStudent, updateCurrentStudent } from "../contexts/studentData";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Btn = styled.button`
  margin-right: 10px;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &.add {
    background: #205a61;
    color: #fff;
    &:hover {
      background: #163f45;
    }
  }

  &.buy {
    background: #ffa500;
    color: #fff;
    &:hover {
      background: #e59400;
    }
  }
`;

const HeartIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  color: ${props => (props.liked ? "#e63946" : "#888")};
  transition: color 0.3s;

  &:hover {
    color: #e63946;
  }
`;

const EnrollButton = ({ course }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  // Check if course is already in wishlist
  useEffect(() => {
    const student = getCurrentStudent();
    if (student?.wishlist?.includes(course.id)) {
      setLiked(true);
    }
  }, [course.id]);

  const handleAdd = () => {
    addToCart(course);
    setSidebarOpen(true);
  };

  const handleBuy = () => {
    addToCart(course);
    navigate("/checkout");
  };

  const handleWishlistToggle = () => {
    const student = getCurrentStudent();
    if (!student) {
      alert("Please login to add to wishlist.");
      return;
    }

    const wishlist = student.wishlist || [];

    if (wishlist.includes(course.id)) {
      student.wishlist = wishlist.filter(id => id !== course.id);
      setLiked(false);
    } else {
      student.wishlist.push(course.id);
      setLiked(true);
    }

    updateCurrentStudent(student);
  };

  return (
    <>
      <Btn className="add" onClick={handleAdd}>Add to Cart</Btn>
      <Btn className="buy" onClick={handleBuy}>Buy Now</Btn>
      <HeartIcon liked={liked} onClick={handleWishlistToggle}>
        {liked ? <FaHeart /> : <FaRegHeart />}
      </HeartIcon>

      {sidebarOpen && (
        <CartSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default EnrollButton;
