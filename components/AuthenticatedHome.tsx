import React, { useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Loading from './Loading';
import { useGetCurrentUserRole } from '../hooks/useAuth';
import { ROUTE } from '../lib/constants';

const AuthenticatedHome = () => {
  const { data: userRole } = useGetCurrentUserRole();
  const navigation = useNavigation();

  const checkUserRole = () => {
    if (userRole === 'author') {
      navigation.navigate(ROUTE.DISCUSSION);
    } else if (userRole === 'reader') {
      navigation.navigate(ROUTE.MAIN);
    }
  };

  useEffect(() => {
    checkUserRole();
  }, [userRole]);

  useFocusEffect(
    useCallback(() => {
      checkUserRole();
    }, [userRole]),
  );

  return (
    <Loading/>
  );
};

export default AuthenticatedHome;
