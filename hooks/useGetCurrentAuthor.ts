import { useQuery } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { AuthorService} from 'shared/src/services/author-service';

export function useGetCurrentAuthor() {
  const result = useQuery({
    queryKey: [cacheKey.myAuthor],
    queryFn: AuthorService.getMyAuthor
  });
  return result;
}
