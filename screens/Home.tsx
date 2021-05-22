import React from 'react';
import MemberHome from 'screens/member/MemberHome';
import { useGetCurrentUser } from 'hooks/useGetCurrentUser';

export default function HomeScreen(): JSX.Element | null {
  const { data: user } = useGetCurrentUser();
  return user ? <MemberHome usr={user} /> : null;
}
