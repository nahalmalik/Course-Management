import React from "react";
import styled from "styled-components";

const FilterBox = styled.div`
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const Title = styled.h4`
  font-size: 16px;
  color: #1E3A8A;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const RadioLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const CourseFilters = ({ filters, onFilterChange }) => {
  const categories = ["Design", "Development", "Marketing", "AI", "Business", "IT"];

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updated = [...filters.categories];
    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((cat) => cat !== value);
    }
    onFilterChange({ ...filters, categories: updated });
  };

  const handlePriceChange = (e) => {
    onFilterChange({ ...filters, price: e.target.value });
  };

  const handleDurationChange = (e) => {
    onFilterChange({ ...filters, duration: e.target.value });
  };

  return (
    <FilterBox>
      <Section>
        <Title>Category</Title>
        {categories.map((cat) => (
          <CheckboxLabel key={cat}>
            <input
              type="checkbox"
              value={cat}
              checked={filters.categories.includes(cat)}
              onChange={handleCategoryChange}
            />
            {" "}{cat}
          </CheckboxLabel>
        ))}
      </Section>

      <Section>
        <Title>Price</Title>
        <RadioLabel>
          <input
            type="radio"
            value="all"
            checked={filters.price === "all"}
            onChange={handlePriceChange}
          />
          {" "}All
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="free"
            checked={filters.price === "free"}
            onChange={handlePriceChange}
          />
          {" "}Free
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="paid"
            checked={filters.price === "paid"}
            onChange={handlePriceChange}
          />
          {" "}Paid
        </RadioLabel>
      </Section>

      <Section>
        <Title>Duration</Title>
        <RadioLabel>
          <input
            type="radio"
            value="all"
            checked={filters.duration === "all"}
            onChange={handleDurationChange}
          />
          {" "}All
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="<5"
            checked={filters.duration === "<5"}
            onChange={handleDurationChange}
          />
          {" "}Less than 5h
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value="5-15"
            checked={filters.duration === "5-15"}
            onChange={handleDurationChange}
          />
          {" "}5h to 15h
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            value=">15"
            checked={filters.duration === ">15"}
            onChange={handleDurationChange}
          />
          {" "}More than 15h
        </RadioLabel>
      </Section>
    </FilterBox>
  );
};

export default CourseFilters;
