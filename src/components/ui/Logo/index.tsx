import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const JohnText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.serif};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  letter-spacing: 0.05em;
`;

const AmorimText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
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
