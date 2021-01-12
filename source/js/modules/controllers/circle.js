import { CircleModel } from "../models/circle";

export class CircleController {
    constructor() {
        this.lastID = 0;
        this.circles = [];
        this.selectedCircle = null;
    }

    selectCircle(circleID) {
        this.selectedCircle = this.circles
        .filter(c => c.id === circleID)[0];
      }
    
      addCircle(r , fill, stroke, cx, cy) {
        console.log('add circle');
        const id = this.lastID;
        const circle = new CircleModel(id, r , fill, stroke, cx, cy);
        this.circles.push(circle);
        this.lastID += 1;
        //console.log(this.circles);
      }
      /*
      removePerson(personID) {
        this.persons = this.persons
          .filter(p => p.id !== parseInt(personID, 10));
      }*/
}