import React from "react";
import styled from "styled-components";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import CourseCardGrid from "../components/CourseCardGrid";
import courseData from "../components/courseData";

const Container = styled.div`
  padding: 60px 30px;
  background: #f9f9f9;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 30px;
  color: rgb(42, 98, 113);
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-collapse: collapse;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
`;

const Thead = styled.thead`
  background: rgb(32, 125, 140);
  color: white;
`;

const Th = styled.th`
  padding: 16px;
  font-weight: 600;
  text-align: left;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
`;

const Image = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

const RemoveBtn = styled.button`
  background: transparent;
  border: none;
  color: #d11a2a;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #a80b1a;
  }
`;

const Summary = styled.div`
  margin-top: 30px;
  max-width: 400px;
  margin-left: auto;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Total = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #205a61;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  font-size: 16px;
  background: #ffc107;
  color: #222;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #e0a800;
  }
`;

const Empty = styled.p`
  text-align: center;
  font-size: 18px;
  color: #777;
  margin: 50px 0;
`;

const RecommendedSection = styled.div`
  margin-top: 60px;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
`;

const RecommendedTitle = styled.h3`
  font-size: 22px;
  color: #205a61;
  margin-bottom: 20px;
  text-align: center;
`;

const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price);
    return isNaN(price) ? acc : acc + price;
  }, 0);

  // Filter recommended courses (not already in cart)
  const recommendedCourses = courseData
    .filter((c) => !cartItems.some((ci) => ci.id === c.id))
    .slice(0, 4); // Show only 4

  return (
    <Container>
      <Title>Your Shopping Cart</Title>

      {cartItems.length === 0 ? (
        <Empty>Your cart is currently empty.</Empty>
      ) : (
        <>
          <Table>
            <Thead>
              <tr>
                <Th>Course</Th>
                <Th>Title</Th>
                <Th>Price</Th>
                <Th>Action</Th>
              </tr>
            </Thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <Td>
                    <Image src={item.image || item.thumbnail} alt={item.title} />

                  </Td>
                  <Td>
                    <strong>{item.title}</strong>
                    <br />
                    <small>{item.instructor}</small>
                  </Td>
                  <Td>
                    {isNaN(item.price) || item.price.toLowerCase() === "free"
                      ? "Free"
                      : `$${parseFloat(item.price).toFixed(2)}`}
                  </Td>
                  <Td>
                    <RemoveBtn onClick={() => removeFromCart(item.id)}>
                      <FaTrashAlt />
                    </RemoveBtn>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Summary>
            <Row>
              <span>Subtotal</span>
              <span>
                {subtotal === 0 ? "Free" : `$${subtotal.toFixed(2)}`}
              </span>
            </Row>

            <Total>
              Total: {subtotal === 0 ? "Free" : `$${subtotal.toFixed(2)}`}
            </Total>

            <Button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </Summary>
        </>
      )}

      {/* Recommended Section */}
      {recommendedCourses.length > 0 && (
        <RecommendedSection>
          <RecommendedTitle>Recommended Courses</RecommendedTitle>
          <RecommendedGrid>
            {recommendedCourses.map((course) => (
              <CourseCardGrid key={course.id} course={course} />
            ))}
          </RecommendedGrid>
        </RecommendedSection>
      )}
    </Container>
  );
};

export default Cart;
