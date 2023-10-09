import {Component, NgModule} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Box, ResponseDto} from "../models";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {State} from "../state";
import {firstValueFrom} from "rxjs";
import {ModalController, ToastController, IonicModule} from "@ionic/angular";
import {BoxService} from"../box.service"

@Component({
  template: `

  <ion-list>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxTitle" data-testid="titleInput" label="Insert new title for box" placeholder="">

      </ion-input>
      <div *ngIf="!updateBoxForm.controls.boxTitle.valid">box title must be 4 chars or more</div>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxHeight" data-testid="boxHeightInput"  label="Insert new height for box" placeholder="">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxWidth" data-testid="boxWidthInput"  label="Insert new width for box" placeholder="">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxLenght" data-testid="boxLenghtInput"  label="Insert new lenght for box" placeholder="">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxPrice" data-testid="boxPriceInput"  label="Insert new price for box" placeholder="">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="updateBoxForm.controls.boxType" data-testid="boxTypeInput"  label="Insert a new type for the box" placeholder="">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input  [formControl]="updateBoxForm.controls.boxImgUrl"  data-testid="boxImgUrlInput"   label="Insert a new boximgurl for box" placeholder="">

      </ion-input>
    </ion-item>

    <ion-item>
      <ion-button data-testid="submit" [disabled]="updateBoxForm.invalid" (click)="submit()">send</ion-button>
    </ion-item>
  </ion-list>

  `
})
export class UpdateBoxComponent {

  updateBoxForm = this.fb.group({
    boxTitle: ['', Validators.minLength(4)],
    boxHeight: ['', Validators.required],
    boxWidth: ['', Validators.required],
    boxLenght: ['', Validators.required],
    boxPrice: ['', Validators.required],
    boxType: ['', Validators.required],
    boxImgUrl: ['', Validators.required]
  })

  constructor(public boxService: BoxService, public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public state: State, public toastController: ToastController) {
  }
  ngOnInit() {
    this.loadBoxInformation();
  }
  box!:Box;
  loadBoxInformation() {
    this.boxService.getBoxInformation().subscribe(
      (data) => {
        this.box = data;
      },
      (error) => {
        console.error('Error fetching box information:', error);
      }
    );
  }

  async submit() {

    try {
      const observable =     this.http.put<ResponseDto<Box>>(environment.baseUrl + '/api/boxes', this.updateBoxForm.getRawValue())

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
