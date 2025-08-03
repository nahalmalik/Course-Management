import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEnrollmentsFromBackend } from "../../components/enrollmentUtils";
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
  color: #205d67;
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
  min-width: 600px;
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

const ReceiptButton = styled(Link)`
  background-color: #207d8c;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;

  &:hover {
    background-color: #2a6271;
  }
`;

const NoData = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 30px;
`;

const EnrollmentHistory = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEnrollmentsFromBackend();
        setEnrollments(data);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
      }
    };
    loadData();
  }, []);

  return (
    <Wrapper>
      <Title>📚 My Enrollment History</Title>

      {enrollments.length === 0 ? (
        <NoData>No courses purchased yet.</NoData>
      ) : (
        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>Course</Th>
                <Th>Instructor</Th>
                <Th>Date</Th>
                <Th>Price</Th>
                <Th>Receipt</Th>
              </Tr>
            </Thead>
            <tbody>
              {enrollments.map((enroll, index) => (
                <Tr key={index}>
                  <Td>{enroll.course_title}</Td>
                  <Td>{enroll.instructor}</Td>
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
                  <Td>
                    {enroll.order_id ? (
                      <ReceiptButton to={`/receipt/${enroll.order_id}`}>
                        View Receipt
                      </ReceiptButton>
                    ) : (
                      "N/A"
                    )}
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

export default EnrollmentHistory;
