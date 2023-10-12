export class Box {
  boxId?: number;
  boxTitle?: string;
  boxHeight?: number;
  boxWidth?: number;
  boxLength?: number;
  boxPrice?: number;
  boxImgUrl?: string;
  boxType?: string;
}

export class ResponseDto<T> {
  responseData?: T;
  messageToClient?: string;
}
