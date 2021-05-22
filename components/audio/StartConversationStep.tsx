import React from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled, { css } from 'styled-components/native';
import { View } from 'react-native';
import { H1Dark, ParagraphDark } from 'theme/Typography';
import { Button } from 'theme/Button';
import { OpenPrivacyIcon } from '../icons/OpenPrivacyIcon';
import { ClubPrivacyIcon } from '../icons/ClubPrivacyIcon';
import { PrivatePrivacyIcon } from '../icons/PrivatePrivacyIcon';
import { AUDIENCE } from 'shared/src/services/conversation-service';
import { useGetUserFull } from '../../hooks/useGetUser';
import { IBook } from 'shared/src/services/book-service';
import { IUser_Club } from 'shared/src/services/user-service';
import { IClubDetail } from 'shared/src/services/club-service';

interface IProps {
  selectedPrivacyOption?: { name: string, description: string, value: AUDIENCE } | undefined;
  setSelectedPrivacyOption: React.Dispatch<React.SetStateAction<undefined | { name: string, description: string, value: AUDIENCE }>>;
  goToNextStep: () => void;
  book?: IBook;
  club?: IUser_Club | IClubDetail;
}

const StartConversationStep = ({ setSelectedPrivacyOption, selectedPrivacyOption, goToNextStep, club, book }: IProps) => {
  const { data: fullUser, isLoading: isLoadingUserData } = useGetUserFull();

  const clubs = fullUser?.clubs || [];

  let privacyOptions = [
    {
      name: 'Open',
      description: 'Anyone can join',
      value: AUDIENCE.OPEN,
    },
    {
      name: 'Club',
      description: 'Club members can join',
      value: AUDIENCE.CLUB,
    },
    {
      name: 'Private',
      description: 'Only people you invite can join',
      value: AUDIENCE.PRIVATE,
    },
  ];

  if (!clubs.length || club || book) {
    privacyOptions = [
      { name: 'Open', description: 'Anyone can join.', value: AUDIENCE.OPEN },
      { name: 'Private', description: 'Only people you invite can join', value: AUDIENCE.PRIVATE },
    ];
  }


  const handleFormSubmit = () => {
    goToNextStep();
  };

  const buttonTitle = selectedPrivacyOption?.name === 'Club' ? 'Choose a club' : 'Get started';
  return (
    <Wrapper>
      <OptionsWrapper>
        <H1Dark>Privacy</H1Dark>
        <View style={{ marginTop: cosmos.unit }}>

          {privacyOptions.map((option, index) => {
            return (
              <Option
                selected={option.name === selectedPrivacyOption?.name}
                onPress={() => setSelectedPrivacyOption(option)}
                key={index}>
                <View>
                  {option.value === AUDIENCE.OPEN ? <OpenPrivacyIcon width={cosmos.unit * 6} height={cosmos.unit * 6}/> : null}
                  {option.value === AUDIENCE.PRIVATE ? <PrivatePrivacyIcon width={cosmos.unit * 6} height={cosmos.unit * 6}/> : null}
                  {option.value === AUDIENCE.CLUB ? <ClubPrivacyIcon width={cosmos.unit * 6} height={cosmos.unit * 6}/> : null}
                </View>
                {/*<OptionCircle selected={option.name === selectedPrivacyOption?.name}/>*/}
                <OptionsText>
                  <OptionTitle selected={option.name === selectedPrivacyOption?.name}>{option.name}</OptionTitle>
                  <Description selected={option.name === selectedPrivacyOption?.name}>{option.description}</Description>
                </OptionsText>
              </Option>
            );
          })}
        </View>
      </OptionsWrapper>

      <ButtonContainer>
        <Button
          title={buttonTitle}
          style={{ width: '100%', opacity: selectedPrivacyOption === null ? 0.5 : 1 }}
          disabled={selectedPrivacyOption === null}
          onPress={handleFormSubmit}
        />
      </ButtonContainer>
    </Wrapper>
  );
};

export { StartConversationStep };

const OptionsWrapper = styled.View`
  padding-top: ${cosmos.unit * 3}px;
`;

const Option = styled.TouchableOpacity`
  flex-direction: row;
  height: ${cosmos.unit * 8}px;
  width: 100%;
  border-radius: 4px;
  align-items: center;
  padding: ${cosmos.unit}px;
  margin-bottom: ${cosmos.unit}px;
  border: 1px solid ${palette.primary.linen};
  ${(props) => {
  if (props?.selected) {
    return css`
          border: 1px solid ${palette.primary.bcBlue};
      `;
  }
}}
`;

const OptionsText = styled.View`
  margin-left: ${cosmos.unit}px;
`;

const Wrapper = styled.View`
  width: 100%;
  padding-top: ${cosmos.unit}px;
  padding-horizontal:${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 8}px;
`;

const OptionCircle = styled.View`
  width: ${cosmos.unit * 6}px;
  height: ${cosmos.unit * 6}px;
  background-color: ${palette.grayscale.granite};
  border-radius: ${cosmos.unit * 3}px;
  ${(props) => {
  if (props?.selected) {
    return css`
           background-color: ${palette.primary.bcBlue};
        `;
  }
}}
`;

const Description = styled(ParagraphDark)`
  font-size: 14px;
  ${(props) => {
  if (props?.selected) {
    return css`
             color: ${palette.primary.bcBlue};
      `;
  }
}}
`;

const OptionTitle = styled(H1Dark)`
  ${(props) => {
  if (props?.selected) {
    return css`
             color: ${palette.primary.bcBlue};
    `;
  }
}}
`;

const ButtonContainer = styled.View`
    margin-top: ${cosmos.unit * 3}px;
`;
