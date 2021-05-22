import { useMutation } from 'react-query';
import { BookService} from 'shared/src/services/book-service';

export function useRespondToPrompt() {
  const result = useMutation(
    async (obj: ICallObject) => {
        const { promptId, videoFile } = obj;
        const response = await BookService.respondToPrompt(promptId, videoFile);
        return response;
    }
  )
  return result;
}

type ICallObject = { promptId: string; videoFile: any };
