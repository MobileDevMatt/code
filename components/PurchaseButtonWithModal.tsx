import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, Image, Linking, StyleProp, ViewStyle } from 'react-native';
import cosmos, { palette } from 'shared/src/cosmos';
import { ModalSheet } from './ModalSheet';
import { IBook } from 'shared/src/services/book-service';
import { CustomizableButton } from 'theme/Button';

const placeholderBookImage = require('../assets/images/icon.png');

export const PurchaseButtonWithModal = ({book, style} : {book?: IBook, style?: StyleProp<ViewStyle>}) => {
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  
  let noLinksAvailable = true;
  if (book?.purchaseLinks?.amazonPurchaseLink || book?.purchaseLinks?.applePurchaseLink || book?.purchaseLinks?.bookshopPurchaseLink || book?.purchaseLinks?.libroFmPurchaseLink || book?.purchaseLinks?.customPurchaseLink?.link) {
    noLinksAvailable = false;
  }

  return (
    <View style={[{alignSelf: 'center', backgroundColor: 'transparent', flexDirection: 'row'}, style ?? {}]}>
      <CustomizableButton 
        title={'Purchase'}
        style={{backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.grayscale.granite, width: 106, height: 42}}
        onPress={() => setIsPurchaseModalVisible(true)}
      />
      <ModalSheet
        isVisible={isPurchaseModalVisible}
        setIsVisible={setIsPurchaseModalVisible}
        content={
          <View style={{alignSelf: 'stretch', alignItems: 'center'}}>
            <Image style={{marginTop: cosmos.unit, width: 79, height: 120}} source={ (book?.coverImage) ? {uri: book?.coverImage.medium} : placeholderBookImage}/>
            <PurchaseBookTitle>Purchase “{book?.title}”</PurchaseBookTitle>

            { noLinksAvailable &&
              <PurchaseBookTitle style={{fontSize: 20, marginBottom: 20}}>No purchase links are available</PurchaseBookTitle>
            }

            { !noLinksAvailable &&
              <View style={{marginBottom: 20}}>
                { book?.purchaseLinks?.bookshopPurchaseLink !== '' &&
                  <CustomizableButton
                    title={'Buy from BookShop'}
                    onPress={() => {
                      Linking.openURL(book!.purchaseLinks!.bookshopPurchaseLink!).catch(err => console.error("Couldn't load page", err));
                      setIsPurchaseModalVisible(false);
                    }}
                    style={{backgroundColor: 'transparent', marginVertical: 5}}
                    textStyle={{color: palette.grayscale.black, fontFamily: 'larsseit', fontSize: 18, lineHeight: 26}}
                  />
                }

                { book?.purchaseLinks?.libroFmPurchaseLink !== '' &&
                  <CustomizableButton
                    title={'Buy from LibroFM'}
                    onPress={() => {
                      Linking.openURL(book!.purchaseLinks!.libroFmPurchaseLink!).catch(err => console.error("Couldn't load page", err));
                      setIsPurchaseModalVisible(false);
                    }}
                    style={{backgroundColor: 'transparent', marginVertical: 5}}
                    textStyle={{color: palette.grayscale.black, fontFamily: 'larsseit', fontSize: 18, lineHeight: 26}}
                  />
                }

                { book?.purchaseLinks?.amazonPurchaseLink !== '' &&
                  <CustomizableButton
                    title={'Buy from Amazon'}
                    onPress={() => {
                      Linking.openURL(book!.purchaseLinks!.amazonPurchaseLink!).catch(err => console.error("Couldn't load page", err));
                      setIsPurchaseModalVisible(false);
                    }}
                    style={{backgroundColor: 'transparent', marginVertical: 5}}
                    textStyle={{color: palette.grayscale.black, fontFamily: 'larsseit', fontSize: 18, lineHeight: 26}}
                  />
                }

                { book?.purchaseLinks?.applePurchaseLink !== '' &&
                  <CustomizableButton
                    title={'Buy from Apple Books'}
                    onPress={() => {
                      Linking.openURL(book!.purchaseLinks!.applePurchaseLink!).catch(err => console.error("Couldn't load page", err));
                      setIsPurchaseModalVisible(false);
                    }}
                    style={{backgroundColor: 'transparent', marginVertical: 5}}
                    textStyle={{color: palette.grayscale.black, fontFamily: 'larsseit', fontSize: 18, lineHeight: 26}}
                  />
                }

                { book?.purchaseLinks?.customPurchaseLink?.link !== '' &&  book?.purchaseLinks?.customPurchaseLink?.title !== '' &&
                  <CustomizableButton
                    title={'Buy from ' + book?.purchaseLinks?.customPurchaseLink?.title}
                    onPress={() => {
                      Linking.openURL(book!.purchaseLinks!.customPurchaseLink!.link!).catch(err => console.error("Couldn't load page", err));
                      setIsPurchaseModalVisible(false);
                    }}
                    style={{backgroundColor: 'transparent', marginVertical: 5}}
                    textStyle={{color: palette.grayscale.black, fontFamily: 'larsseit', fontSize: 18, lineHeight: 26}}
                  />
                }
              </View>
            }
          </View>
        }
      />
    </View>
  );
}

const PurchaseBookTitle = styled.Text`
  margin: ${cosmos.unit * 3}px ${cosmos.unit * 2}px 0px ${cosmos.unit * 2}px;
  font-family: ivarheadline;
  font-size: 24px;
  line-height: 30px;
  color: ${palette.grayscale.black};
  text-align: center;
`;