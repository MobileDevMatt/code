import { useMutation, useQueryClient } from 'react-query';
import { SHELF_TYPE, UserService } from 'shared/src/services/user-service';
import { BookService, IGoogleBook } from 'shared/src/services/book-service';
import { cacheKey } from './cacheStateKey';

export const useUpdateBookProgress = () => {
  const result = useMutation(
    async ({bookId, chapter} : {bookId: string, chapter: number}) => {
        const response = await UserService.updateBookProgress(bookId, chapter);
        return response;
    }
  )
  return result;
}

export const usePauseBook = () => {
  const queryClient = useQueryClient();
  
  const result = useMutation(
    async ({bookId} : {bookId: string}) => {
        const response = await UserService.pauseBook(bookId);
        return response;
    }, 
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Pause book error", error);
      }
    }
  )
  return result;
}

export const useMarkBookComplete = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({bookId} : {bookId: string}) => {
        const response = await UserService.markBookComplete(bookId);
        return response;
    },
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Mark book complete error", error);
      }
    }
  )
  return result;
}

export const useMarkBookCurrentlyReading = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({bookId} : {bookId: string}) => {
        const response = await UserService.markBookAsReading(bookId);
        return response;
    },
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Mark currently reading error", error);
      }
    }
  )
  return result;
}

export const useSaveBookForLater = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({bookId} : {bookId: string | undefined}) => {
        const response = await UserService.saveBookForLater(bookId);
        return response;
    },
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Save book for later error", error);
      }
    }
  )
  return result;
}

export const useRemoveBook = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({bookId} : {bookId: string}) => {
        const response = await UserService.removeBookFromShelf(bookId);
        return response;
    },
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Remove book error", error);
      }
    }
  )
  return result;
}

export const useAddBookToShelf = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({book, shelfType} : {book: IGoogleBook, shelfType: SHELF_TYPE}) => {
        const response = await UserService.addBookToShelf(book, shelfType);
        return response;
    },
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Add book error", error);
      }
    }
  )
  return result;
}

export const useAddBooksToShelf = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({books, shelfType} : {books: IGoogleBook[], shelfType: SHELF_TYPE}) => {
        const response = await UserService.addBooksToShelf(books, shelfType);
        return response;
    },
    {
      onSuccess: () => {
         // TODO: Hovo: We can use optimistic update here
         queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Add books error", error);
      }
    }
  )
  return result;
}

export const useRequestBook = (bookId: string | undefined) => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async ({bookId} : {bookId: string}) => {
        const response = await BookService.requestBook(bookId);
        return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(bookId ? [cacheKey.book, bookId] : cacheKey.book);
      },
      onError: (error) => {
         // TODO: Hovo: Handle the error
         console.error("Request book error", error);
      }
    }
  )
  return result;
}