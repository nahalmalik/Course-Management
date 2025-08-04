import React, { useEffect, useState } from "react";
import {fetchInstructorSales } from "../components/enrollmentUtils";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  font-family: "Segoe UI", sans-serif;
  color: #333;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #1E3A8A;
  text-align: center;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

const Thead = styled.thead`
  background-color: #eaf5f8;
  text-align: left;
`;

const Th = styled.th`
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 14px 20px;
  font-size: 14px;
  color: #444;
  border-bottom: 1px solid #f0f0f0;
`;

const Tr = styled.tr`
  transition: background 0.2s ease-in-out;
  &:hover {
    background-color: #f9f9f9;
  }
`;

const NoData = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 30px;
`;

const InstructorPurchaseHistory = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInstructorSales();

        setEnrollments(data);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
      }
    };
    loadData();
  }, []);

  // Filter only those courses where the instructor is the current user
 const instructorCourses = enrollments;

  return (
    <Wrapper>
      <Title>🧾 Instructor Course Sales</Title>

      {instructorCourses.length === 0 ? (
        <NoData>No enrollments for your courses yet.</NoData>
      ) : (
        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>Course</Th>
                <Th>Student</Th>
                <Th>Purchase Date</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <tbody>
              {instructorCourses.map((enroll, index) => (
                <Tr key={index}>
                  <Td>{enroll.course_title}</Td>
                  <Td>
                    {enroll.student_name || enroll.user_fullname || "Student"}<br />
                    <small>{enroll.student_email || enroll.user_email}</small>
                  </Td>
                  <Td>
                    {new Date(enroll.enrolled_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Td>
                  <Td>
                    $
                    {enroll.course?.price
                      ? parseFloat(enroll.course.price).toFixed(2)
                      : "0.00"}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Wrapper>
  );
};

export default InstructorPurchaseHistory;
