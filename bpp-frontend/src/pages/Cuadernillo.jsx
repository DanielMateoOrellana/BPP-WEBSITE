import { useState } from 'react';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  width: 100%;
  height: 90vh;
  padding: 20px;
  background: #f5f5f5;
  position: relative;
`;
const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const WatermarkOverlay = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 193px;
  height: 48px;
  background: #f5f5f5;
  z-index: 999999;
  pointer-events: none;
  box-shadow: -5px 0 10px #f5f5f5;
`;
const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
`;

const Cuadernillo = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ViewerContainer>
      {isLoading && <LoadingIndicator>Cargando...</LoadingIndicator>}
      <StyledIframe
        src="https://publuu.com/flip-book/794071/1754364"
        title="BPP Cuadernillo"
        allow="fullscreen"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
      />
      <WatermarkOverlay />
    </ViewerContainer>
  );
};

export default Cuadernillo;
