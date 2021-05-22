import { useMutation, UseMutationResult, useQuery } from 'react-query';
import { AuthenticationService} from 'services/authentication-service';
import { cacheKey } from './cacheStateKey';

export function useSignIn() {
  const result = useMutation(
    async (data: any) => {
      const response = await AuthenticationService.signin(data);
      return response;
    },
  );
  return result;
}

export function useSignUp() {
  const result = useMutation(
    async (data: any) => {
      const response = AuthenticationService.signup(data);
      return response;
    },
  );
  return result;
}

export function useSignOut() {
  const result = useMutation(
    async () => {
      const response = AuthenticationService.signout();
      return response;
    },
  );
  return result;
}

export function useUserRole(): UseMutationResult<'author' | 'reader' | 'admin', unknown, void, unknown> {
  const result = useMutation(
    async () => {
      const response = AuthenticationService.getUserRole();
      return response;
    },
  );
  return result;
}

export function useGetCurrentUserRole() {
  const result = useQuery({
    queryKey: [cacheKey.currentUserRole],
    queryFn: () => AuthenticationService.getUserRole()
  });
  return result;
}
