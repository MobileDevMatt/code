import React from 'react';
import { View } from 'react-native';
import { ROUTE } from 'lib/constants';
import { HomeIcon } from './icons/HomeIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { AudioWaveIcon } from './icons/AudioWaveIcon';
import { BellIcon } from './icons/BellIcon';

interface IProps {
  name: string | any;
  focused: boolean;
}

const colors = {
  tabIconDefault: '#DFDFE5',
  tabIconSelected: '#225AA4',
};

const GetIcon = ({route, focused} : {route: string, focused: boolean}) => {
  if (route === ROUTE.HOME) {
    return <HomeIcon width={22} height={22} color={focused ? colors.tabIconSelected : colors.tabIconDefault}/>
  } else if (route === ROUTE.DISCOVER) {
    return <MagnifyingGlassIcon width={22} height={22} color={focused ? colors.tabIconSelected : colors.tabIconDefault}/>
  } else if (route === ROUTE.CONVERSATIONS) {
    return <AudioWaveIcon width={22} height={22} color={focused ? colors.tabIconSelected : colors.tabIconDefault}/>
  } else if (route === ROUTE.NOTIFICATIONS) {
    return <BellIcon width={22} height={22} color={focused ? colors.tabIconSelected : colors.tabIconDefault}/>
  }

  return null;
}

export function TabBarIcon(props: IProps) {
  const { name, focused } = props;
  return (
    <View style={{marginBottom: -3}}>
      <GetIcon route={name} focused={focused} />
    </View>
  );
}
