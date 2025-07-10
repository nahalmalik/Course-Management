// src/pages/Receipt.jsx
import React, { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getEnrollmentById } from "../components/enrollmentUtils";
import styled from "styled-components";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import logo from "../assets/logo.png";

const Wrapper = styled.div`
  max-width: 750px;
  margin: 50px auto;
  padding: 40px 30px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
  position: relative;
  color: #333;

  @media print {
    box-shadow: none;
  }
`;

const Watermark = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  color: rgba(200, 200, 200, 0.15);
  pointer-events: none;
  user-select: none;
  z-index: 0;
`;

const Breadcrumbs = styled.div`
  font-size: 14px;
  margin-bottom: 25px;
  color: #555;
  a {
    color: rgb(42, 98, 113);
    text-decoration: none;
    font-weight: 500;
  }
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto 30px;
  width: 160px;
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 28px;
  color: rgb(32, 125, 140);
  margin-bottom: 30px;
`;

const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #444;
`;

const Value = styled.span`
  color: #333;
  word-break: break-word;
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 40px;
  flex-wrap: wrap;

  @media print {
    display: flex;
  }
`;

const Signature = styled.div`
  flex: 1;
  min-width: 200px;
  font-size: 14px;
  margin-bottom: 20px;

  p:first-child {
    margin-bottom: 50px;
    border-top: 1px solid #aaa;
    width: 200px;
    padding-top: 10px;
  }

  p:last-child {
    font-weight: bold;
    color: #444;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 10px;
  font-size: 14px;
  color: rgb(42, 98, 113);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media print {
    display: none;
  }
`;

const QRBox = styled.div`
  flex: 1;
  text-align: right;
  min-width: 150px;

  @media print {
    text-align: right;
  }
`;

const QRNote = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 15px;

  @media print {
    display: none;
  }
`;

const PrintButton = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  background-color: rgb(32, 125, 140);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: rgb(42, 98, 113);
  }
`;

const ThankYou = styled.p`
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
  color: rgb(42, 98, 113);
  font-weight: 500;
`;

const Receipt = () => {
  const { orderId } = useParams();
  const course = getEnrollmentById(orderId);
  const receiptRef = useRef();

  const handleDownload = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    const cleanTitle = course.title.replace(/\s+/g, "-").toLowerCase();
    const filename = `mentorcraft-receipt-${cleanTitle}-${orderId}.pdf`;
    pdf.save(filename);
  };

  const generateReceiptNumber = (orderId) => {
    const [id, timestamp] = orderId.split("-");
    const date = new Date(parseInt(timestamp));
    const yyyymmdd = date.toISOString().split("T")[0].replace(/-/g, "");
    return `#RCPT-${yyyymmdd}-${id.padStart(4, "0")}`;
  };

  if (!course) {
    return (
      <Wrapper>
        <Heading>Receipt Not Found</Heading>
        <p style={{ color: "#666" }}>
          Sorry, we couldn’t locate a receipt for this order.
        </p>
        <BackLink to="/student-dashboard">← Back to Dashboard</BackLink>
      </Wrapper>
    );
  }

  const formatPrice = (price) =>
    isNaN(price) || price.toLowerCase() === "free"
      ? "Free"
      : `$${parseFloat(price).toFixed(2)}`;

  return (
    <Wrapper ref={receiptRef}>
      <Watermark>Mentor Craft</Watermark>

      <Breadcrumbs>
        <Link to="/">Home</Link> &nbsp;/&nbsp;
        <Link to="/student-dashboard">Dashboard</Link> &nbsp;/&nbsp;
        <span>Receipt</span>
      </Breadcrumbs>

      <Logo src={logo} alt="Mentor Craft Logo" />
      <Heading>Course Payment Receipt</Heading>

      <ReceiptRow>
        <Label>Receipt #:</Label>
        <Value>{generateReceiptNumber(course.orderId)}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Order ID:</Label>
        <Value>{course.orderId}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Course:</Label>
        <Value>{course.title}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Instructor:</Label>
        <Value>{course.instructor}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Student:</Label>
        <Value>{course.student}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Email:</Label>
        <Value>{course.email}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Price:</Label>
        <Value>{formatPrice(course.price)}</Value>
      </ReceiptRow>
      <ReceiptRow>
        <Label>Date:</Label>
        <Value>{new Date(course.enrolledAt).toLocaleString()}</Value>
      </ReceiptRow>

      <FooterSection>
        <div>
          <Signature>
            <p>Signed by: Admin</p>
            <p>Mentor Craft Official</p>
          </Signature>
          <BackLink to="/student-dashboard">← Back to Dashboard</BackLink>
        </div>

        <QRBox>
          <QRCode value={course.orderId} size={64} />
          <QRNote>Scan to verify</QRNote>
        </QRBox>
      </FooterSection>

      <ButtonRow>
        <PrintButton onClick={() => window.print()}>🖨️ Print</PrintButton>
        <PrintButton onClick={handleDownload}>⬇️ Download PDF</PrintButton>
      </ButtonRow>

      <ThankYou>
        🎉 Thank you for choosing Mentor Craft — your journey to mastery begins now!
      </ThankYou>
    </Wrapper>
  );
};

export default Receipt;
