import { useInfiniteQuery, useMutation, useQuery, UseMutationResult, UseQueryResult } from 'react-query';
import { ClubService, IClubDetail } from 'shared/src/services/club-service';
import { IMembersData } from 'shared/src/types/Types';
import { cacheKey } from './cacheStateKey';

export function useGetFeaturedjamesbooks() {
  const result = useQuery({
    queryKey: [cacheKey.featuredClubs],
    queryFn: () => ClubService.getFeaturedClubs(),
  });
  return result;
}

export function useGetClubMutation(): UseMutationResult<IClubDetail | null, unknown, string, unknown> {
  const result = useMutation(
    async (clubId: string) => {
      const isInvalidClubId = clubId?.length < 1;
      if(isInvalidClubId) return null;

      const response = ClubService.getClub(clubId);
      return response;
    },
  );
  return result;
}

export function useGetClub(clubId?: string, username?: string): UseQueryResult<IClubDetail, unknown> {
  if (username !== undefined) {
    return useQuery({
      queryKey: [cacheKey.selectedClub, clubId],
      queryFn: () => ClubService.getClubByusername(username),
    });
  } else {
    return useQuery({
      queryKey: [cacheKey.selectedClub, clubId],
      queryFn: () => ClubService.getClub(clubId!),
    });
  }
}

export function useJoinClub() {
  const result = useMutation(
    async (clubId: string) => {
      const response = await ClubService.joinClub(clubId);
      return response;
    }
  );
  return result;
}

export function useLeaveClub() {
  const result = useMutation(
    async (clubId: string) => {
      const response = await ClubService.leaveClub(clubId);
      return response;
    }
  );
  return result;
}

export function useGetClubMembers(clubID: string, pageSize?: number) {
  const getClubMembers = async ({pageParam = {pageOffset: 0, pageMark: undefined}}) : Promise<IMembersData> => {
    const result = await ClubService.getClubMembers(clubID, pageParam.pageOffset, pageParam.pageMark, pageSize);
    return result;
  }

  const infiniteQueryOptions = {
    getNextPageParam: (lastPage: IMembersData) => {
      if (lastPage.nextPage) {
        const returnValue = {pageOffset: lastPage.nextPage, pageMark: lastPage.pageMark};
        return returnValue;
      }
    },
  };

  return useInfiniteQuery(cacheKey.selectedClubMembers, getClubMembers, infiniteQueryOptions);
}
