import React from 'react';
import styled from 'styled-components/native';
import cosmos, { palette } from "shared/src/cosmos";
import { WhyShoppingHandsIcon } from './icons/WhyShoppingHandsIcon';
import { WhyjamesbookDiscussionIcon } from './icons/WhyjamesbookDiscussionIcon';
import { WhyjamesbookConnectIcon } from './icons/WhyjamesbookConnectIcon';


export const MarketingBlock = () => {
  return(
    <Container>
      <Title>Why jamesbook?</Title>

      <ImageContainer>
        <WhyShoppingHandsIcon />
        <IconTitle>Explore the author’s perspective and intent</IconTitle>
        <IconSubTitle>through cinematic interviews</IconSubTitle>
      </ImageContainer>

      <ImageContainer>
        <WhyjamesbookDiscussionIcon/>
        <IconTitle>Discuss with authors, experts, and readers</IconTitle>
        <IconSubTitle>via audio & video chats</IconSubTitle>
      </ImageContainer>

      <ImageContainer>
        <WhyjamesbookConnectIcon width={100}/>
        <IconTitle>Connect with people reading the same book</IconTitle>
        <IconSubTitle>at the same time as you</IconSubTitle>
      </ImageContainer>
      
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  border-top-width: 1px;
  border-top-color: ${palette.grayscale.granite};
  border-bottom-width: 1px;
  border-bottom-color: ${palette.grayscale.granite};
  align-items: center;
  margin-top: 80px;
  margin-bottom: 46px;
  padding: 48px 0px;
`;

const ImageContainer = styled.View`
  width: 205px;
  align-items: center;
  margin-top: ${cosmos.unit * 2}px;
`;

const Title = styled.Text`
  font-family: ivarheadline;
  font-size: 32px;
  line-height: 38px;
  color: ${palette.primary.navy};
`;

const IconTitle = styled.Text`
  font-family: larsseitbold;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  color: ${palette.primary.navy};
  margin-top: 4px;
`;

const IconSubTitle = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: ${palette.primary.navy};
`;