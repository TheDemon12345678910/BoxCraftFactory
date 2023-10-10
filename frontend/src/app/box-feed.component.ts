import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";
//import {UpdateBoxComponent} from "./update-box.component";
import {BoxService} from "../box.service"
@Component({
  selector: 'app-alert',
  template: `
      <ion-content style="position: absolute; top: 0;">
          <img src="assets/icon/Box-craft.png" alt="BoxCraft"/>
          <!--The big grid with 2 grids inside-->
          <ion-grid>
              <ion-row>
                  <ion-col>
                      <ion-scroll style="height:300px">
                          <div style="height:100%">
                              <ion-grid>
                                  <ion-col>
                                      <ion-row>
                                          <ion-card class=ion-card [attr.data-testid]="'card_'+box.boxTitle"
                                                    *ngFor="let box of state.boxes">
                                              <ion-toolbar>
                                                  <ion-title class="card">{{box.boxTitle}}</ion-title>
                                              </ion-toolbar>
                                              <ion-buttons>
                                                  <ion-button id="'btnDelete_'+{{box.boxTitle}}">delete</ion-button>
                                                  <ion-alert
                                                          trigger="'btnDelete_'+{{box.boxTitle}}"
                                                          header="Are you sure you want to delete this box: {{box.boxTitle}}"
                                                          [buttons]="alertButtons"
                                                  ></ion-alert>
                                              </ion-buttons>

                                              <ion-card-subtitle>Price: {{box.boxPrice}} dkk</ion-card-subtitle>
                                              <img style="max-height: 200px;" [src]="box.boxImgUrl">
                                          </ion-card>
                                      </ion-row>
                                  </ion-col>
                              </ion-grid>
                          </div>
                      </ion-scroll>
                  </ion-col>
                  <ion-col>
                      <ion-grid>
                          <ion-row>
                              <ion-col>
                                  <ion-card>
                                      <img style="max-height: 200px;" alt="Silhouette of mountains"
                                           src="https://ionicframework.com/docs/img/demos/card-media.png"/>
                                      <ion-card-header>
                                          <ion-card-title>Card Title</ion-card-title>
                                          <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                                      </ion-card-header>

                                      <ion-card-content>
                                          Here's a small text description for the card content. Nothing more, nothing
                                          less.
                                      </ion-card-content>
                                  </ion-card>
                              </ion-col>
                          </ion-row>
                      </ion-grid>
                  </ion-col>
              </ion-row>
          </ion-grid>
          <ion-fab slot="fixed" vertical="bottom" horizontal="start">
              <ion-fab-button>
                  <ion-icon name="chevron-forward-circle"></ion-icon>
              </ion-fab-button>
              <ion-fab-list side="end">
                  <ion-fab-button data-testid="createBox" (click)="openModal()">
                      <ion-icon name="hammer-outline"></ion-icon>
                  </ion-fab-button>
                  <ion-fab-button data-testid="update" (click)="updateModal()">
                      <ion-icon name="build-outline"></ion-icon>
                  </ion-fab-button>
              </ion-fab-list>
          </ion-fab>
      </ion-content>
  `,
})
export class BoxFeed implements OnInit {
  searchTerm: string | undefined;
  constructor(public http: HttpClient, public modalController: ModalController,
              public state: State, public toastController: ToastController) {
  }


  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',

    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];


  async fetchBoxes() {

    const result = await firstValueFrom(this.http.get<ResponseDto<Box[]>>(environment.baseUrl + '/api/boxes'))
    this.state.boxes = result.responseData!;


  }

  ngOnInit(): void {
    this.fetchBoxes();
  }


  async deleteBox(boxId: number | undefined) {

    try {

      await firstValueFrom(this.http.delete(environment.baseUrl + '/api/boxes/' + boxId))
      this.state.boxes = this.state.boxes.filter(b => b.boxId != boxId)
      const toast = await this.toastController.create({
        message: 'the box was successfully deleted yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        const toast = await this.toastController.create({
          message: e.error.messageToClient,
          color: "danger"
        });
        toast.present();
      }
    }

  }
  async filterBoxes() {
    const call = this.http.get<Box[]>('http://localhost:5000/api/FindBox?searchTerm=' + this.searchTerm);
    const result = await firstValueFrom<Box[]>(call);
    this.state.boxes = result;
  }
  setResult(ev: { detail: { role: any; }; }) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  async updateModal() {
    const modal = await this.modalController.create({
      component: CreateBoxComponent
    });
    modal.present();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateBoxComponent
    });
    modal.present();
  }

  protected readonly Math = Math;
}

