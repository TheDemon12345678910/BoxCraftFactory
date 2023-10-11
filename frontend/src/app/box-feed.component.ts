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
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-alert',
  template: `
      <ion-content style="position: absolute; top: 0;">
          <img src="assets/icon/Box-craft.png" alt="BoxCraft"/>
          <ion-item >
              <ion-input class="search-field" [formControl]="createNewboxForm.controls.boxTitle" data-testid="titleInput"
                         label="Insert title for box, please">
              </ion-input>
              <ion-button (click)="filterBoxes()">click me to find box</ion-button>
          </ion-item>

          <!--The big grid with 2 grids inside-->
          <ion-grid>
              <ion-row>
                  <ion-col>
                      <div style="width: 700px;height: 600px" class="scrollBox">
                          <ion-grid>
                              <ion-col>
                                  <ion-row>
                                      <ion-card (click)="clickedCard(box)" class=ion-card
                                                [attr.data-testid]="'card_'+box.boxTitle"
                                                *ngFor="let box of state.boxes">
                                          <img style="max-height: 200px;" [src]="box.boxImgUrl">
                                          <ion-card-title class="card">{{box.boxTitle}}</ion-card-title>
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
                                  <ion-card>
                                      <img id="infoImg" style="max-height: 200px;"
                                           src="https://ionicframework.com/docs/img/demos/card-media.png"/>
                                      <ion-card-header>
                                          <ion-card-title id="infocard">Card Title</ion-card-title>
                                          <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
                                      </ion-card-header>
                                      <ion-card-content>
                                          Here's a small text description for the card content.
                                          Nothing more, nothing
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

  createNewboxForm = this.fb.group({
    boxTitle: ['', Validators.minLength(4)]
  })
  constructor(public http: HttpClient, public modalController: ModalController,
              public state: State, public toastController: ToastController, public fb: FormBuilder) {
  }


  clickedCard(box: Box){
    console.log("Hello you clicked the card with id: " + box.boxId + " with the name: " + box.boxTitle);
    var infoCardTitle = document.getElementById("infocard");
    var infoImage = document.getElementById("infoImg") as HTMLImageElement;
    if(infoCardTitle != null && infoImage != null){
      infoCardTitle.textContent = box.boxTitle + "";
      infoImage.src = box.boxImgUrl + "";
    }
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
    const call = this.http.get<Box[]>(environment.baseUrl + '/api/FindBox?searchTerm=' + this.createNewboxForm.getRawValue().boxTitle);
    const result = await firstValueFrom<Box[]>(call);
    this.state.boxes = result;
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

