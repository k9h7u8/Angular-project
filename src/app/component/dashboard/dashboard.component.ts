import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Student } from 'src/app/model/student';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  studentList: Student[] =[];
  studentObj: Student = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    photo: '',
  };
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  mobile: string = '';
  photo: string = '';

  constructor(private auth:AuthService, private data:DataService, private fireStorage: AngularFireStorage){}

  ngOnInit(): void {
    this.getAllStudents();
  }

  logout(){
    this.auth.logout();
  }

  getAllStudents(){
    this.data.getAllStudents().subscribe({
      next: (res)=>{
        this.studentList = res.map((e:any)=>{
          const data =e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
      },
      error: (err: any) => { 
        alert('Error while fetching the the data');
      }
    })
  }

  resetForm() {
    this.id = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.mobile = '';
    this.photo = '';
  }

  addStudent(){
    if (this.first_name == '' || this.last_name == '' || this.mobile == '' || this.email == ''|| this.photo == '') {
      alert('Fill all input fields');
      return;
    }

    this.studentObj.id = '';
    this.studentObj.email = this.email;
    this.studentObj.first_name = this.first_name;
    this.studentObj.last_name = this.last_name;
    this.studentObj.mobile = this.mobile;
    this.studentObj.photo = this.photo;

    this.data.addStudent(this.studentObj);
    this.resetForm();
  }

  deleteStudent(student: Student) {
    if(window.confirm('Are you sure you want to delete '+student.first_name+ ' ' + student.last_name+ ' ?')){
      this.data.deleteStudent(student);
    }
  }

  async onFileChange(event:any){
    const file = event.target.files[0];
    if(file){
      const path =`image/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      this.photo  = url;
    }
  }

}
