import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
// @ts-ignore
import {Box} from '../../infrastructure/DataModels';
@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private numberSource = new BehaviorSubject<Box| undefined> (undefined);

  currentNumber = this.numberSource.asObservable();

  box:Box |undefined

  updateBox(boxElement:Box){
    this.box=boxElement
    this.numberSource.next(boxElement)
  }
}
