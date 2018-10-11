import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-athlete-fab',
  templateUrl: './athlete-fab.component.html',
  styleUrls: ['./athlete-fab.component.scss']
})

export class AthleteFabComponent implements OnInit {
  _id = '';

  @Input()
  set id(id: string) {
      this._id = id;
  }

  constructor() {
    console.log(this._id);
  }

  ngOnInit() {
  }

  dragStart(event){
        console.log('Drag started', event);

  }

  dragEnd(event) {
        console.log('Element was dragged end', event);
  }

  pressEvent(event){
        event.preventDefault();
        console.log('Element was tapped', event);
  }
}
