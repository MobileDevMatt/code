import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { ScrollView, ActivityIndicator } from "react-native";

import cosmos, { palette } from "shared/src/cosmos";
import {useUpdateReader, useUploadUserImage} from 'hooks/useUpdateReader';
import ImgPicker from 'components/ImgPicker';
import { IAPI_User_Full, PRIVACY_TYPE } from 'shared/src/services/user-service';

import {Button} from 'theme/Button'
import { addHttpsToLink, getLargestImage } from 'shared/src/utils';
import TextInputWithTitle from 'components/TextInputWithTitle';

import { RadioButton } from 'react-native-paper';
import { showErrorPopUp } from 'components/ModalErrorPopUp';
import { BCContainer } from 'components/containers/BCContainer';

const placeholderProfilePic = require('../../assets/images/icon.png');

const EditProfilePage = ({userData} : {userData: IAPI_User_Full} ) => {
  const [imageDataToUpload, setImageDataToUpload] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [firstName, setFirstName] = useState(userData.name.split(' ')[0]);
  const [lastName, setLastName] = useState(userData.name.split(' ')[1]);
  const [bioTextInput, setBioTextInput] = useState(userData.bio ?? '');
  const [privacySetting, setPrivacySetting] = useState<PRIVACY_TYPE>(userData.settings?.privacy ?? PRIVACY_TYPE.PUBLIC);
  const [profileImage, setProfileImage] = useState(() => getLargestImage(userData.images));

  const { mutate: uploadUserImage, ...uploadUserImageInfo } = useUploadUserImage();
  const { mutate: updateReaderData, ...updateReaderDataInfo } = useUpdateReader();

  useEffect(() => {
    setProfileImage(getLargestImage(userData.images));
  }, [userData.images]);

  const onUploadImageSuccess = (data: string) => {
    updateReaderData({
      ...userData,
      images: {
        small: data,
        medium: data,
        large: data,
      },
    });
  }

  const onChangeProfileImage = async () => {
    setShowImagePicker(() => true);
  }

  const onPressedSaveChanges = () => {
    updateReaderData({
      ...userData,
      name: `${firstName} ${lastName}`,
      bio: bioTextInput,
      settings: {
        ...userData.settings,
        privacy: privacySetting,
      }
    });
  }

  useEffect(() => {
    if (imageDataToUpload) {
      const imageName = userData?.name.trim().replace(' ', '-').toLocaleLowerCase() + '-' + userData?._id.toString() + '-' + new Date().getTime().toString();
      uploadUserImage({imageName: imageName, fileContent: imageDataToUpload}, {
        onSuccess: (data) => {
          // image preload to reduce image transition time
          setProfileImage(addHttpsToLink(data));
          onUploadImageSuccess(data)
        },
        onError: (error: any) => {
          const msg = error.toString().indexOf('413') !== -1 ? 'Image you tried to upload was too large. Please try uploading a smaller image.' : 'Something went wrong when uploading the image. Please try again';
          showErrorPopUp({
            title: "Error",
            message: msg,
          });
        }
      });
    }
  }, [imageDataToUpload]);

  const CreatePrivacyContainer = ({name} : {name: PRIVACY_TYPE}) => {
    return (
      <RadioContainer>
        <RadioButton.Android
          color={palette.primary.bcBlue}
          uncheckedColor={palette.primary.bcBlue}
          value={name}
          status={ privacySetting === name ? 'checked' : 'unchecked' }
          onPress={() => setPrivacySetting(name)}
        />
        <ProfileVisibilityText style={{flex: 1}}>
          <ProfileVisibilityOption style={{fontFamily: 'larsseitbold', flex: 1}}>{name === PRIVACY_TYPE.jamesbook ? 'jamesbook Only' : name}</ProfileVisibilityOption> - Your profile can be seen by the general public.
        </ProfileVisibilityText>
      </RadioContainer>
    )
  };

  return (
    <BCContainer style={{flex: 1, backgroundColor: palette.grayscale.whisper}} pageTitle={'Settings'} backButtonText={'Profile'} showBackButton={true} userImage={userData?.images} userFullName={userData?.name}>

      <ImgPicker showImagePicker={showImagePicker} setShowImagePicker={setShowImagePicker} setImageData={setImageDataToUpload}/>
      <ScrollView contentContainerStyle={{alignItems: 'center', paddingBottom: 100}}>
        <UserImageContainer>
          {uploadUserImageInfo.isLoading ? 
              <IndicatorContainer>
                <ActivityIndicator size='large' color={palette.grayscale.black}/>
              </IndicatorContainer>
            : 
            <UserImage source={profileImage ? { uri: profileImage } : placeholderProfilePic}/>
          }
        </UserImageContainer>

        <ChangeProfileImageButton onPress={onChangeProfileImage} disabled={uploadUserImageInfo.isLoading}>
        <ChangeProfileImageText>Replace image</ChangeProfileImageText>
        </ChangeProfileImageButton>
        <TextInputWithTitle title={'First name'} value={firstName} onChangeText={setFirstName} placeholder={'Enter your first name'} style={{marginTop: 30, marginHorizontal: 16}}/>
        <TextInputWithTitle title={'Last name'} value={lastName} onChangeText={setLastName} placeholder={'Enter your last name'} style={{marginTop: 24, marginHorizontal: 16}}/>
        <TextInputWithTitle title={'Bio'} value={bioTextInput} onChangeText={setBioTextInput} maxLength={400} placeholder={'Enter your bio'} multiline={true} style={{marginTop: 24, marginHorizontal: 16}}/>

        <ProfileVisibilityContainer>
          <ProfileVisibilityText style={{fontFamily: 'larsseitbold'}}>My profile is visible to…</ProfileVisibilityText>
          <CreatePrivacyContainer name={PRIVACY_TYPE.PUBLIC}/>
          <CreatePrivacyContainer name={PRIVACY_TYPE.jamesbook}/>
          <CreatePrivacyContainer name={PRIVACY_TYPE.PRIVATE}/>
        </ProfileVisibilityContainer>

        <Button
          title={"Save changes"}
          onPress={onPressedSaveChanges}
          style={{marginTop: 42, alignSelf: 'stretch', paddingHorizontal: 16}}
          disabled={updateReaderDataInfo.isLoading}
          loading={updateReaderDataInfo.isLoading}
        />
      </ScrollView>
    </BCContainer>
  );
}
export default EditProfilePage;

