import { useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { IFollowersFollowing, UserService } from 'shared/src/services/user-service';

export const useFollow = ({invalidateKey, additionalInvalidateKeys} : {invalidateKey?: string | [string, string], additionalInvalidateKeys?: string[] | [string, string][]}) => {
  const queryClient = useQueryClient();
  const result = useMutation(
    async ({userID} : {userID: string}) => {
        const response = await UserService.follow(userID);
        return response;
    },
    {
      onSuccess: () => {
        // TODO: Hovo: Use optimistic update here
        queryClient.invalidateQueries(invalidateKey);

        if (additionalInvalidateKeys) {
          additionalInvalidateKeys.forEach((invKey : string | [string, string]) => {
            queryClient.invalidateQueries(invKey);
          })
        }
      },
      onError: (error) => {
        // TODO: Hovo: Show error
        console.error('Follow error', error);
      }
    }
  )
  return result;
}

export const useUnfollow = ({invalidateKey, additionalInvalidateKeys} : {invalidateKey?: string | [string, string], additionalInvalidateKeys?: string[] | [string, string][]}) => {
  const queryClient = useQueryClient();
  const result = useMutation(
    async ({userID} : {userID: string}) => {
        const response = await UserService.unfollow(userID);
        return response;
    },
    {
      onSuccess: () => {
        // TODO: Hovo: Use optimistic update here
        queryClient.invalidateQueries(invalidateKey);

        if (additionalInvalidateKeys) {
          additionalInvalidateKeys.forEach((invKey : string | [string, string]) => {
            queryClient.invalidateQueries(invKey);
          })
        }
      },
      onError: (error) => {
        // TODO: Hovo: Show error
        console.error('Unfollow error', error);
      }
    }
  )
  return result;
}

export function useGetFollowers(pageSize?: number) {
  const getFollowers = async ({pageParam = {pageMark: undefined}}) : Promise<IFollowersFollowing> => {
    const result = await UserService.getFollowers(pageParam.pageMark, pageSize);
    return result;
  }

  const infiniteQueryOptions = {
    getNextPageParam: (lastPage: IFollowersFollowing) => {
      if (lastPage.hasNextPage) {
        const returnValue = {pageMark: lastPage.pageMark};
        return returnValue;
      }
    },
  };

  return useInfiniteQuery(cacheKey.followers, getFollowers, infiniteQueryOptions);
}

export function useGetFollowing(pageSize?: number) {
  const getFollowing = async ({pageParam = {pageMark: undefined}}) : Promise<IFollowersFollowing> => {
    const result = await UserService.getFollowing(pageParam.pageMark, pageSize);
    return result;
  }

  const infiniteQueryOptions = {
    getNextPageParam: (lastPage: IFollowersFollowing) => {
      if (lastPage.hasNextPage) {
        const returnValue = {pageMark: lastPage.pageMark};
        return returnValue;
      }
    },
  };

  return useInfiniteQuery(cacheKey.following, getFollowing, infiniteQueryOptions);
}
