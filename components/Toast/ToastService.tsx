import React, { Component } from 'react';

import Toast from './Toast';
import {
  IToastRef,
  IToastOptions,
} from './ToastTypes';

interface IProps {
  isModal?: boolean,
  onModalClose?: () => void,
}

class ToastService extends Component<IProps> {
  static toastRef: React.MutableRefObject<IToastRef | null> = React.createRef();
  static toastModalRef: React.MutableRefObject<IToastRef | null> = React.createRef();

  static getToastRef() {
    return ToastService.toastModalRef.current || ToastService.toastRef.current;
  }

  static setToastRef(ref: IToastRef | null, isModal: boolean | undefined) {
    if (isModal) {
      ToastService.toastModalRef.current = ref;
    } else {
      ToastService.toastRef.current = ref;
    }
  }

  static show (title: string, message: string, options?: IToastOptions) {
    const toastRef = ToastService.getToastRef();

    if (!toastRef) {
      return;
    }

    toastRef.show(title, message, options);
  };

  render() {
    const { isModal, onModalClose } = this.props;

    return (
      <Toast
        ref={(ref) => ToastService.setToastRef(ref, isModal)}
        onTapCallback={onModalClose}
      />
    );
  }
}

export default ToastService;
