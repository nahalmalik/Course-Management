// src/components/EnrollButton.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { enrollCourse } from "./enrollmentUtils";
import { FaCheckCircle } from "react-icons/fa";

const Button = styled.button`
  background: rgb(24, 90, 100);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: rgb(16, 70, 80);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ open }) => (open ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin: 10px 0 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
`;

const CancelButton = styled(Button)`
  background: #ccc;
  color: #333;

  &:hover {
    background: #bbb;
  }
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #dff0d8;
  color: #3c763d;
  padding: 14px 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 999;
`;

const EnrollButton = ({ course }) => {
  const [open, setOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [notification, setNotification] = useState(false);

  const isPaid = course.price !== "Free";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isPaid && !screenshot) {
      alert("Please upload a payment screenshot.");
      return;
    }

    enrollCourse({
      ...course,
      student: studentName,
      enrolledAt: new Date().toISOString(),
    });

    setOpen(false);
    setNotification(true);
    setTimeout(() => setNotification(false), 5000);

    setStudentName("");
    setScreenshot(null);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Enroll Now</Button>

      <ModalOverlay open={open}>
        <ModalBox>
          <h3>Enroll in: {course.title}</h3>
          <form onSubmit={handleSubmit}>
            <Label>Your Name</Label>
            <Input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />

            {isPaid && (
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

            <Actions>
              <CancelButton type="button" onClick={() => setOpen(false)}>
                Cancel
              </CancelButton>
              <Button type="submit">Enroll</Button>
            </Actions>
          </form>
        </ModalBox>
      </ModalOverlay>

      {notification && (
        <Notification>
          <FaCheckCircle />
          <div>
            Successfully enrolled in <strong>{course.title}</strong>!
          </div>
        </Notification>
      )}
    </>
  );
};

export default EnrollButton;
