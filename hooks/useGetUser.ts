import { useQuery,useMutation } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { UserService } from 'shared/src/services/user-service';

export function useGetUser() {
  const result = useQuery({
    queryKey: cacheKey.myUser,
    queryFn: () => UserService.getUser(false)
  });
  return result;
}

export function useGetUserFull() {
  const result = useQuery({
    queryKey: [cacheKey.myUser, 'full'],
    queryFn: () => UserService.getUser(true)
  });
  return result;
}

export function useGetUserProfile({userId, username} : {userId?: string, username?: string}) {
  const result = useQuery({
    queryKey: [cacheKey.userProfile, userId || username],
    queryFn: () => UserService.getUserProfile(userId, username)
  });
  return result;
}