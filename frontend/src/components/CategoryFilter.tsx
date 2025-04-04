import { useEffect, useState } from 'react';
import './CategoryFilter.css';

//Function that allows user to filter results by certain Book Categories
function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  //pulls from backend api that has a list of all the potential categories and lists them on the frontend as filters
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://mission13-backend-justus.azurewebsites.net/Book/GetBookCategories'
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  //Handle user checking and unchecking which categories they want displayed
  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];

    setSelectedCategories(updatedCategories);
  }
  //Extra Bootstrap used to display filters in an accordian that can be collapsed or opened
  return (
    <div className="category-filter">
      {/* Accordion wrapper */}
      <div className="accordion" id="categoryAccordion">
        {/* Accordion Item */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseCategories"
              aria-expanded="true"
              aria-controls="collapseCategories"
            >
              Filter by Book Category
            </button>
          </h2>
          <div
            id="collapseCategories"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#categoryAccordion"
          >
            <div className="accordion-body">
              <div className="category-list">
                {categories.map((c) => (
                  <div key={c} className="category-item">
                    <input
                      type="checkbox"
                      id={c}
                      value={c}
                      className="category-checkbox"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={c}>{c}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryFilter;
