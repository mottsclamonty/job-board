import styled from 'styled-components';

const PaginationContainerWrapper = styled.section`
  height: 6rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;
  .btn-container {
    background: var(--primary-100);
    border-radius: var(--borderRadius);
  }
  .pageBtn {
    background: transparent;
    border-color: transparent;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    transition: var(--transition);
    border-radius: var(--borderRadius);
    cursor: pointer;
  }
  .pageBtn:hover {
    background: var(--primary-500);
    color: var(--white);
    transform: scale(1.1);
  }
  .active {
    background: var(--primary-500);
    color: var(--white);
    &:hover {
      background: var(--primary-500);
      color: var(--white);
      transform: scale(1);
    }
  }
  .prev-btn,
  .next-btn {
    width: 100px;
    height: 40px;
    background: var(--white);
    border-color: transparent;
    border-radius: var(--borderRadius);
    color: var(--primary-500);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: var(--transition);

    &:disabled {
      color: var(--primary-300);
    }
  }
  .prev-btn:hover,
  .next-btn:hover {
    background: var(--primary-500);
    color: var(--white);
    &:disabled {
      background: var(--white);
      color: var(--primary-300);
    }
  }
`;
export default PaginationContainerWrapper;
