import { useInfiniteQuery } from 'react-query';
import { BookService } from 'shared/src/services/book-service';
import { IMembersData } from 'shared/src/types/Types';
import { cacheKey } from './cacheStateKey';

export function useGetClubReaderboardMembers ({bookId, clubID, pageSize} : {bookId: string, clubID?: string, pageSize?: number}) {
  const getClubReaderboardMembers = async ({pageParam = {pageOffset: 0, pageMark: undefined}}) : Promise<IMembersData> => {
    const result = await BookService.getReaderboardMembers(bookId, pageParam.pageOffset, pageParam.pageMark, pageSize, clubID);
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

  return useInfiniteQuery(cacheKey.selectedClubMembers, getClubReaderboardMembers, infiniteQueryOptions);
}