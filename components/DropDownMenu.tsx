import React, { useState } from 'react';
import { Menu } from 'react-native-paper';
import styled from 'styled-components/native';
import { StyleProp, ViewStyle } from 'react-native';

export const DropDownMenu = ({menuButtonContent, menuItems, menuButtonStyle } : {menuButtonContent: JSX.Element, menuItems: {title: string, callback: () => void}[], menuButtonStyle?: StyleProp<ViewStyle>}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return(
    <Menu
      contentStyle={{ }}
      visible={menuVisible}
      onDismiss={() => setMenuVisible(() => false)}
      anchor={
        <ToggleMenuButton style={menuButtonStyle} onPress={() => {setMenuVisible(previousState => !previousState)}}>
          {menuButtonContent}
        </ToggleMenuButton>
       }
    >
    {
      menuItems.map((menuItem, index) => <Menu.Item onPress={menuItem.callback} title={menuItem.title} key={index}/>)
    }
    </Menu>
  );
}

const ToggleMenuButton = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
`;
