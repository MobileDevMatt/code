import { useMutation, useQuery } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { ClubService } from 'shared/src/services/club-service';

export function useGetClubFeed(clubId: string) {
  const result = useQuery({
    queryKey: [cacheKey.clubFeed, clubId],
    queryFn: () => ClubService.getClubFeed(clubId),
  });
  return result;
}

export function usePostToClubFeed() {
  const result = useMutation(
    async ({clubId, textContent} : {clubId: string, textContent: string}) => {
      const response = await ClubService.postToClubFeed(clubId, textContent);
      return response;
    }
  );
  return result; 
}

export function useDeletePostFromClubFeed() {
  const result = useMutation(
    async ({clubId, postId} : {clubId: string, postId: string}) => {
      const response = await ClubService.deletePostFromClubFeed(clubId, postId);
      return response;
    }
  );
  return result; 
}
