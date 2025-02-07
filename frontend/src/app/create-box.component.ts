import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Box, ResponseDto} from "../models";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {State} from "../state";
import {firstValueFrom} from "rxjs";
import {ModalController, ToastController} from "@ionic/angular";

@Component({
  template: `

  <ion-list>
    <ion-item>
      <ion-input class="input" [formControl]="createNewboxForm.controls.boxTitle" data-testid="titleInput" label="The name of the new box: ">
      </ion-input>
      <div *ngIf="!createNewboxForm.controls.boxTitle.valid">box title must be 4 chars or more</div>
    </ion-item>
    <br>
    <h3>Dimentions</h3>
    <br>
    <ion-item>
      <ion-input class="inputAndMargin" [formControl]="createNewboxForm.controls.boxHeight" data-testid="boxHeightInput"  label="Height: ">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input class="inputAndMargin" [formControl]="createNewboxForm.controls.boxWidth" data-testid="boxWidthInput"  label="Width: ">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input class="inputAndMargin" [formControl]="createNewboxForm.controls.boxLenght" data-testid="boxLenghtInput"  label="Lenght: ">

      </ion-input>
    </ion-item>
    <br>
    <br>
    <ion-item>
      <ion-input class="input" [formControl]="createNewboxForm.controls.boxPrice" data-testid="boxPriceInput"  label="Cost price: ">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input class="input" [formControl]="createNewboxForm.controls.boxType" data-testid="boxTypeInput"  label="Type: ">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input class="input" [formControl]="createNewboxForm.controls.boxImgUrl"  data-testid="boxImgUrlInput"   label="Box image url: ">

      </ion-input>
    </ion-item>

    <ion-item>
      <ion-button data-testid="submit" [disabled]="createNewboxForm.invalid" (click)="submit()">send</ion-button>
    </ion-item>
  </ion-list>

  `
})
export class CreateBoxComponent {

  createNewboxForm = this.fb.group({
    boxTitle: ['', Validators.minLength(4)],
    boxHeight: ['', Validators.min(0.1)],
    boxWidth: ['', Validators.min(0.1)],
    boxLenght: ['', Validators.min(0.1)],
    boxPrice: ['', Validators.min(1)],
    boxType: ['', Validators.required],
    boxImgUrl: ['', Validators.required]
  })

  constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public state: State, public toastController: ToastController) {
  }

  async submit() {

    try {
      const observable =     this.http.post<ResponseDto<Box>>(environment.baseUrl + '/api/boxes', this.createNewboxForm.getRawValue())

      const response = await firstValueFrom(observable);
      this.state.boxes.push(response.responseData!);

      const toast = await this.toastController.create({
        message: 'the box was successfully deleted yeeees',
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
