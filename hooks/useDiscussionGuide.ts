import { useMutation, useQuery } from 'react-query';
import { BookService } from 'shared/src/services/book-service';
import { cacheKey } from './cacheStateKey';


export function useAddDiscussionGuide() {
  const result = useMutation(
    async (obj: ICallObject) => {
      const { bookId, promptText } = obj;
      const response = await BookService.addGuidePrompt(bookId, promptText);
      return response;
    },
  );
  return result;
}

export function useEditDiscussionGuide() {
  const result = useMutation(
    async (obj: IEditPromptObject) => {
      const response = await BookService.updateGuidePrompt(obj);
      return response;
    },
  );
  return result;
}

export function useDeleteDiscussionGuide() {
  const result = useMutation(
    async (promptid: string) => {
      const response = await BookService.removeGuidePrompt(promptid);
      return response;
    },
  );
  return result;
}

/**
 * @description
 * Get a single prompt from a discussion guide.
 * Recall, a discussion has a list of prompts inside of it.
 */
export function useGetDiscussionGuidePrompt({ promptId }: {promptId: string}) {
  const result = useQuery({
    queryKey: [cacheKey.discussionGuidePrompt, promptId],
    queryFn: () => BookService.getGuidePrompt(promptId)
  });
  return result;
}


type ICallObject = { bookId: string; promptText: string };
type IEditPromptObject = { _id: string; promptText?: string, promptChapter?: number };
