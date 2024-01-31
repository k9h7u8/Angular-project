import { Student } from './../model/student';
import { Injectable } from '@angular/core';
import {  AngularFirestore} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs:AngularFirestore, private router: Router) { }


  //add student
  addStudent(student: Student){
    student.id = this.afs.createId();
    return this.afs.collection('/Students').add(student);
  }

  //get all students
  getAllStudents(){
    return this.afs.collection('/Students').snapshotChanges();
  }

  //get student
  getStudnet(student: Student){
    return this.afs.doc('/Students/' +student.id);
  }

  //delete student
  deleteStudent(student: Student){
    return this.afs.doc('/Students/' +student.id).delete();
  }

}
