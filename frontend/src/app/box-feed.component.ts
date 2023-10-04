import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";

@Component({
  template: `

      <ion-content style="position: absolute; top: 0;">
          <img src="assets/icon/Box-craft.png" alt="BoxCraft"/>
          <ion-list>
              <ion-card [attr.data-testid]="'card_'+box.boxTitle" *ngFor="let box of state.boxes">
                  <ion-toolbar>
                      <ion-title>{{box.boxTitle}}</ion-title>
                  </ion-toolbar>
                  <ion-buttons>
                      <ion-button (click)="deleteBox(box.boxId)">delete</ion-button>
                  </ion-buttons>
                  <ion-card-subtitle>Price: {{box.boxPrice}} dkk</ion-card-subtitle>
                  <img style="max-height: 200px;" [src]="box.boxImgUrl">
              </ion-card>
          </ion-list>

          <ion-fab>
              <ion-fab-button data-testid="createBox" (click)="openModal()">
                  <ion-icon name="add-outline"></ion-icon>
              </ion-fab-button>
          </ion-fab>

      </ion-content>



  `,
})
export class BoxFeed implements OnInit {


  constructor(public http: HttpClient,public modalController: ModalController,
              public state: State, public toastController: ToastController) {

  }

  async fetchBoxes() {

      const result = await firstValueFrom(this.http.get<ResponseDto<Box[]>>(environment.baseUrl + '/api/boxes'))
      this.state.boxes = result.responseData!;



  }

  ngOnInit(): void {
    this.fetchBoxes();
  }


  async deleteBox(boxId: number | undefined) {
    try {
      await firstValueFrom(this.http.delete(environment.baseUrl + '/api/boxes/'+boxId))
      this.state.boxes = this.state.boxes.filter(b => b.boxId != boxId)
      const toast = await this.toastController.create({
        message: 'the box was successfully deleted yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();
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

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateBoxComponent
    });
    modal.present();
  }

  protected readonly Math = Math;
}

