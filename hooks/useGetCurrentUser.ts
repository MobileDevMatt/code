import { useQuery } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { AuthenticationService} from 'services/authentication-service';

export function useGetCurrentUser() {
  const result = useQuery({
    queryKey: [cacheKey.currentCognitoUser],
    queryFn: () => AuthenticationService.getUser()
  });
  return result;
}
