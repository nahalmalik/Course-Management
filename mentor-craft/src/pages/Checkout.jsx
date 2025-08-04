import React, { useState } from "react";
import styled from "styled-components";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { enrollCourse, enrollCourseLocal } from "../components/enrollmentUtils";
import { getCurrentUser, getAccessToken } from "../contexts/authUtils";
import API from "../api"; 

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 60px 30px;
  background: #f9f9f9;
  gap: 30px;
`;

const Left = styled.div`
  flex: 2;
  min-width: 300px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
`;

const Right = styled.div`
  flex: 1;
  min-width: 280px;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

const Title = styled.h2`
  font-size: 22px;
  color: #1E3A8A;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const CourseBox = styled.div`
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background: #fafafa;
`;

const Button = styled.button`
  background: #ffa500;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;

  &:hover {
    background: #e59400;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Total = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #205a61;
`;
const Thumbnail = styled.img`
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = getCurrentUser();
  const isLocalUser = user?.source === "local";

  const hasPaidCourse = cartItems.some(
    (course) =>
      !isNaN(course.price) && course.price.toString().toLowerCase() !== "free"
  );

  const total = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price);
    return isNaN(price) ? acc : acc + price;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email) {
      setError("Please fill in all required fields.");
      return;
    }

    if (hasPaidCourse && !screenshot) {
      setError("Upload payment screenshot for paid courses.");
      return;
    }

    try {
      if (isLocalUser) {
        cartItems.forEach((course) =>
          enrollCourseLocal({ course, student: name, email })
        );
      } else {
        // ✅ Step 1: Create order first
        const formData = new FormData();
formData.append("full_name", name);
formData.append("email", email);
formData.append("total_amount", total.toFixed(2)); // optional if backend expects it

// Append each course UUID as an item (ListField expects multiple "items" keys)
cartItems.forEach((course) => {
  formData.append("items", course.course_id || course.id); // UUID expected
});

if (screenshot) {
  formData.append("payment_screenshot", screenshot);
}

const orderRes = await API.post("users/checkout/", formData, {
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
    "Content-Type": "multipart/form-data",
  },
});


        const orderId = orderRes.data.order_id;

        // ✅ Step 2: Enroll each course
        await Promise.all(
          cartItems.map((course) =>
            enrollCourse({
              course,
              student: name,
              email,
              screenshot,
              orderId,
            })
          )
        );
      }

      clearCart();
      navigate("/student/courses");
    } catch (err) {
      console.error("❌ Enrollment failed:", err);
      setError("Something went wrong during enrollment.");
    }
  };

  return (
    <Wrapper>
      <Left>
        <Title>Billing Information</Title>
        <form onSubmit={handleSubmit}>
          <Label>Full Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {hasPaidCourse && (
            <>
              <Label>Upload Payment Screenshot</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
                required
              />
            </>
          )}

          <Title style={{ marginTop: "30px" }}>Your Courses</Title>
          {cartItems.map((course) => (
            <CourseBox key={course.id}>
              <strong>{course.title}</strong>
              <br />
              <small>{course.instructor}</small>
              <div>
                Price:{" "}
                {isNaN(course.price) || course.price.toLowerCase() === "free"
                  ? "Free"
                  : `$${parseFloat(course.price).toFixed(2)}`}
              </div>
            </CourseBox>
          ))}

          {error && <p style={{ color: "red" }}>{error}</p>}

          <Button type="submit">Place Order</Button>
        </form>
      </Left>

      <Right>
        <Title>Order Summary</Title>
        {cartItems.map((course) => (
          <CourseBox key={course.id}>
            <Thumbnail src={course.image || course.thumbnail} alt={course.title} />
            <strong>{course.title}</strong>
            <br />
            <small>{course.instructor}</small>
            <div>
              Price:{" "}
              {isNaN(course.price) || course.price.toLowerCase() === "free"
                ? "Free"
                : `$${parseFloat(course.price).toFixed(2)}`}
            </div>
          </CourseBox>
        ))}

        <SummaryItem>
          <div>Subtotal</div>
          <div>{total === 0 ? "Free" : `$${total.toFixed(2)}`}</div>
        </SummaryItem>
        <SummaryItem>
          <div>Tax (10%)</div>
          <div>${(total * 0.1).toFixed(2)}</div>
        </SummaryItem>
        <SummaryItem>
          <div>Discount</div>
          <div>${(total * 0.05).toFixed(2)}</div>
        </SummaryItem>

        <hr />
        <SummaryItem>
          <Total>Total:</Total>
          <Total>{total === 0 ? "Free" : `$${total.toFixed(2)}`}</Total>
        </SummaryItem>
      </Right>
    </Wrapper>
  );
};

export default Checkout;
