export class Box {
  boxTitle?: string;
  boxHeight?: number;
  boxWidth?: number;
  boxLength?: number;
  boxPrice?: number;
  boxId?: number;
  boxImgUrl?: string;
  boxType?: string;
}

export class ResponseDto<T> {
  responseData?: T;
  messageToClient?: string;
}
