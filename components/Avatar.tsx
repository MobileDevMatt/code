import React from 'react';
import { baseH1Styles } from 'theme/Typography';
import styled, { css } from 'styled-components/native';
import { getSmallestImage, getInitials } from 'shared/src/utils';
import cosmos, { palette } from 'shared/src/cosmos';
import { IImage } from 'shared/src/services';

interface IProps {
  images?: IImage
  name?: string;
  size?: number;
  fontSize?: number;
}

export const Avatar = ({ images, name, size, fontSize }: IProps): JSX.Element | null => {
  if (getSmallestImage(images)) {
    return  <UserImg style={{ height: size, width: size }} source={{ uri: getSmallestImage(images) }}/>
  }

  if(!name) return null;

  return (
    <Wrapper style={{ height: size, width: size }}>
      <Initals style={{ fontSize: fontSize}}>{getInitials(name)}</Initals>
    </Wrapper>
  );
};

const chip = css`
  width: 32px;
  height: 32px;
  border-radius:  ${cosmos.unit * 4}px;
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
`;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background: ${palette.auxillary.ocean.main};
`;

const Initals = styled.Text`
  ${baseH1Styles}
  color: ${palette.auxillary.ocean.alt};
`;

const UserImg = styled.Image`
  ${chip};
  background-color: ${palette.grayscale.granite};
  resize-mode: cover;
`;
