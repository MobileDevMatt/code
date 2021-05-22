import React from 'react';
import styled from 'styled-components/native';
import { StyleProp, View, ViewStyle } from 'react-native';
import cosmos from 'shared/src/cosmos';
import { H1, Paragraph } from 'theme/Typography';
import { ReadMore } from 'components/ReadMore';

export const BookAbout = ({longSummary, style} : {longSummary?: string, style?: StyleProp<ViewStyle>}) => {
  return (
    <View style={style}>
      { longSummary ?
            <AboutWrapper>
              <H1 style={{ marginBottom: cosmos.unit }}>About the book</H1>
              <ReadMore
                text={longSummary}
                TextWrapper={Paragraph}
              />
            </AboutWrapper>
          : null }
    </View>
  );
}

const AboutWrapper = styled.View`
  margin-top: ${cosmos.unit * 2}px;
`;
