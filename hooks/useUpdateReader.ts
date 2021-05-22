import { showErrorPopUp } from 'components/ModalErrorPopUp';
import { useMutation, useQueryClient } from 'react-query';
import { UserService, IAPI_User_Full } from 'shared/src/services/user-service';
import { cacheKey } from './cacheStateKey';

export const useUpdateReader = () => {
  const queryClient = useQueryClient();

  const result = useMutation(
    async (updatedReader: IAPI_User_Full) => {
        const response = await UserService.updateUser({ ...updatedReader });
        return response;
    }, {
      onSuccess: () => {
        // TODO: Hovo: Optimistic query
        queryClient.invalidateQueries(cacheKey.myUser);
      },
      onError: (error) => {
        showErrorPopUp({
          title: "Error",
          message: 'Something went wrong.\nPlease try again',
        });
        console.error('ERROR when updating reader data', error);
      }
    }
  )
  return result;
}

export const useUploadUserImage = () => {
  const result = useMutation(
    async ({imageName, fileContent} : {imageName: string, fileContent: any}) => {
      const response = await UserService.uploadReaderImage(imageName, fileContent);
      return response;
    }
  )
  return result;
}
