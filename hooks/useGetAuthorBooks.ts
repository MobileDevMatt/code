import { useQuery } from 'react-query';
import { cacheKey } from './cacheStateKey';
import { BookService} from 'shared/src/services/book-service';

export function useGetAuthorBooks(authorId: string) {
  const result = useQuery({
    queryKey: [cacheKey.authorBooks, authorId],
    queryFn: () => BookService.getAuthorBooks(authorId)
  });
  return result;
}
