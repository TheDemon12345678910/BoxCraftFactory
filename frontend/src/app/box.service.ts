import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
// @ts-ignore
import {Box} from '../../infrastructure/DataModels';
@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private numSource = new BehaviorSubject<Box| undefined> (undefined);

  currentNum = this.numSource.asObservable();

  box:Box |undefined


  updateBox(boxElement:Box){
    this.box=boxElement
    this.numSource.next(boxElement)
  }
}
