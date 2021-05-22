import { useQuery } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { UserService } from 'shared/src/services/user-service';

export function useGetHomeFeed() {
  const result = useQuery({
    queryKey: cacheKey.readerHomeFeed,
    queryFn: () => UserService.getHomeFeed()
  });
  return result;
}