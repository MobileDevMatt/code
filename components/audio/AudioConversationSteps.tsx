import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated, Easing } from 'react-native';
import RtcEngine from 'react-native-agora';
import Swiper from 'react-native-swiper';
import { StartConversationStep } from './StartConversationStep';
import { ClubSelectionStep } from './ClubSelectionStep';
import { ClubBookSelectionStep } from './ClubBookSelectionStep';
import { ReviewOptionsStep } from './ReviewOptionsStep';
import { AddTopicStep } from './AddTopicStep';
import { ModalSheet } from '../ModalSheet';
import { useGoLive } from 'hooks/useConversations';
import { useGetUser } from 'hooks/useGetUser';

import { AUDIENCE } from 'shared/src/services/conversation-service';
import { useLiveAudio } from 'context/LiveAudioContext';
import { IBook } from 'shared/src/services/book-service';
import { ROUTE } from 'lib/constants';
import { IClubDetail } from 'shared/src/services/club-service';
import { IUser_Club } from 'shared/src/services/user-service';


interface IProps {
  setIsStartingConversation: React.Dispatch<React.SetStateAction<boolean>>;
  book?: IBook;
  club?: IClubDetail & IUser_Club;
}

interface ITopicFormData {
  topic: string;
  description: string;
}

export const AudioConversationSteps = ({ setIsStartingConversation, book, club }: IProps) => {

  const scrollViewRef = useRef<Swiper>(null);
  const navigation = useNavigation();
  const { data: user } = useGetUser();
  const [totalPages, setTotalPages] = useState(4);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isTopicModalVisible, setIsTopicModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  // Set default privacy setting when a user starts a conversation
  const [selectedPrivacyOption, setSelectedPrivacyOption] = useState<{ name: string, description: string, value: AUDIENCE } | undefined>({
    name: 'Open',
    description: 'Anyone can join',
    value: AUDIENCE.OPEN,
  });
  const [selectedClub, setSelectedClub] = useState<(IClubDetail & IUser_Club) | undefined>(club);
  const [selectedClubBook, setSelectedClubBook] = useState<IBook | undefined>(book);
  const [isRecordSwitchOn, setIsRecordSwitchOn] = useState(false);
  const [isScheduleSwitchOn, setIsScheduleSwitchOn] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(new Animated.Value(420));


  const { agoraClient, setLiveConversation } = useLiveAudio();
  const { mutateAsync: goLive, ...goLiveInfo } = useGoLive();


  useEffect(() => {
    adjustModalHeight();
  }, [currentPage]);


  const goToNextStep = (): void => {
    if (currentPage < (totalPages - 1)) { // actually TOTAL_NUMBER_OF_PAGES -1 will be the last pages index
      scrollViewRef.current?.scrollBy(1); // go forward one page
      setCurrentPage((prevState) => prevState + 1);
    } else {
      goLiveWithConversation();
    }
  };

  const goToFirststep = () => {
    setCurrentPage(0);
    scrollViewRef.current?.scrollTo(0);
  };

  const pages = [
    <StartConversationStep
      key={0}
      selectedPrivacyOption={selectedPrivacyOption}
      setSelectedPrivacyOption={setSelectedPrivacyOption}
      book={book}
      club={club}
      goToNextStep={goToNextStep}/>,
    <ClubSelectionStep
      key={1}
      selectedClub={selectedClub}
      setSelectedClub={setSelectedClub}
      goToNextStep={goToNextStep}/>,
    <ClubBookSelectionStep
      key={2}
      selectedClub={selectedClub}
      selectedPrivacyOption={selectedPrivacyOption}
      selectedClubBook={selectedClubBook}
      setSelectedClubBook={setSelectedClubBook}
      goToNextStep={goToNextStep}/>,
    <ReviewOptionsStep
      key={3}
      goToFirststep={goToFirststep}
      selectedPrivacyOption={selectedPrivacyOption}
      selectedClubBook={selectedClubBook}
      selectedClub={selectedClub}
      isGoingLive={goLiveInfo.isLoading}
      isRecordSwitchOn={isRecordSwitchOn}
      setIsRecordSwitchOn={setIsRecordSwitchOn}
      setSelectedClubBook={setSelectedClubBook}
      topic={topic}
      setIsTopicModalVisible={setIsTopicModalVisible}
      setIsScheduleSwitchOn={setIsScheduleSwitchOn}
      isScheduleSwitchOn={isScheduleSwitchOn}
      goToNextStep={goToNextStep}/>,
  ];

  if (book) {
    pages.splice(1, 2);
  }else if(club){
    pages.splice(1, 1);
  }else if(selectedPrivacyOption?.name === 'Open' ){
    pages.splice(1, 1);
  }

  useEffect(() => {
    setTotalPages(pages.length);
  }, [pages.length]);


  const goLiveWithConversation = async () => {
    const conversationResponse = await goLive({
      data: {
        audience: selectedPrivacyOption?.value as AUDIENCE,
        description,
        topic: topic || selectedClubBook?.title!,
        record: isRecordSwitchOn,
        userId: user?._id as string,
        bookId: selectedClubBook?._id,
        clubId: selectedClub?._id,
      },
      agoraClient: agoraClient as RtcEngine
    });

    setLiveConversation(conversationResponse?.conversation);
    setIsStartingConversation(false);
    navigation.navigate(ROUTE.AUDIO, {
      screen: ROUTE.LIVE_AUDIO_CONVERSATION,
      params: {
        book: conversationResponse?.conversation?.book,
        isRecording: isRecordSwitchOn,
        agoraChannelName: conversationResponse?.agoraChannelName,
      },
    });
  };


  const saveTopicAndDescription = (data: ITopicFormData) => {
    setTopic(data.topic);
    setDescription(data.description);
    setIsTopicModalVisible(false);
  };

  const adjustModalHeight = () => {
    // TODO: we might want to change the implementation to be page specific
    if (currentPage >= 1) {
      Animated.spring(animatedHeight, {
        toValue: 600,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 420,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: false,
      }).start();
    }
  };

  const animatedHeightStyle = { height: animatedHeight };


  return (
    <Animated.View style={animatedHeightStyle}>
      <Swiper
        showsPagination={false}
        loadMinimal={true}
        scrollEnabled={false}
        removeClippedSubviews={false}
        loop={false}
        key={pages.length}
        keyboardShouldPersistTaps={'handled'}
        ref={scrollViewRef}>
        {pages.map(page => page)}
      </Swiper>
      <ModalSheet
        isVisible={isTopicModalVisible}
        setIsVisible={setIsTopicModalVisible}
        onClose={() => setIsTopicModalVisible(false)}
        onOpen={() => setIsTopicModalVisible(true)}
        content={
          <AddTopicStep saveTopicAndDescription={saveTopicAndDescription} topic={topic} description={description}/>
        }/>
    </Animated.View>
  );
};
