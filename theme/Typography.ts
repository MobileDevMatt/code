import styled, { css } from 'styled-components/native';
import cosmos, { palette, typography } from 'shared/src/cosmos';

const baseTitleStyles = css`
  font-family: ivarheadline;
  font-size: 36px;
  /* text-align: center; */
`;

export const Title = styled.Text`
  ${baseTitleStyles}
  color: ${palette.grayscale.white};
`;

export const TitleDark = styled.Text`
  ${baseTitleStyles}
  color: ${palette.grayscale.black};
`;

const TitleH3 = css`
  ${typography.title.h3}
  font-family: ivarheadline;
`;

export const SectionTitle = styled.Text`
  ${TitleH3}
  color: ${palette.grayscale.white};
`;

export const SectionTitleDark = styled.Text`
  ${TitleH3}
  color: ${palette.grayscale.black};
`;
export const SectionTitleTextCenter = styled.Text`
  ${TitleH3}
  color: ${palette.grayscale.black};
  text-align: center;
  font-size: 24px;
`;

export const baseH1Styles = css`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 22px;
`;

export const H1 = styled.Text`
  ${baseH1Styles};
  color: ${palette.grayscale.white};
`;

export const H1Dark = styled.Text`
  ${baseH1Styles}
  color: ${palette.grayscale.black};
`;

const Overline = styled.Text`
  ${typography.overline.medium}
  font-family: granvillebold;
  text-transform: uppercase;
`;

export const OverlineLight = styled(Overline)`
  color: ${palette.grayscale.white};
`;

export const OverlineDark = styled(Overline)`
  /* color: ${palette.grayscale.white}; */
`;

export const Body = styled.Text`
  font-family: granville;
  font-size: 15px;
  line-height: 20px;
  color: #161617;
`;

const baseParagraphStyles = css`
  font-family: larsseit;
  font-size: 16px;
  line-height: 22px;
`;

export const Paragraph = styled.Text`
  ${baseParagraphStyles}
  color: ${palette.grayscale.white};
`;

export const ParagraphDark = styled.Text`
  ${baseParagraphStyles}
  color: ${palette.primary.navy};
  font-size: ${cosmos.unit * 2}px;
`;

export const FormErrorText = styled.Text`
  font-family: larsseit;
  font-size: 15px;
  margin-top: 3px;
  color: ${palette.auxillary.crimson.alt};
`;

export const ParagraphDarkTextCenter = styled.Text`
  ${baseParagraphStyles}
  color: ${palette.primary.navy};
  font-size: 15px;
  text-align: center;
`;

export const SmallFooterText = styled.Text`
  font-family: larsseit;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  margin-bottom: 20px;
  color: ${palette.grayscale.granite};
`;

export const UnderlinedText = styled.Text`
  text-decoration-line: underline;
`;

export const NeutralLink = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 20px;
  color: ${palette.primary.bcBlue};
`;

export const BrandLink = styled.Text`
  font-family: larsseitbold;
  font-size: 16px;
  line-height: 22px;
  color: ${palette.primary.bcBlue};
`;
