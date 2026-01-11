import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  font-weight: 700;
  color: white;
  cursor: pointer;
`;

const JohnText = styled.span`
  font-family: 'Times New Roman', serif;
  font-size: 1.25rem;
  letter-spacing: 0.05em;
`;

const AmorimText = styled.span`
  font-family: sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
`;

export const Logo = () => {
  return (
    <LogoContainer>
      <JohnText>JOHN</JohnText>
      <AmorimText>AMORIM</AmorimText>
    </LogoContainer>
  );
};
