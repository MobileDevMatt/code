import { useQuery } from 'react-query';
import { BookService} from 'shared/src/services/book-service';
import { cacheKey } from './cacheStateKey';

export function useGetDiscussionGuide(guideId: string) {
  const result = useQuery({
    queryKey: [cacheKey.discussionGuide, guideId],
    queryFn: () => BookService.getDiscussionGuide(guideId)
  })
  return result;
}
