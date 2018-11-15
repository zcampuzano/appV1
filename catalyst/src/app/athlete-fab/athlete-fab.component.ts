import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SportAuthService } from "../services/sport-auth.service";
import { AlertController, ToastController } from "@ionic/angular";

@Component({
  selector: 'app-athlete-fab',
  templateUrl: './athlete-fab.component.html',
  styleUrls: ['./athlete-fab.component.scss']
})

export class AthleteFabComponent implements OnChanges {
  stat = {PTA2: 0, PTM2: 0, PTA3: 0, PTM3: 0, AST: 0, BLK: 0,
      DRB: 0, FTA: 0, FTM: 0, ORB: 0, PF: 0, STL: 0, TO: 0};
  athlete = {number: '',};
  message;
  dropConfirm = false;
  drop;
  size = {
      h: null,
      w: null,
  };


  // athleteID prop
  _id: string = '<no id set>';
  @Input()
  set id(id: string) {
    this._id = (id && id.trim()) || '<no id set>';
  }
  get id() { return this._id; }

  // confirm score
  _confirm: boolean = false;
  @Input()
  set confirm(confirm: boolean) {
      this._confirm = (confirm) || false;
  }
  get confirm() { return this._confirm; }

  @Output() event = new EventEmitter<boolean>();
  act(event: boolean) {
      this.event.emit(event);
  }

  constructor(private sportService: SportAuthService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {}

  ngOnInit() {
      this.getAthlete();
      this.size.h = window.innerHeight;
      this.size.w = window.innerWidth;
      console.log(this.size);
  }

  ngOnChanges(changes: SimpleChanges) {
      if (this.dropConfirm) {
          this.dropped();
          this.dropConfirm = false;
          console.log(this._confirm);
      }

      if (changes.id) {
          this.getAthlete();
      }

  }

  getAthlete() {
      let storedID = window.localStorage.getItem('saveID');
      if (storedID !== this._id) {
          console.log('subOUT', storedID);
          console.log(window.localStorage.getItem(storedID));
      }
      console.log('subIN', this._id);
      this.sportService.getAthlete(this._id).subscribe(data => {
          if (data['success']) {
              this.athlete = data['athlete'];
              this.message = data['message'];
              console.log(this.athlete);
          } else {
              this.message = data['message'];
          }
      });
      window.localStorage.setItem('saveID', this._id);
      let storedStat = JSON.parse(window.localStorage.getItem(this._id));
      if (storedStat) {
          this.stat = storedStat;
      }
      //console.log(this.stat);
  }

  AST() {
      this.stat.AST += 1;
      this.actionToast(`Assist (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      //console.log(JSON.parse(window.localStorage.getItem(this._id)));
      this.act(true);
  }

  BLK() {
      this.stat.BLK += 1;
      this.actionToast(`Block (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      this.act(true);
  }

  STL() {
      this.stat.STL += 1;
      this.actionToast(`Steal (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      this.act(true);
  }

  TO() {
      this.stat.TO += 1;
      this.actionToast(`Turnover (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      this.act(true);
  }

  ORB() {
      this.stat.ORB += 1;
      this.actionToast(`Offensive Rebound (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      this.act(true);
  }

  DRB() {
      this.stat.DRB += 1;
      this.actionToast(`Defensive Rebound (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      this.act(true);
  }

  PF() {
      this.stat.PF += 1;
      this.actionToast(`Personal Foul (${this.athlete.number})`);
      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
      this.act(true);
  }

  async FT() {
      const alert = await this.alertCtrl.create({
          header: 'Free Throw',
          message: 'Please select an option...',
          buttons: [
              {
                  text: 'Miss',
                  role: 'miss',
                  cssClass: 'secondary',
                  handler: () => {
                      console.log('FT miss');
                      this.actionToast(`FT miss (${this.athlete.number}) `);
                      this.stat.FTA += 1;
                      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
                  }
              }, {
                  text: 'Make',
                  role: 'make',
                  cssClass: 'primary',
                  handler: () => {
                      console.log('FT made');
                      this.actionToast(`FT made (${this.athlete.number}) `);
                      this.stat.FTA += 1;
                      this.stat.FTM += 1;
                      if (window.localStorage.getItem('teamPoints')) {
                          let scoreUpdate = parseInt(window.localStorage.getItem('teamPoints')) + 1;
                          window.localStorage.setItem('teamPoints', JSON.stringify(scoreUpdate));
                      } else {
                          window.localStorage.setItem('teamPoints', JSON.stringify(1));
                      }
                      this.act(true);
                      window.localStorage.setItem(this._id, JSON.stringify(this.stat));
                  }
              }
          ]
      });

      await alert.present();
  }

  async actionToast(message) {
      const toast = await this.toastCtrl.create({
          message: message,
          duration: 1000,
          cssClass: 'normalToast'
      });
      toast.present();
  }

  dragStart(event){
        //console.log('Drag started', event);
  }

  dropped() {
    if(this.drop === 2) {
        this.stat.PTA2 += 1;
        if (this._confirm) {
            this.stat.PTM2 += 1;
            this.actionToast(`2 Points (${this.athlete.number})`);
            if (window.localStorage.getItem('teamPoints')) {
                let scoreUpdate = parseInt(window.localStorage.getItem('teamPoints')) + 2;
                window.localStorage.setItem('teamPoints',  JSON.stringify(scoreUpdate));
            } else {
                window.localStorage.setItem('teamPoints', JSON.stringify(2));
            }
            this.act(true);
        } else {
            this.actionToast(`Miss (${this.athlete.number})`);
        }
        window.localStorage.setItem(this._id, JSON.stringify(this.stat));
    } else if (this.drop === 3) {
        this.stat.PTA3 += 1;
        if (this._confirm) {
            this.stat.PTM3 += 1;
            this.actionToast(`3 Points (${this.athlete.number})`);
            if (window.localStorage.getItem('teamPoints')) {
                let scoreUpdate = parseInt(window.localStorage.getItem('teamPoints')) + 3;
                console.log(scoreUpdate);
                window.localStorage.setItem('teamPoints',  JSON.stringify(scoreUpdate));
            } else {
                window.localStorage.setItem('teamPoints', JSON.stringify(3));
            }
            this.act(true);
        } else {
            this.actionToast(`Miss (${this.athlete.number})`);
        }
        window.localStorage.setItem(this._id, JSON.stringify(this.stat));
    }
  }

  dragEnd(event) {
      console.log('Element was dragged end', event);

      const grid = {
          x: event.x - this.size.w/2,
          y: event.y - this.size.h*.08,
      };


      //todo continue testing
      if (event.y <= this.size.h*.57) {
          const isY2 = grid.y**2 <= (1 - ((grid.x**2)/((this.size.w*.48)**2))) * ((this.size.h*.30)**2);
          if (this.size.w*.12 <= event.x && event.x <= this.size.w*.88 && isY2) {
              this.drop = 2;
          } else {
              this.drop = 3;
          }
      }

      this.dropConfirm = true;
  }

  pressEvent(event){
        event.preventDefault();
        //console.log('Element was tapped', event);
  }
}
