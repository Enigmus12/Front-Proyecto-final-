import React from 'react';

interface HeaderProps {
  title: string;
}

/**
 * Header component that displays a title inside a header element.
 *
 * @component
 * @param {HeaderProps} props - The props for the Header component.
 * @param {string} props.title - The title to be displayed in the header.
 * @returns {JSX.Element} The rendered Header component.
 */
const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
}

export default Header;