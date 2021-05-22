import React from 'react';
import cosmos, { palette } from 'shared/src/cosmos';
import styled, { css } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { H1Dark, ParagraphDark } from 'theme/Typography';
import { Button } from 'theme/Button';
import { IClubDetail } from 'shared/src/services/club-service';
import { useGetUserFull } from '../../hooks/useGetUser';
import { IUser_Club } from 'shared/src/services/user-service';

interface IProps {
  setSelectedClub: React.Dispatch<React.SetStateAction<undefined | (IClubDetail & IUser_Club)>>;
  goToNextStep: () => void;
  selectedClub?: (IClubDetail & IUser_Club) | undefined;
}

export const ClubSelectionStep = ({ setSelectedClub, selectedClub, goToNextStep }: IProps) => {
  const insets = useSafeAreaInsets();
  const { data: fullUser, isLoading: isLoadingUserData } = useGetUserFull();

  const { clubs = [] } = fullUser;

  const handleFormSubmit = () => {
    goToNextStep();
  };

  return (
    <>
      <Wrapper contentContainerStyle={{ paddingBottom: cosmos.unit * 6 }}>
        <OptionsWrapper>
          <TitleContainer>
            <H1Dark>Choose a club</H1Dark>
          </TitleContainer>
          <View style={{ marginTop: cosmos.unit }}>
            {(isLoadingUserData) ? (<ActivityIndicator size='large' color={palette.grayscale.black}/>) : (
              <>
                {clubs.map((club: (IClubDetail & IUser_Club) | undefined, index: number) => {
                  return (
                    <Option
                      selected={club?._id === selectedClub?._id}
                      onPress={() => setSelectedClub(club)}
                      key={index}>
                      <OptionsText>
                        <OptionTitle selected={club?._id === selectedClub?._id}>{club?.name}</OptionTitle>
                        {!!club?.memberCount ? (
                          <Description selected={club._id === selectedClub?._id}>
                            {club?.memberCount}
                            {club?.memberCount > 1 ? 'members' : 'member'}
                          </Description>
                        ) : null}
                      </OptionsText>
                    </Option>
                  );
                })}
              </>
            )}
          </View>
        </OptionsWrapper>


      </Wrapper>
      {(!isLoadingUserData) ? (
        <ButtonContainer style={{ marginBottom: Math.max(insets.bottom, 16) }}>
          <Button
            title={'Next'}
            style={{ width: '100%', opacity: selectedClub === null ? 0.5 : 1 }}
            disabled={selectedClub === null}
            onPress={handleFormSubmit}
          />
        </ButtonContainer>
      ) : null}
    </>
  );
};

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
  ${(props: any) => {
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

const TitleContainer = styled.View`
  margin-bottom:  ${cosmos.unit * 2}px;
`;

const Wrapper = styled.ScrollView`
  width: 100%;
  padding-horizontal:${cosmos.unit * 2}px;
  padding-bottom: ${cosmos.unit * 8}px;
`;

const Description = styled(ParagraphDark)`
  font-size: 14px;
  ${(props: any) => {
  if (props?.selected) {
    return css`
      color: ${palette.primary.bcBlue};
    `;
  }
}}
`;

const OptionTitle = styled(H1Dark)`
  ${(props: any) => {
  if (props?.selected) {
    return css`
      color: ${palette.primary.bcBlue};
    `;
  }
}}
`;

const ButtonContainer = styled.View`
  margin-top: ${cosmos.unit * 3}px;
  padding-horizontal:${cosmos.unit * 2}px;
`;
