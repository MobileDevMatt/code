
import {
  CommonActions,
} from '@react-navigation/native';

let navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  if (!navigatorRef) {
    return;
  }

  navigator = navigatorRef;
}

function navigate(name: string, params?: object) {
  if (!navigator) {
    return;
  }

  navigator.dispatch(
    CommonActions.navigate({
      name,
      params,
    }),
  );
}

export default {
  setTopLevelNavigator,
  navigate,
};