const RadioContainer = styled.View`
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  align-self: stretch;
  margin-top: 18px;
`;

const ProfileVisibilityText = styled.Text`
  font-family: larsseit;
  font-size: 16px;
  line-height: 22px;
  color: ${palette.primary.navy};
`;

const ProfileVisibilityOption = styled(ProfileVisibilityText)`
  text-transform: capitalize;
`;

const ProfileVisibilityContainer = styled.View`
  align-items: flex-start;
  align-self: stretch;
  margin: ${cosmos.unit * 4}px ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px;
`;

const ChangeProfileImageButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-top: ${cosmos.unit * 2}px;
  padding: 0px 10px 0px 10px;
`;

const ChangeProfileImageText = styled.Text`
  font-family: larsseit;
  font-size: 18px;
  line-height: 26px;
  color: ${palette.grayscale.granite};
  text-decoration-line: underline;
`;

const UserImageContainer = styled.View`
  margin: 24px ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px;
  align-items: center;
`;

const ImageBox = css`
  width: 100%;
  aspect-ratio: 1;
`;

const UserImage = styled.Image`
  ${ImageBox}
  overflow: hidden;
  border-radius: 300px;
`;

const IndicatorContainer = styled.View`
  ${ImageBox}
  align-items: center;
  justify-content: center;
`;
