export type IToastTapCallback = (data?: any) => void;

export interface IToastOptions {
  hasMessageIcon?: boolean,
  onTapCallback?: IToastTapCallback,
  titleIcon?: number,
}

export interface IToastState {
  type: string,
  title?: string,
  message?: string,
  payload: IToastOptions,
}

export interface IToastRef {
  show: (title: string, message: string, options?: IToastOptions) => void,
}

export interface IToastProps {
  onTapCallback?: () => void,
}
