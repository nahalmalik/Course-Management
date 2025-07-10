// src/components/EnrollButton.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import CartSidebar from "./CartSidebar";

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
    &:hover { background: #163f45; }
  }

  &.buy {
    background: #ffa500;
    color: #fff;
    &:hover { background: #e59400; }
  }
`;

const EnrollButton = ({ course }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAdd = () => {
    addToCart(course);
    setSidebarOpen(true);
  };

  const handleBuy = () => {
    addToCart(course);
    navigate("/checkout");
  };

  return (
    <>
      <Btn className="add" onClick={handleAdd}>Add to Cart</Btn>
      <Btn className="buy" onClick={handleBuy}>Buy Now</Btn>
      {sidebarOpen && (
        <CartSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default EnrollButton;
