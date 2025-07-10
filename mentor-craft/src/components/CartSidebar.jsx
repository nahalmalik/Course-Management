// src/components/CartSidebar.jsx
import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Slide = styled.div`
  position: fixed;
  top: 0;
  right: ${({ open }) => (open ? "0" : "-100%")};
  width: 350px;
  height: 100%;
  background: #fff;
  box-shadow: -3px 0 8px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
`;

const CloseIcon = styled(FaTimes)`
  cursor: pointer;
  font-size: 18px;
`;

const CartItems = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const CartItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  color: #00aa55;
`;

const Remove = styled.span`
  font-size: 14px;
  color: #555;
  cursor: pointer;
`;

const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid #ddd;
`;

const Subtotal = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: right;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
`;

const ViewCartButton = styled(Button)`
  background: #00aa44;
  color: white;

  &:hover {
    background: #008f3a;
  }
`;

const CheckoutButton = styled(Button)`
  background: #ffc107;
  color: black;

  &:hover {
    background: #e0a800;
  }
`;

const CartSidebar = ({ open, onClose }) => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Proper subtotal calculation (ignore free items)
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = parseFloat(item.price);
    return isNaN(numericPrice) ? acc : acc + numericPrice;
  }, 0);

  return (
    <Slide open={open}>
      <Header>
        Shopping Cart
        <CloseIcon onClick={onClose} />
      </Header>

      <CartItems>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, i) => (
            <CartItem key={i}>
              <Thumbnail src={item.image} alt={item.title} />
              <ItemInfo>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemPrice>
                  {isNaN(item.price) || item.price.toLowerCase() === "free"
                    ? "Free"
                    : `$${parseFloat(item.price).toFixed(2)} ×1`}
                </ItemPrice>
              </ItemInfo>
              <Remove onClick={() => removeFromCart(item.id)}>×</Remove>
            </CartItem>
          ))
        )}
      </CartItems>

      {cartItems.length > 0 && (
        <Footer>
          <Subtotal>Total: ${subtotal.toFixed(2)}</Subtotal>
          <ViewCartButton onClick={() => { navigate("/cart"); onClose(); }}>
            View Cart
          </ViewCartButton>
          <CheckoutButton onClick={() => { navigate("/checkout"); onClose(); }}>
            Checkout
          </CheckoutButton>
        </Footer>
      )}
    </Slide>
  );
};

export default CartSidebar;
