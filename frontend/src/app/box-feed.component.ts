import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";
import {UpdateBoxComponent} from "./update-box.component";
import {BoxService} from "../box.service"
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-alert',
  template: `
      <ion-content style="position: absolute; top: 0;">
          <img src="assets/icon/Box-craft.png" alt="BoxCraft"/>
          <!--The big grid with 2 grids inside-->

          <ion-item>
              <ion-input type="text" [(ngModel)]="searchTerm" placeholder="Search for boxes"
                         aria-label="Search for boxes"></ion-input>

              <ion-label>Select Material</ion-label>
              <ion-select [(ngModel)]="selectedMaterial" label="Select Material">
                  <ion-select-option value="Cardboard">Cardboard</ion-select-option>
                  <ion-select-option value="Wood">Wood</ion-select-option>
                  <ion-select-option value="Metal">Metal</ion-select-option>
                  <ion-select-option value="Plastic">Plastic</ion-select-option>


              </ion-select>

              <ion-button (click)="clearAndFetchBoxes()">Clear</ion-button>
              <ion-button (click)="filterBoxes()">Search</ion-button>
          </ion-item>


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
export class BoxFeed {
  searchTerm: string | undefined;
  selectedMaterial: string | undefined;

  constructor(public http: HttpClient, public modalController: ModalController,
              public state: State, public toastController: ToastController, private alertController: AlertController) {

    this.fetchBoxes();
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

  async clearAndFetchBoxes() {

    this.searchTerm = '';
    this.selectedMaterial = '';

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
    let url = environment.baseUrl + '/api/FindBox?';

    if (this.searchTerm) {
      url += 'searchTerm=' + this.searchTerm;
    }

    if (this.selectedMaterial) {
      // If there's already a search term, add an ampersand before adding the material
      if (this.searchTerm) {
        url += '&';
      }

      url += 'typeOfBox=' + this.selectedMaterial;
    }

    const result = await firstValueFrom(this.http.get<ResponseDto<Box[]>>(url));

    this.state.boxes = result.responseData!;

    if (!this.state.boxes || this.state.boxes.length === 0) {
      // Show an alert if the result is empty
      this.showEmptyResultAlert();
    }
  }



  async showEmptyResultAlert() {
    const alert = await this.alertController.create({
      header: 'No Boxes Found',
      message: 'Your search did not return any boxes.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Callback function when OK button is clicked
            this.fetchBoxes();
          }
        }
      ]
    });

    await alert.present();
  }
  setResult(ev: { detail: { role: any; }; }) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  async updateModal() {
    const modal = await this.modalController.create({
      component: UpdateBoxComponent
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

