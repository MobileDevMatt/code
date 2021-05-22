import { useMutation, useQuery } from 'react-query';
import { BookService} from 'shared/src/services/book-service';
import { cacheKey } from './cacheStateKey';

export function useGetBook({ bookId, bookTitle }: { bookId: string, bookTitle: string }) {
  const result = useQuery({
    queryKey: [cacheKey.myShelfBook, bookTitle],
    queryFn: () => BookService.getBook(bookId),
  });
  return result;
}

export function useGetBookDetail(bookId: string, clubId?: string) {
  const result = useQuery({
    queryKey: [cacheKey.book, bookId],
    queryFn: () => BookService.getBookDetail(bookId, clubId || null)
  });
  return result;
}

export function useBookSearch() {
  const result = useMutation(
    async (query: string) => {
      const response = BookService.search(query);
      return response;
    }
  )
  return result;
}
