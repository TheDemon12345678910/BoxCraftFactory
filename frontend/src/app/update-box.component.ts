
import {Component, NgModule} from "@angular/core";
import {BoxService} from"./box.service"
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Box} from "../models";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {State} from "../state";
import {firstValueFrom} from "rxjs";
import {ModalController, ToastController} from "@ionic/angular";
@Component({

  template: `

  <ion-list>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxTitle" data-testid="titleInput" label="Insert new title for box">
        <div *ngIf="!updateBoxForm.controls.boxTitle.valid">box title must be 4 chars or more</div>
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxHeight" data-testid="boxHeightInput"  label="Insert new height for box">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxWidth" data-testid="boxWidthInput"  label="Insert new width for box">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxLength" data-testid="boxLenghtInput"  label="Insert new lenght for box">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxPrice" data-testid="boxPriceInput"  label="Insert new price for box">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxType" data-testid="boxTypeInput"  label="Insert a new type for the box">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input  [formControl]="updateBoxForm.controls.boxImgUrl"  data-testid="boxImgUrlInput"   label="Insert a new boximgurl for box">

      </ion-input>
    </ion-item>

    <ion-item>
      <ion-button data-testid="submit" [disabled]="updateBoxForm.invalid" (click)="submitUpdate()">send</ion-button>
    </ion-item>
  </ion-list>

  `
})
export class UpdateBoxComponent {
  boxElement: Box | undefined;
  constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public state: State, public toastController: ToastController,public boxService: BoxService) {
  }

  ngOnInit(){
    this.boxService.currentNumber.subscribe(boxElement=>this.boxElement=boxElement)
    console.log(this.boxService.currentNumber.subscribe(boxElement=>this.boxElement=boxElement))
  }

  boxTitle = new FormControl(this.boxService.box?.boxTitle, [Validators.minLength(4), Validators.required])

  boxLength = new FormControl(this.boxService.box?.boxLength, [Validators.min(0.1), Validators.required])

  boxHeight = new FormControl(this.boxService.box?.boxHeight, [Validators.min(0.1), Validators.required])

  boxWidth = new FormControl(this.boxService.box?.boxWidth, [Validators.min(0.1), Validators.required])

  boxPrice = new FormControl(this.boxService.box?.boxPrice, [Validators.min(0.1), Validators.required])

  boxType = new FormControl(this.boxService.box?.boxType, [Validators.minLength(1), Validators.required])

  boxImgUrl = new FormControl(this.boxService.box?.boxImgUrl, [Validators.minLength(5), Validators.required])

  updateBoxForm = this.fb.group({
    boxTitle: this.boxTitle,
    boxLength: this.boxLength,
    boxHeight: this.boxHeight,
    boxWidth: this.boxWidth,
    boxPrice: this.boxPrice,
    boxType:this.boxType,
    boxImgUrl: this.boxImgUrl
  })



  async submitUpdate() {
    let boxNumber1 = this.boxElement?.boxId
    console.log(boxNumber1)

    try {
      const observable =     this.http.put<Box>(environment.baseUrl + '/api/boxes/' + boxNumber1, this.updateBoxForm.getRawValue())
      const response = await firstValueFrom(observable);
      const boxId = this.state.boxes.findIndex(box=> box.boxId == response.boxId)
      this.state.boxes[boxId] = response;

      const toast = await this.toastController.create({
        message: 'the box was successfully updated',
        duration: 1233,
        color: "success"
      })
      toast.present();

      this.modalController.dismiss();
    } catch (e) {
      if(e instanceof HttpErrorResponse) {
        const toast = await this.toastController.create({
          message: e.error.messageToClient,
          color: "danger"
        });
        toast.present();
      }
    }
  }
}
