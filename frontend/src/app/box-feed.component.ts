import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";
import {UpdateBoxComponent} from "./update-box.component";
import {BoxService} from "../box.service";
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-alert',
  template: `
      <ion-content style="position: absolute; top: 0;">
          <img src="assets/icon/Box-craft.png" alt="BoxCraft"/>
          <!--The big grid with 2 grids inside-->

          <ion-item>
              <ion-input class="search-field" type="text" [(ngModel)]="searchTerm" placeholder="Search for boxes"
                         aria-label="Search for boxes"></ion-input>
              <ion-label>Select Material</ion-label>
              <ion-select [(ngModel)]="selectedMaterial" label="Select Material">
                  <ion-select-option value="Cardboard">Cardboard</ion-select-option>
                  <ion-select-option value="Wood">Wood</ion-select-option>
                  <ion-select-option value="Metal">Metal</ion-select-option>
                  <ion-select-option value="Plastic">Plastic</ion-select-option>
              </ion-select>
              <ion-button class="button-search" (click)="clearAndFetchBoxes()">Clear</ion-button>
              <ion-button class="button-search" (click)="filterBoxes()">Search</ion-button>
          </ion-item>
          <ion-grid>
              <ion-row>
                  <ion-col>
                      <div class="cards-list">
                          <ion-grid>
                              <ion-col>
                                  <ion-row>
                                      <ion-card class="box-card" (click)="clickedCard(box)"
                                                [attr.data-testid]="'card_'+box.boxTitle"
                                                *ngFor="let box of state.boxes">
                                          <div style="display: flex; align-items: center;justify-content: center;">
                                              <img style="max-height: 200px;" [src]="box.boxImgUrl">
                                          </div>

                                          <ion-card-title class="box-info-card-name">{{box.boxTitle}}</ion-card-title>
                                      </ion-card>
                                  </ion-row>
                              </ion-col>
                          </ion-grid>
                      </div>
                  </ion-col>
                  <ion-col>
                      <ion-grid>
                          <ion-row>
                              <ion-col>
                                  <ion-card class="box-info-card">
                                      <div style="display: flex; align-items: center;justify-content: center;">
                                          <img id="infoImg" style="max-height: 250px;"
                                               src="https://ionicframework.com/docs/img/demos/card-media.png"/>
                                      </div>
                                      <ion-card-header>
                                          <ion-card-title class="box-info-card-name" id="infocard">Card Title
                                          </ion-card-title>
                                      </ion-card-header>
                                      <ion-card-content id="content" class="box-info-card-data">
                                          <p id="infoContent"></p>
                                          <strong>Mesurements</strong>
                                          <p id="height"></p>
                                          <p id="lenth"></p>
                                          <p id="width"></p>
                                        <br>
                                          <p id="type"></p>
                                        <br>
                                          <p id="price"></p>
                                          <button class="button-createAndEdit" id="deleteButton" (click)="deleteBox()">
                                              <ion-icon name="trash-outline"></ion-icon>
                                          </button>
                                          <button class="button-createAndEdit" id="updateButton"
                                                  (click)="updateModal()">
                                              <ion-icon name="build-outline"></ion-icon>
                                          </button>
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
              </ion-fab-list>
          </ion-fab>
      </ion-content>
  `,
})

export class BoxFeed implements OnInit {
  searchTerm: string | undefined;
  selectedMaterial: string | undefined;
  selectedBoxID: number | undefined;

  constructor(public http: HttpClient, public modalController: ModalController,
              public state: State, public toastController: ToastController, private alertController: AlertController) {

    this.fetchBoxes();
  }

  ngOnInit(): void {
    console.log("Running program")
  }

  setInfoCard(box: Box) {
    var infoCardTitle = document.getElementById("infocard") as HTMLElement;
    var infoImage = document.getElementById("infoImg") as HTMLImageElement;
    var infoHeight = document.getElementById("height") as HTMLElement;
    var infoLength = document.getElementById("lenth") as HTMLElement;
    var infoWidth = document.getElementById("width") as HTMLElement;
    var infoType = document.getElementById("type") as HTMLElement;
    var infoPrice = document.getElementById("price") as HTMLElement;
    if (infoCardTitle != null && infoImage != null) {
      infoImage.src = box.boxImgUrl + "";
      infoCardTitle.textContent = box.boxTitle + "";
      infoHeight.textContent = "Height: " + box.boxHeight + " cm";
      infoLength.textContent = "Lenth: " + box.boxLength + "cm";
      infoWidth.textContent = "Width: " + box.boxWidth + "cm";
      infoType.textContent = "Type: " + box.boxType;
      infoPrice.textContent = "Cost price: " + box.boxPrice + " dkr";
      }
  }

  clickedCard(box: Box) {
    console.log("Hello you clicked the card with id: " + box.boxId + " with the name: " + box.boxTitle);
    this.selectedBoxID = box.boxId;
    this.setInfoCard(box)
  }

  async fetchBoxes() {

    const result = await firstValueFrom(this.http.get<ResponseDto<Box[]>>(environment.baseUrl + '/api/boxes'))
    this.state.boxes = result.responseData!;


  }

  async clearAndFetchBoxes() {

    this.searchTerm = '';
    this.selectedMaterial = '';

    this.fetchBoxes();
  }

  async deleteBox() {

    try {
      await firstValueFrom(this.http.delete(environment.baseUrl + '/api/boxes/' + this.selectedBoxID))
      this.state.boxes = this.state.boxes.filter(b => b.boxId != this.selectedBoxID)
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

    const result = await firstValueFrom(this.http.get<Box[]>(url))

    this.state.boxes = result;

    console.log(result)
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
  protected readonly console = console;
}

